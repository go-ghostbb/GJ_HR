<template>
  <div>
    <BasicTable @register="registerTable">
      <template #expandedRowRender="{ record }">
        <div style="display: flex">
          <div style="width: 35%">
            <GroupCard :leaveId="(record as LeaveModel).ID" />
          </div>
          <div style="width: 50%">
            <AdvancedCard
              :leave="record"
              @success="(leave: LeaveModel) => updateTableDataRecord(leave.ID, leave)"
            />
          </div>
        </div>
      </template>

      <template #toolbar>
        <Button type="primary" @click="handleReset">
          {{ '給假' }}
        </Button>
        <Button type="primary" @click="handleCreate">
          {{ '新增假別' }}
        </Button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="(column as any).key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '編輯',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as LeaveModel),
              },
              {
                tooltip: '刪除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: 'Confirm?',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as LeaveModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <LeaveModal @register="registerLeaveModal" @success="handleSuccess" />
    <ResetAvailableModal @register="registerResetModal" />
  </div>
</template>

<script lang="ts" setup>
  import { deleteLeave, getLeaveByKeyword } from '@/api/setting/leave';
  import { columns, searchFormSchema } from './data';
  import { LeaveModel } from '@/api/setting/model/leaveModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useModal } from '@/components/Modal';
  import { useTable, BasicTable, TableAction } from '@/components/Table';
  import { GroupCard } from './components/GroupCard';
  import { AdvancedCard } from './components/AdvancedCard';
  import LeaveModal from './LeaveModal.vue';
  import ResetAvailableModal from './ResetAvailableModal.vue';
  import { Button } from 'ant-design-vue';

  defineOptions({
    name: 'LeaveSetting',
    inheritAttrs: false,
  });

  //-LeaveModal註冊
  const [registerLeaveModal, leaveMethod] = useModal();

  //-ResetAvailableModal註冊
  const [registerResetModal, resetModal] = useModal();

  //-table設定
  const [registerTable, { reload, setLoading, updateTableDataRecord }] = useTable({
    title: '假別列表',
    api: getLeaveByKeyword,
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
      width: 80,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  /**
   * @description 新增按鈕事件
   */
  const handleCreate = () => {
    leaveMethod.openModal(true, { isUpdate: false });
  };

  /**
   * @description 給假
   */
  const handleReset = () => {
    resetModal.openModal(true);
  };

  /**
   * @description 編輯按鈕事件
   * @param record
   */
  const handleEdit = (record: LeaveModel) => {
    leaveMethod.openModal(true, {
      record,
      isUpdate: true,
    });
  };

  /**
   * @description 刪除按鈕事件
   * @param record
   */
  const handleDelete = (record: LeaveModel) => {
    setLoading(true);
    deleteLeave(record.ID)
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
