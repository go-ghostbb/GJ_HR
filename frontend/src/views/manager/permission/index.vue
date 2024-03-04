<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-auth="'permission:create'" type="primary" @click="handleCreate">
          {{ '新增角色' }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                auth: 'permission:edit',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as PermissionModel),
              },
              {
                auth: 'permission:delete',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '編輯角色',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as PermissionModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <PermModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { deletePerm, getPermByKeyword } from '@/api/manager/permission';
  import { useTable, TableAction, BasicTable } from '@/components/Table';
  import { columns, searchFormSchema } from './data';
  import { useModal } from '@/components/Modal';
  import PermModal from './PermModal.vue';
  import { PermissionModel } from '@/api/manager/model/permissionModel';
  import { useMessage } from '@/hooks/web/useMessage';

  defineOptions({
    name: 'PermManager',
    inheritAttrs: false,
  });

  //-modal註冊
  const [registerModal, { openModal }] = useModal();

  //-table設定
  const [registerTable, { reload, setLoading }] = useTable({
    title: '角色列表',
    api: getPermByKeyword,
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
      width: 80,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  /**
   * @description 新增按鈕事件
   */
  const handleCreate = () => {
    openModal(true, { isUpdate: false });
  };

  /**
   * @description 編輯按鈕事件
   * @param record: PermissionModel
   */
  const handleEdit = (record: PermissionModel) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
  };

  /**
   * @description 刪除按鈕事件
   * @param record: PermissionModel
   */
  const handleDelete = (record: PermissionModel) => {
    setLoading(true);
    deletePerm(record.ID)
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
   * @description 操作成功
   */
  const handleSuccess = () => {
    useMessage().createMessage.success({ content: '操作成功' });
    reload();
  };
</script>
