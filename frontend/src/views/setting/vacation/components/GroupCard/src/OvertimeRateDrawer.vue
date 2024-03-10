<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="'加班區間設定'"
    :maskClosable="false"
    showFooter
    @ok="handleOk"
  >
    <div :class="prefixCls">
      <Form ref="formRef" :model="fromData" layout="vertical">
        <!-- 年資設定 -->
        <template v-for="(item, index) in formState.rate" :key="`rate-${index}`">
          <div style="display: flex; flex-direction: row; width: 100%">
            <Tag>{{ `區間${index + 1}` }}</Tag>
          </div>
          <div :class="`${prefixCls}-form-item`" style="display: flex; flex-direction: row">
            <Divider type="vertical" />
            <!-- 把form item獨立成一個區塊, 為了讓form item垂直且並排divider -->
            <div>
              <!-- 填滿check & input -->
              <Checkbox :class="`${prefixCls}-form-item-fill`" v-model:checked="item.isFill">
                <FormItem class="ml-1" :name="`fill_${index}`" :rules="formFillRules">
                  <span>自動填滿至</span>
                  <Popover :visible="item.fillPopover && item.isFill">
                    <template #content>
                      <span style="color: #ed6f6f">
                        <b>{{ item.fillPopoverMsg }}</b>
                      </span>
                    </template>
                    <Input
                      v-model:value="item.fill"
                      :disabled="!item.isFill"
                      size="small"
                      style="width: 40px"
                    />
                  </Popover>
                  <span>小時</span>
                </FormItem>
              </Checkbox>

              <!-- 加班開始時數input -->
              <FormItem
                class="ml-1"
                label="加班開始時數"
                :name="`hours_${index}`"
                :rules="formHoursRules"
              >
                <Input v-model:value="item.hours" />
              </FormItem>

              <!-- 倍率input -->
              <FormItem
                class="ml-1"
                label="倍率"
                :name="`multiply_${index}`"
                :rules="formMultiplyRules"
              >
                <Input v-model:value="item.multiply" />
              </FormItem>
            </div>

            <!-- 刪除區間 -->
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

      <!-- 新增區間按鈕 -->
      <Button type="link" style="font-size: 14px" @click="handleAdd">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        新增區間
      </Button>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { useDesign } from '@/hooks/web/useDesign';
  import {
    Button,
    Form,
    FormItem,
    Divider,
    Input,
    Tag,
    FormInstance,
    Checkbox,
    Popover,
  } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import { reactive, ref } from 'vue';
  import { VacationGroupOvertimeRateModel } from '@/api/setting/model/vacationGroupOvertimeRateModel';
  import { setVacationGroupOvertimeRate } from '@/api/setting/vacation';
  import { useMessage } from '@/hooks/web/useMessage';

  const emit = defineEmits(['success', 'register']);

  const { prefixCls } = useDesign('vacation-group-overtime-rate');

  interface form {
    rate: (VacationGroupOvertimeRateModel & {
      fillPopover: boolean; //-控制form裡fill欄位的氣泡框
      fillPopoverMsg: string; //-控制form裡fill欄位的氣泡框文字
    })[];
  }

  //-form裡面的資料
  const fromData = reactive({}); // 給form暫存資料用
  const formState = reactive<form>({ rate: [] });
  //-form hours輸入框規則
  const formHoursRules: Rule[] = [
    {
      validator: (rule: Rule) => {
        //-格式為"欄位＿index"
        const sp = (rule as any).field.split('_');
        const value = formState.rate[Number(sp[1])][sp[0]];
        const message = '請輸入加班開始時數';

        // 0會被下面的轉字串改掉
        // 暴力破解, 直接提前出去
        if (value === 0) {
          return Promise.resolve();
        }

        // 不能為空和只能是正整數
        if (!value || value.toString().replace(/[^\d]/g, '') === '') {
          formState.rate[Number(sp[1])][sp[0]] = null;
          return Promise.reject(message);
        } else {
          formState.rate[Number(sp[1])][sp[0]] = Number(value.toString().replace(/[^\d]/g, ''));
        }

        return Promise.resolve();
      },
    },
  ];
  //-form multiply輸入框規則
  const formMultiplyRules: Rule[] = [
    {
      validator: (rule: Rule) => {
        //-格式為"欄位＿index"
        const sp = (rule as any).field.split('_');
        const value = formState.rate[Number(sp[1])][sp[0]];
        const message = '請輸入倍率';

        // 不能為空
        if (!value) {
          formState.rate[Number(sp[1])][sp[0]] = null;
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
          formState.rate[Number(sp[1])][sp[0]] = Number(value);
        }

        return Promise.resolve();
      },
    },
  ];
  //-form fill輸入框規則
  const formFillRules: Rule[] = [
    {
      validator: (rule: Rule) => {
        //-格式為"欄位＿index"
        const sp = (rule as any).field.split('_');
        const rate = formState.rate[Number(sp[1])];
        const value = rate[sp[0]];
        const message = '請輸入';

        // 如果該功能沒打開, 不進行判斷
        if (!rate.isFill) {
          rate.fillPopover = false;
          return Promise.resolve();
        }

        // 不能是0
        if (value === 0 || value === '0') {
          rate.fillPopoverMsg = '不能是0';
          rate.fillPopover = true;
          return Promise.reject();
        }

        // 不能為空和只能是正整數
        if (!value || value.toString().replace(/[^\d]/g, '') === '') {
          rate[sp[0]] = null;
          rate.fillPopoverMsg = message;
          rate.fillPopover = true;
          return Promise.reject();
        } else {
          rate[sp[0]] = Number(value.toString().replace(/[^\d]/g, ''));
        }

        // 不能比下一層的時數大
        if (formState.rate.length > Number(sp[1]) + 1) {
          const nextHours = formState.rate[Number(sp[1]) + 1].hours;
          if (nextHours && value >= nextHours) {
            rate.fillPopoverMsg = '填滿時數不能比下一個區間開始時數還大';
            rate.fillPopover = true;
            return Promise.reject();
          }
        }

        rate.fillPopover = false;
        return Promise.resolve();
      },
    },
  ];

  //-from ref
  const formRef = ref<FormInstance>();

  //-當前設定的群組ID
  const vacationGroupId = ref<number>(0);

  //-drawer入口
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ loading: true });
    reset();
    //-休假日類別ID
    vacationGroupId.value = data.vacationGroupId;

    //-獲取倍率列表(深拷貝)
    const rateList: VacationGroupOvertimeRateModel[] = JSON.parse(
      JSON.stringify(data.overtimeRate),
    );

    //-form設定
    rateList.forEach((rate) => {
      if (!rate.fill || rate.fill === 0) {
        rate.fill = 1;
      }
      formState.rate.push({ ...rate, fillPopover: false, fillPopoverMsg: '' });
    });

    setDrawerProps({ loading: false });
  });

  /**
   * @description 重置條件, 關閉drawer會觸發
   */
  const reset = () => {
    while (formState.rate.length !== 0) {
      formState.rate.pop();
    }
  };

  /**
   * @description 點擊確定事件
   */
  const handleOk = () => {
    formRef.value?.validate().then(() => {
      setDrawerProps({ confirmLoading: true });
      setVacationGroupOvertimeRate(vacationGroupId.value, formState.rate)
        .then(() => {
          useMessage().createMessage.success({ content: '設定成功' });
          emit('success');
          closeDrawer();
        })
        .finally(() => {
          setDrawerProps({ confirmLoading: false });
        });
    });
  };

  /**
   * @description 點擊新增事件
   */
  const handleAdd = () => {
    formState.rate.push({
      ID: vacationGroupId.value,
      level: formState.rate.length + 1,
      fill: 1,
      fillPopover: false,
      fillPopoverMsg: '',
    });
  };

  /**
   * @description 點擊刪除年資
   * @param index
   */
  const handleRemove = (index: number) => {
    formState.rate.splice(index, 1);
    //-重新定義level
    for (let i = 0; i < formState.rate.length; i++) {
      formState.rate[i].level = i + 1;
    }
  };
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-vacation-group-overtime-rate';

  .@{prefix-cls} {
    width: 500px;
    margin-top: 8px;
    font-weight: bold;

    &-form-item {
      margin-top: 8px;

      .ant-divider {
        width: 4px;
        height: 180px;
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
