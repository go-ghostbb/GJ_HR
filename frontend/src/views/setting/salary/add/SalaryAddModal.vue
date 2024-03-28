<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <div :class="prefixCls">
      <Form ref="formRef" :model="formData" layout="vertical">
        <Row :gutter="[8, 0]">
          <Col :span="12">
            <!-- 名稱 -->
            <FormItem label="名稱" name="name" required>
              <Input v-model:value="formData.name" />
            </FormItem>
          </Col>
          <Col :span="12">
            <!-- 薪資類型 -->
            <FormItem label="薪資類型" name="salaryType" required>
              <Select v-model:value="formData.salaryType">
                <SelectOption :key="SalaryType.FixedSalary">固定薪資</SelectOption>
                <SelectOption :key="SalaryType.NonFixedSalary">非固定薪資</SelectOption>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <!-- 納入 -->
        <div class="mt-8" style="width: 100%">
          <span>納入</span>
        </div>
        <div :class="`${prefixCls}-include`" style="display: flex; flex-direction: row">
          <Divider type="vertical" style="height: auto" />
          <!-- form item -->
          <div>
            <!-- 所得稅 -->
            <FormItem name="incomeTax">
              <Checkbox v-model:checked="formData.incomeTax">所得稅</Checkbox>
            </FormItem>
            <!-- 職工福利金 -->
            <FormItem name="benefits">
              <Checkbox v-model:checked="formData.benefits">職工福利金</Checkbox>
            </FormItem>
            <!-- 補充保費 -->
            <FormItem name="premiums">
              <Checkbox v-model:checked="formData.premiums">補充保費</Checkbox>
            </FormItem>
          </div>
        </div>

        <!-- 金額 -->
        <FormItem class="mt-6" label="金額" name="calcType" required>
          <RadioGroup v-model:value="formData.calcType">
            <Radio :value="SalaryCalcType.DefaultCalc">預設金額</Radio>
            <Radio :value="SalaryCalcType.UnitCalc">單位計算</Radio>
            <Radio :value="SalaryCalcType.ConditionCalc">條件</Radio>
          </RadioGroup>
        </FormItem>
        <!-- 金額設定 -->
        <div style="display: flex; flex-direction: row">
          <Divider type="vertical" style="height: auto" />
          <div>
            <div style="display: flex; flex-direction: row">
              <!-- 單位 -->
              <FormItem
                v-show="
                  formData.calcType === SalaryCalcType.UnitCalc ||
                  formData.calcType === SalaryCalcType.ConditionCalc
                "
                label="單位"
                name="unit"
                :required="
                  formData.calcType === SalaryCalcType.UnitCalc ||
                  formData.calcType === SalaryCalcType.ConditionCalc
                "
                style="width: 80px"
              >
                <Select v-model:value="formData.unit">
                  <SelectOption :key="SalaryCalcUnit.HourCalc">小時</SelectOption>
                  <SelectOption :key="SalaryCalcUnit.DayCalc">天</SelectOption>
                </Select>
              </FormItem>
              <!-- 條件 -->
              <FormItem
                v-show="formData.calcType === SalaryCalcType.ConditionCalc"
                class="ml-2"
                label="條件"
                name="operator"
                :required="formData.calcType === SalaryCalcType.ConditionCalc"
                style="width: 80px"
              >
                <Select v-model:value="formData.operator">
                  <SelectOption :key="Operator.Gte"> {{ '>=' }} </SelectOption>
                  <SelectOption :key="Operator.Lte"> {{ '<=' }} </SelectOption>
                </Select>
              </FormItem>
              <!-- 參數 -->
              <FormItem
                v-show="formData.calcType === SalaryCalcType.ConditionCalc"
                class="ml-2"
                label="參數"
                name="argument"
                :required="formData.calcType === SalaryCalcType.ConditionCalc"
                :rules="[{ validator: numValidator }]"
                style="width: 80px"
              >
                <Input v-model:value="formData.argument" />
              </FormItem>
            </div>
            <!-- 金額form item -->
            <FormItem
              v-show="formData.calcType"
              label="金額"
              name="amount"
              required
              :rules="[{ validator: numValidator }]"
              style="width: 200px"
            >
              <Input v-model:value="formData.amount" placeholder="0" />
            </FormItem>
          </div>
          <!-- 破月計算, 未滿足月時按比例計算, 預設金額用 -->
          <FormItem
            v-show="formData.calcType === SalaryCalcType.DefaultCalc"
            class="mt-6 ml-2"
            name="monthCalc"
          >
            <Checkbox v-model:checked="formData.monthCalc">開啟按比例計算功能</Checkbox>
          </FormItem>
        </div>
      </Form>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { useDesign } from '@/hooks/web/useDesign';
  import { computed, ref, unref, reactive } from 'vue';
  import {
    Radio,
    RadioGroup,
    Form,
    FormItem,
    Divider,
    Input,
    FormInstance,
    Checkbox,
    Select,
    SelectOption,
    Row,
    Col,
  } from 'ant-design-vue';
  import {
    SalaryAddItemModel,
    SalaryCalcType,
    SalaryCalcUnit,
    SalaryType,
    Operator,
  } from '@/api/setting/model/salaryAddItemModel';
  import { createSalaryAddItem, updateSalaryAddItem } from '@/api/setting/salaryItem';

  const emit = defineEmits(['success', 'register']);

  //-class prefix
  const { prefixCls } = useDesign('salary-add-modal');

  //-是否為更新狀態
  const isUpdate = ref(true);

  //-from ref
  const formRef = ref<FormInstance>();

  //-form data
  const formData = reactive<SalaryAddItemModel>({ ID: 0 });

  //-modal標題
  const getTitle = computed(() => (!unref(isUpdate) ? '新增加項' : '編輯加項'));

  //-ID
  const salaryItemID = ref<number>(0);

  //-modal入口
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    formRef.value?.resetFields();
    formData.ID = 0;
    isUpdate.value = !!data?.isUpdate;

    //-如果是要編輯的話，把值塞進form
    if (unref(isUpdate)) {
      //-編輯
      setValue(data.record);
      salaryItemID.value = data.ID;
    } else {
      //-新增
      salaryItemID.value = 0;
    }
  });

  /**
   * @description 提交
   */
  const handleSubmit = async () => {
    try {
      setModalProps({ confirmLoading: true });
      await formRef.value?.validate();

      //-往下執行代表通過
      formData.amount = Number(formData.amount);
      formData.argument = Number(formData.argument);
      if (unref(isUpdate)) {
        //-編輯
        await updateSalaryAddItem(salaryItemID.value, formData);
      } else {
        //-新增
        await createSalaryAddItem(formData);
      }
      emit('success');
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };

  /**
   * @description form 給值
   * @param value
   */
  const setValue = (value: SalaryAddItemModel) => {
    formData.ID = value.ID;
    formData.name = value.name;
    formData.salaryType = value.salaryType;
    formData.incomeTax = value.incomeTax;
    formData.benefits = value.benefits;
    formData.premiums = value.premiums;
    formData.amount = value.amount;
    formData.calcType = value.calcType;
    formData.monthCalc = value.monthCalc;
    formData.unit = value.unit;
    formData.operator = value.operator;
    formData.argument = value.argument;
  };

  /**
   * @description 數字規則
   * @param rule
   * @param val
   */
  const numValidator = (rule, val) => {
    if (val === undefined) {
      val = 0;
    }

    if (val.toString().indexOf('.') === -1 && val.toString().substr(-1) === '.') {
      return Promise.resolve();
    }

    // convert to number
    const reg = /^(\d{0,10})(\.\d{1,4})?$/;
    if (!reg.test(val)) {
      return Promise.reject('格式不對');
    } else {
      val = Number(val);
    }

    return Promise.resolve();
  };
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-salary-add-modal';

  .@{prefix-cls} {
    font-weight: bold;

    .ant-form-item {
      margin-bottom: 0;
    }

    .ant-divider {
      width: 4px;
      margin-top: 8px;
      margin-left: 0;
      background-color: @border-color-base;
    }

    &-include {
      .ant-form-item {
        height: 25px;
      }
    }
  }
</style>
