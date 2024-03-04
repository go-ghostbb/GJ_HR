<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #manager="{ model, field }">
        <EmployeePicker
          ref="employeePickerRef"
          v-model:employeeId="model[field]"
          width="180px"
          :departmentId="record?.ID"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { formSchema } from './data';
  import EmployeePicker from './components/EmployeePicker.vue';
  import { DepartmentModel } from '@/api/manager/model/departmentModel';
  import { createDepartment, updateDepartment } from '@/api/manager/department';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const record = ref<DepartmentModel>();
  const employeePickerRef = ref();

  //-form設定
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  //-modal入口
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    employeePickerRef.value.clear();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    //-如果是要編輯的話，把值塞進form
    if (unref(isUpdate)) {
      record.value = data?.record;
      employeePickerRef.value.setRealName(data?.record?.manager?.realName);
      setFieldsValue({ ...record.value });
    } else {
      record.value = { ID: 0 };
    }

    //-將資料夾下拉式選單option塞入
    updateSchema({
      field: 'parentId',
      componentProps: { treeData: data.treeData },
    });

    //-如果是新增, 不顯示主管field
    updateSchema({
      field: 'managerId',
      show: unref(isUpdate),
    });
  });

  //-modal標題
  const getTitle = computed(() => (!unref(isUpdate) ? '新增部門' : '編輯部門'));

  //-提交
  const handleSubmit = async () => {
    try {
      //-驗證表單內容
      const values = await validate();

      //-往下執行代表通過
      setModalProps({ confirmLoading: true });
      if (!unref(isUpdate)) {
        //-新增
        await createDepartment(values as DepartmentModel);
      } else {
        //-編輯
        await updateDepartment(record.value!.ID, values as DepartmentModel);
      }
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };
</script>
