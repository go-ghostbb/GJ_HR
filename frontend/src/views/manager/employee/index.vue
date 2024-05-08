<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DepartmentTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5">
      <template #toolbar>
        <a-button v-auth="'employee:create'" type="primary" @click="handleCreate">
          {{ '新增員工' }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:info-standard-line',
                tooltip: '詳細資訊',
                onClick: handleView.bind(null, record as EmployeeModel),
              },
              {
                icon: 'ant-design:setting-outlined',
                tooltip: '角色設定',
                color: 'warning',
                onClick: handleRoleSetting.bind(null, record as EmployeeModel),
              },
              {
                auth: 'employee:edit',
                icon: 'clarity:note-edit-line',
                tooltip: '編輯',
                onClick: handleEdit.bind(null, record as EmployeeModel),
              },
              {
                auth: 'employee:delete',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '刪除',
                popConfirm: {
                  title: '確認是否刪除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as EmployeeModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <EmployeeDrawer @register="registerDrawer" @success="handleSuccess" />
    <RoleSettingModal @register="roleSettingModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { columns, searchFormSchema } from './data';
  import { PageWrapper } from '@/components/Page';
  import EmployeeDrawer from './EmployeeDrawer.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { deleteEmployee, getEmployeeByKeyword } from '@/api/manager/employee';
  import { EmployeeModel, GetEmployeeByKeywordParams } from '@/api/manager/model/employeeModel';
  import { useGo } from '@/hooks/web/usePage';
  import { useDrawer } from '@/components/Drawer';
  import DepartmentTree from './DepartmentTree.vue';
  import RoleSettingModal from './RoleSettingModal.vue';
  import { ref } from 'vue';
  import { useModal } from '@/components/Modal';

  defineOptions({
    name: 'EmployeeManager',
    inheritAttrs: false,
  });

  //-註冊useGo
  const go = useGo();

  //-drawer註冊
  const [registerDrawer, { openDrawer }] = useDrawer();

  //-RoleSettingModal註冊
  const [roleSettingModal, roleSettingMethod] = useModal();

  //-所選的部門ID
  const selectDeptID = ref<number>();

  //-table設定
  const [registerTable, { reload, setLoading }] = useTable({
    title: '角色列表',
    api: getEmployeeByKeyword,
    beforeFetch: (params: GetEmployeeByKeywordParams) => {
      params.departmentId = selectDeptID.value;
    },
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
      width: 160,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  /**
   * @description 選擇部門事件
   * @param departmentId
   */
  const handleSelect = (departmentId?: number) => {
    if (departmentId && departmentId !== 0) {
      selectDeptID.value = departmentId;
    } else {
      selectDeptID.value = undefined;
    }
    reload();
  };

  /**
   * @description 查看按鈕事件
   * @param record: EmployeeModel
   */
  const handleView = (record: EmployeeModel) => {
    go(`/manager/employee/${record.ID}`);
  };

  /**
   * @description 新增按鈕事件
   */
  const handleCreate = () => {
    openDrawer(true, { isUpdate: false });
  };

  /**
   * @description 編輯按鈕事件
   * @param record
   */
  const handleEdit = (record: EmployeeModel) => {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  };

  /**
   * @description 刪除按鈕事件
   * @param record
   */
  const handleDelete = (record: EmployeeModel) => {
    setLoading(true);
    deleteEmployee(record.ID)
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
   * @description 設定角色事件
   * @param record
   */
  const handleRoleSetting = (record: EmployeeModel) => {
    roleSettingMethod.openModal(true, { employee: record });
  };

  /**
   * @description 操作成功
   */
  const handleSuccess = () => {
    useMessage().createMessage.success({ content: '操作成功' });
    reload();
  };
</script>
