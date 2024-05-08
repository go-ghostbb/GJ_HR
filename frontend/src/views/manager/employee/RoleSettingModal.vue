<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Select, SelectProps } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { getRoleByKeyword } from '@/api/manager/role';
  import { EmployeeModel } from '@/api/manager/model/employeeModel';
  import { setRoles } from '@/api/manager/employee';

  const emit = defineEmits(['success', 'register']);

  const options = ref<SelectProps['options']>([]);

  const empId = ref<number>(0);

  const value = ref<number[]>([]);

  //-modal入口
  const [registerModal, { setModalProps, closeModal }] = useModalInner(
    (data: { employee: EmployeeModel }) => {
      value.value = [];

      const temp: number[] = [];
      data.employee.roles?.forEach((role) => {
        temp.push(role.ID);
      });

      empId.value = data.employee.ID;
      value.value = temp;
    },
  );

  /**
   * @description 提交
   */
  const handleSubmit = () => {
    setModalProps({ confirmLoading: true });
    setRoles(empId.value, value.value)
      .then(() => {
        emit('success');
        closeModal();
      })
      .finally(() => setModalProps({ confirmLoading: false }));
  };

  /**
   * @description 獲取角色下拉式選單
   */
  const fetchRoleList = async () => {
    const result = await getRoleByKeyword();
    const optionsRes: SelectProps['options'] = [];

    result.items.forEach((role) => {
      optionsRes.push({ value: role.ID, label: role.name });
    });

    options.value = optionsRes;
  };

  onMounted(() => {
    fetchRoleList();
  });
</script>

<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="'設定角色'" @ok="handleSubmit">
    <Select v-model:value="value" mode="multiple" :options="options" style="width: 100%" />
  </BasicModal>
</template>

<style scoped lang="less"></style>
