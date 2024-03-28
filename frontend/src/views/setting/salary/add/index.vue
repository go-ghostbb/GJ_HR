<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" @click="handleCreate">
          {{ '新增加項' }}
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
                onClick: handleSetEmployee.bind(null, record as SalaryAddItemModel),
              },
              {
                tooltip: '編輯',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as SalaryAddItemModel),
              },
              {
                tooltip: '刪除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: 'Confirm?',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as SalaryAddItemModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <SalaryAddModal @register="registerSalaryAddModal" @success="handleSuccess" />
    <EmployeeModal @register="registerEmployeeModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { columns, searchFormSchema } from './data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useTable, BasicTable, TableAction } from '@/components/Table';
  import { Button } from 'ant-design-vue';
  import { deleteSalaryAddItem, getSalaryAddItemByKeyword } from '@/api/setting/salaryItem';
  import { SalaryAddItemModel } from '@/api/setting/model/salaryAddItemModel';
  import SalaryAddModal from './SalaryAddModal.vue';
  import { useModal } from '@/components/Modal';
  import EmployeeModal from './EmployeeModal.vue';
  import { EmployeeModel } from '@/api/manager/model/employeeModel';

  defineOptions({
    name: 'SalaryAddSetting',
    inheritAttrs: false,
  });

  //-SalaryAddModal註冊
  const [registerSalaryAddModal, salaryAddMethod] = useModal();

  //-EmployeeModal註冊
  const [registerEmployeeModal, employeeMethod] = useModal();

  //-table設定
  const [registerTable, { reload, setLoading }] = useTable({
    title: '加項列表',
    api: getSalaryAddItemByKeyword,
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
    salaryAddMethod.openModal(true, { isUpdate: false });
  };

  /**
   * @description 編輯按鈕事件
   * @param record: SalaryAddItemModel
   */
  const handleEdit = (record: SalaryAddItemModel) => {
    salaryAddMethod.openModal(true, { isUpdate: true, record, ID: record.ID });
  };

  /**
   * @description 設定套用員工
   * @param record SalaryAddItemModel
   */
  const handleSetEmployee = (record: SalaryAddItemModel) => {
    console.log(record);
    employeeMethod.openModal(true, { id: record.ID, employeeIds: getEmpIDs(record.employee) });
  };

  /**
   * @description 刪除按鈕事件
   * @param record: SalaryAddItemModel
   */
  const handleDelete = (record: SalaryAddItemModel) => {
    setLoading(true);
    deleteSalaryAddItem(record.ID)
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
