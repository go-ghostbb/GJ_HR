<template>
  <div v-loading="loading" class="m-4 bg-white">
    <!-- header -->
    <div :class="`${prefixCls}-header`">
      <div>
        <span>{{ '簽核設定' }}</span>
      </div>
      <div>
        <Button class="mr-2" size="small" @click="fetch">重置</Button>
        <Button class="mr-2" type="primary" size="small" @click="handleSave">儲存</Button>
      </div>
    </div>

    <!-- body -->
    <div class="p-2" :class="prefixCls">
      <Form ref="formRef" :model="fromData" layout="vertical">
        <!-- 年資設定 -->
        <template v-for="(item, index) in formState.setting" :key="`rate-${index}`">
          <div style="display: flex; flex-direction: row; width: 100%">
            <Tag>{{ `關卡${index + 1}` }}</Tag>
          </div>
          <div :class="`${prefixCls}-form-item`" style="display: flex; flex-direction: row">
            <Divider type="vertical" />
            <!-- 把form item獨立成一個區塊, 為了讓form item垂直且並排divider -->
            <div>
              <div style="display: flex; flex-direction: row">
                <!-- 天數 -->
                <FormItem
                  class="ml-1"
                  label="觸發時數"
                  :name="`gteHour_${index}`"
                  :rules="formRules.gteHour"
                >
                  <Input v-model:value="item.gteHour" />
                </FormItem>

                <!-- notify -->
                <FormItem
                  class="ml-3"
                  label="通知"
                  :name="`notify_${index}`"
                  :rules="formRules.notify"
                >
                  <Select v-model:value="item.notify">
                    <SelectOption :value="SignNotify.SignOffPlusNotify">{{
                      '簽核通知'
                    }}</SelectOption>
                    <SelectOption :value="SignNotify.NotifyOnly">{{ '僅通知' }}</SelectOption>
                  </Select>
                </FormItem>
              </div>

              <div style="display: flex; flex-direction: row">
                <!-- sign type -->
                <FormItem
                  class="ml-1"
                  label="簽核類型"
                  :name="`signType_${index}`"
                  :rules="formRules.signType"
                >
                  <Select v-model:value="item.signType">
                    <SelectOption :value="SignType.DepartmentManager">{{
                      '部門主管'
                    }}</SelectOption>
                    <SelectOption :value="SignType.SpecificEmployee">{{ '特定人員' }}</SelectOption>
                  </Select>
                </FormItem>

                <!-- specific employee -->
                <FormItem
                  v-show="item.signType === SignType.SpecificEmployee"
                  class="ml-3"
                  label="選擇員工"
                  :name="`specificEmployeeId_${index}`"
                  :rules="formRules.specificEmployeeId"
                >
                  <EmployeePicker
                    :ref="(el) => setEmployeePickerRef(el, index)"
                    v-model:employeeId="item.specificEmployeeId"
                    @change="formRef?.validateFields(`specificEmployeeId_${index}`)"
                  />
                </FormItem>
              </div>

              <!-- 備註 -->
              <FormItem class="ml-1" label="備註" :name="`remark_${index}`" style="width: 532px">
                <Input v-model:value="item.remark" show-count :maxlength="50" />
              </FormItem>
            </div>

            <!-- 刪除關卡 -->
            <div class="ml-3" style="display: flex; align-items: center">
              <Button type="text" danger @click="handleRemove(index)">
                <template #icon>
                  <CloseOutlined />
                </template>
              </Button>
            </div>
          </div>
        </template>
      </Form>

      <!-- 新增關卡按鈕 -->
      <Button type="link" style="font-size: 14px" @click="handleAdd">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        新增關卡
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    OvertimeSignOffSettingModel,
    SignType,
    SignNotify,
  } from '@/api/setting/model/overtimeSignOffSettingModel';
  import { useDesign } from '@/hooks/web/useDesign';
  import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import {
    Button,
    Form,
    FormItem,
    Divider,
    Input,
    Tag,
    FormInstance,
    Select,
    SelectOption,
  } from 'ant-design-vue';
  import { reactive, ref, Ref, watch } from 'vue';
  import EmployeePicker from './EmployeePicker/EmployeePicker.vue';
  import {
    getOvertimeSignOffSetting,
    updateOvertimeSignOffSettingBatch,
  } from '@/api/setting/signOffsetting';
  import { useMessage } from '@/hooks/web/useMessage';
  import type { Rule } from 'ant-design-vue/es/form';

  const { prefixCls } = useDesign('vacation-sign-off-setting');

  export interface Props {
    vacationId?: number;
    departmentId: number;
  }

  interface form {
    setting: (OvertimeSignOffSettingModel & {
      employeePickerRef: Ref<any>;
      once: boolean;
    })[];
  }

  //-loading
  const loading = ref(false);

  //-父組件傳進來的參數
  const props = withDefaults(defineProps<Props>(), {
    departmentId: 0,
  });

  //-from ref
  const formRef = ref<FormInstance>();

  //-form裡面的資料
  const fromData = reactive({}); // 給form暫存資料用
  const formState = reactive<form>({ setting: [] });

  /**
   * @description 點擊新增事件
   */
  const handleAdd = () => {
    formState.setting.push({
      ID: 0,
      vacationId: props.vacationId,
      departmentId: props.departmentId,
      level: formState.setting.length + 1,
      employeePickerRef: ref(),
      once: false,
    });
  };

  /**
   * @description 點擊刪除年資
   * @param index
   */
  const handleRemove = (index: number) => {
    formState.setting.splice(index, 1);
    //-重新定義level
    for (let i = 0; i < formState.setting.length; i++) {
      formState.setting[i].level = i + 1;
    }
  };

  /**
   * @description reset
   */
  const fetch = async () => {
    try {
      loading.value = true;

      if (props.departmentId && props.vacationId != undefined) {
        const setting = await getOvertimeSignOffSetting({
          vacationId: props.vacationId!,
          departmentId: props.departmentId,
        });

        //-放進form並且給employeePicker一個ref
        reset();
        for (let i = 0; i < setting.length; i++) {
          formState.setting.push({ ...setting[i], employeePickerRef: ref(), once: false });
        }
      }
    } finally {
      loading.value = false;
    }
  };

  /**
   * @description 設定employee picker ref
   * @param el ref
   * @param index index
   */
  const setEmployeePickerRef = (el: any, index: number) => {
    if (el) {
      //-只執行一次
      if (!formState.setting[index].once) {
        //-將姓名放入
        if (formState.setting[index].specificEmployee) {
          el.setRealName(formState.setting[index].specificEmployee!.realName);
        }
        formState.setting[index].once = true;
      }

      formState.setting[index].employeePickerRef = el;
    }
  };

  /**
   * @description reset
   */
  const reset = () => {
    while (formState.setting.length !== 0) {
      formState.setting.pop();
    }
  };

  /**
   * @description 儲存
   */
  const handleSave = () => {
    formRef.value?.validate().then(() => {
      loading.value = true;
      updateOvertimeSignOffSettingBatch(props.departmentId, props.vacationId!, formState.setting)
        .then(() => {
          useMessage().createMessage.success({ content: '設定成功' });
        })
        .finally(() => {
          loading.value = false;
        });
    });
  };

  /**
   * @description form rule map
   */
  const formRules = {
    gteHour: [
      {
        validator: (rule: Rule) => {
          //-格式為"欄位＿index"
          const sp = (rule as any).field.split('_');
          const value = formState.setting[Number(sp[1])][sp[0]];
          const message = '請輸入觸發時數';

          // 不能為空
          if (!value && value !== 0) {
            formState.setting[Number(sp[1])][sp[0]] = undefined;
            return Promise.reject(message);
          }

          if (value.toString().indexOf('.') === -1 && value.toString().substr(-1) === '.') {
            return Promise.resolve();
          }

          // convert to number
          var reg = /^(\d{0,2})(\.\d{1,4})?$/;
          if (!reg.test(value)) {
            return Promise.reject('格式不對');
          } else {
            formState.setting[Number(sp[1])][sp[0]] = Number(value);
          }

          return Promise.resolve();
        },
      },
    ],
    notify: [
      {
        validator: (rule: Rule) => {
          //-格式為"欄位＿index"
          const sp = (rule as any).field.split('_');
          const value = formState.setting[Number(sp[1])]['notify'];

          if (!value) {
            return Promise.reject('請選擇通知');
          }

          return Promise.resolve();
        },
      },
    ],
    signType: [
      {
        validator: (rule: Rule) => {
          //-格式為"欄位＿index"
          const sp = (rule as any).field.split('_');
          const value = formState.setting[Number(sp[1])]['signType'];

          if (!value) {
            return Promise.reject('請選擇簽核類型');
          }

          return Promise.resolve();
        },
      },
    ],
    specificEmployeeId: [
      {
        validator: (rule: Rule) => {
          //-格式為"欄位＿index"
          const sp = (rule as any).field.split('_');
          const value = formState.setting[Number(sp[1])]['specificEmployeeId'];
          const signTypeValue = formState.setting[Number(sp[1])]['signType'];

          if (!value && signTypeValue === SignType.SpecificEmployee) {
            return Promise.reject('請選擇員工');
          }

          return Promise.resolve();
        },
      },
    ],
  };

  watch(
    () => props.vacationId,
    (_v) => {
      fetch();
    },
  );
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-vacation-sign-off-setting';

  .@{prefix-cls} {
    width: auto;
    height: calc(98% - 37px);
    margin-top: 8px;
    overflow-y: scroll;
    // border: 1px solid black;
    font-weight: bold;

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 37px;
      border-bottom: 1px solid @border-color-base;

      span {
        margin-left: 4px;
        padding-left: 7px;
        font-size: 16px;
        font-weight: bold;
      }
    }

    &-form-item {
      margin-top: 8px;

      .ant-divider {
        width: 4px;
        height: 225px;
        background-color: @border-color-base;
      }

      .ant-form-item {
        width: 260px;
        margin-bottom: 15px;
      }

      &-fill {
        width: 260px;
        margin-bottom: 2px;

        .ant-form-item {
          width: 260px;
          margin-bottom: 0;
        }
      }
    }
  }
</style>
