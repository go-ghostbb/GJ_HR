<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" @click="handleCreate">
          {{ '新增減項' }}
        </Button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '套用員工',
                color: 'warning',
                icon: 'ant-design:user-outlined',
                onClick: handleSetEmployee.bind(null, record as SalaryReduceItemModel),
              },
              {
                tooltip: '編輯',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as SalaryReduceItemModel),
              },
              {
                tooltip: '刪除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: 'Confirm?',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as SalaryReduceItemModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <SalaryReduceModal @register="registerSalaryReduceModal" @success="handleSuccess" />
    <EmployeeModal @register="registerEmployeeModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { columns, searchFormSchema } from './data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useTable, BasicTable, TableAction } from '@/components/Table';
  import { Button } from 'ant-design-vue';
  import { deleteSalaryReduceItem, getSalaryReduceItemByKeyword } from '@/api/setting/salaryItem';
  import { SalaryReduceItemModel } from '@/api/setting/model/salaryReduceItemModel';
  import SalaryReduceModal from './SalaryReduceModal.vue';
  import { useModal } from '@/components/Modal';
  import EmployeeModal from './EmployeeModal.vue';
  import { EmployeeModel } from '@/api/manager/model/employeeModel';

  defineOptions({
    name: 'SalaryReduceSetting',
    inheritAttrs: false,
  });

  //-SalaryReduceModal註冊
  const [registerSalaryReduceModal, salaryReduceMethod] = useModal();

  //-EmployeeModal註冊
  const [registerEmployeeModal, employeeMethod] = useModal();

  //-table設定
  const [registerTable, { reload, setLoading }] = useTable({
    title: '減項列表',
    api: getSalaryReduceItemByKeyword,
    rowKey: 'ID',
    columns,
    formConfig: {
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  /**
   * @description 新增按鈕事件
   */
  const handleCreate = () => {
    salaryReduceMethod.openModal(true, { isUpdate: false });
  };

  /**
   * @description 編輯按鈕事件
   * @param record: SalaryReduceItemModel
   */
  const handleEdit = (record: SalaryReduceItemModel) => {
    salaryReduceMethod.openModal(true, { isUpdate: true, record, ID: record.ID });
  };

  /**
   * @description 設定套用員工
   * @param record SalaryReduceItemModel
   */
  const handleSetEmployee = (record: SalaryReduceItemModel) => {
    console.log(record);
    employeeMethod.openModal(true, { id: record.ID, employeeIds: getEmpIDs(record.employee) });
  };

  /**
   * @description 刪除按鈕事件
   * @param record: SalaryReduceItemModel
   */
  const handleDelete = (record: SalaryReduceItemModel) => {
    setLoading(true);
    deleteSalaryReduceItem(record.ID)
      .then(() => {
        useMessage().createMessage.success({ content: '刪除成功' });
        reload();
      })
      .catch((err) => {
        console.log(err);
        useMessage().createMessage.error({ content: '刪除失敗' });
        setLoading(false);
      });
  };

  /**
   * @description 成功
   */
  const handleSuccess = () => {
    reload();
    useMessage().createMessage.success({ content: '操作成功' });
  };

  /**
   * @description 獲取員工ID
   * @param employees
   */
  const getEmpIDs = (employees?: EmployeeModel[]): number[] => {
    if (!employees) {
      return [];
    }
    const result: number[] = [];
    employees.forEach((e) => {
      result.push(e.ID);
    });
    return result;
  };
</script>
