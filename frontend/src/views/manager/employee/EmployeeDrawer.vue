<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { formSchema } from './data';
  import { EmployeeModel } from '@/api/manager/model/employeeModel';
  import { createEmployee, updateEmployee } from '@/api/manager/employee';

  const emit = defineEmits(['register', 'success']);

  const isUpdate = ref(true); //-新增視窗或編輯視窗
  const record = ref<EmployeeModel>(); //-傳入的table參數

  //-form設定
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  //-drawer入口
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner((data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    //-如果是要編輯菜單的話，把值塞進form
    if (unref(isUpdate)) {
      record.value = data?.record;
      setFieldsValue({ ...record.value });
    } else {
      record.value = { ID: 0 };
    }
  });

  //-drawer標題
  const getTitle = computed(() => (!unref(isUpdate) ? '新增員工' : '編輯員工'));

  //-提交
  const handleSubmit = async () => {
    try {
      //-驗證表單內容
      const values = await validate();

      //-往下執行代表通過
      setDrawerProps({ confirmLoading: true });
      const result = formatValue(values);
      if (!unref(isUpdate)) {
        //-新增
        await createEmployee(result);
      } else {
        //-編輯
        await updateEmployee(record.value!.ID, result);
      }
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };

  /**
   * @description 將values裡面的值更新到employee model
   * @param values
   */
  const formatValue = (values: any): EmployeeModel => {
    //-因為從form裡面出來的日期是string
    //-需要進行轉換
    values.hireDate = new Date(values.hireDate);
    values.birth = new Date(values.birth);

    //-以下核心
    const result = record.value;
    if (result) {
      result.realName = values.realName;
      result.departmentId = values.departmentId;
      result.hireDate = values.hireDate;
      result.nationalId = values.nationalId;
      result.birth = values.birth;
      result.email = values.email;
      result.mobile = values.mobile;
      return result;
    } else {
      return values as EmployeeModel;
    }
  };
</script>
