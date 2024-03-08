<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="'給假設定'"
    :maskClosable="false"
    showFooter
    @ok="handleOk"
  >
    <div :class="prefixCls">
      <Form ref="formRef" :model="fromData" layout="vertical">
        <!-- 到職時給假 -->
        <div style="width: 100%">
          <Tag>到職給假</Tag>
        </div>
        <div :class="`${prefixCls}-form-item`" style="display: flex; flex-direction: row">
          <Divider type="vertical" style="height: 75px" />
          <FormItem class="ml-1" label="給假時數">
            <Input v-model:value="formState.defaultDay" :disabled="true" suffix="天" />
          </FormItem>
        </div>

        <!-- 年資設定 -->
        <template v-for="(item, index) in formState.condition" :key="`condition-${index}`">
          <div style="width: 100%">
            <Tag>{{ `年資${index + 1}` }}</Tag>
          </div>
          <div :class="`${prefixCls}-form-item`" style="display: flex; flex-direction: row">
            <Divider type="vertical" />
            <div style="flex-direction: column">
              <!-- 給假開始日input -->
              <FormItem
                class="ml-1"
                label="給假開始日"
                :name="`conditionNum_${index}`"
                :rules="formRules"
              >
                <Input v-model:value="item.conditionNum" :suffix="index === 0 ? '' : '年'">
                  <template v-if="index === 0" #addonAfter>
                    <Select v-model:value="item.conditionType" style="width: auto; min-width: 56px">
                      <SelectOption :value="LeaveGroupCondition.ConditionMonth">月</SelectOption>
                      <SelectOption :value="LeaveGroupCondition.ConditionYear">年</SelectOption>
                    </Select>
                  </template>
                </Input>
              </FormItem>

              <!-- 給假時數input -->
              <FormItem class="ml-1" label="給假時數" :name="`result_${index}`" :rules="formRules">
                <Input v-model:value="item.result" suffix="天" />
              </FormItem>
            </div>
            <!-- 刪除年資 -->
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

      <!-- 新增年資按鈕 -->
      <Button type="link" style="font-size: 14px" @click="handleAdd">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        新增年資
      </Button>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import {
    LeaveGroupCondition,
    LeaveGroupConditionModel,
  } from '@/api/setting/model/leaveGroupConditionModel';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { useDesign } from '@/hooks/web/useDesign';
  import {
    Button,
    Form,
    FormItem,
    Divider,
    Input,
    Tag,
    Select,
    SelectOption,
    FormInstance,
  } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import { reactive, ref } from 'vue';
  import { setLeaveGroupCond } from '@/api/setting/leave';
  import { useMessage } from '@/hooks/web/useMessage';

  const emit = defineEmits(['success', 'register']);

  const { prefixCls } = useDesign('leave-group-condition');

  interface form {
    defaultDay: number;
    condition: LeaveGroupConditionModel[];
  }

  //-form裡面的資料
  const fromData = reactive({}); // 給form暫存資料用
  const formState = reactive<form>({ defaultDay: 0, condition: [] });
  const formRules: Rule[] = [
    {
      validator: (rule: Rule) => {
        //-格式為"欄位＿index"
        const sp = (rule as any).field.split('_');
        const value = formState.condition[Number(sp[1])][sp[0]];
        const message = sp[0] === 'conditionNum' ? '請輸入給假開始日' : '請輸入給假時數';

        // 0會被下面的轉字串改掉
        // 暴力破解, 直接提前出去
        if (value === 0) {
          return Promise.resolve();
        }

        // 不能為空和只能是正整數
        if (!value || value.toString().replace(/[^\d]/g, '') === '') {
          formState.condition[Number(sp[1])][sp[0]] = null;
          return Promise.reject(message);
        } else {
          formState.condition[Number(sp[1])][sp[0]] = Number(
            value.toString().replace(/[^\d]/g, ''),
          );
        }

        return Promise.resolve();
      },
    },
  ];

  //-from ref
  const formRef = ref<FormInstance>();

  //-當前設定的群組ID
  const leaveGroupId = ref<number>(0);

  //-drawer入口
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ loading: true });
    reset();
    //-群組ID
    leaveGroupId.value = data.leaveGroupId;

    //-獲取condition
    const conditionList: LeaveGroupConditionModel[] = data.condition;

    //-otherCond設定
    conditionList.forEach((cond) => {
      formState.condition.push(cond);
    });

    //-到職時給假
    formState.defaultDay = data.default;

    setDrawerProps({ loading: false });
  });

  /**
   * @description 重置條件, 關閉drawer會觸發
   */
  const reset = () => {
    while (formState.condition.length !== 0) {
      formState.condition.pop();
    }
  };

  /**
   * @description 點擊確定事件
   */
  const handleOk = () => {
    formRef.value?.validate().then(() => {
      setDrawerProps({ confirmLoading: true });
      setLeaveGroupCond(leaveGroupId.value, formState.condition)
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
    formState.condition.push({
      ID: 0,
      level: formState.condition.length + 1,
      leaveGroupId: leaveGroupId.value,
      conditionType:
        formState.condition.length === 0
          ? LeaveGroupCondition.ConditionMonth
          : LeaveGroupCondition.ConditionYear,
    });
  };

  /**
   * @description 點擊刪除年資
   * @param index
   */
  const handleRemove = (index: number) => {
    formState.condition.splice(index, 1);
    //-重新定義level
    for (let i = 0; i < formState.condition.length; i++) {
      formState.condition[i].level = i + 1;
    }
  };
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-leave-group-condition';

  .@{prefix-cls} {
    width: 500px;
    margin-top: 8px;
    font-weight: bold;

    &-form-item {
      margin-top: 8px;

      .ant-divider {
        width: 4px;
        height: 150px;
        background-color: @border-color-base;
      }

      .ant-form-item {
        width: 260px;
        margin-bottom: 15px;
      }
    }
  }
</style>
