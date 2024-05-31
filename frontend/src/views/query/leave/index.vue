<script setup lang="ts">
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { column, searchFormSchema } from './data';
  import { getLeaveCorrectByKeyword } from '@/api/query/leave';
  import { useMessage } from '@/hooks/web/useMessage';
  import LeaveCorrectModal from './LeaveCorrectModal.vue';
  import { useModal } from '@/components/Modal';
  import { LeaveCorrectModel } from '@/api/query/model/leaveCorrect';

  defineOptions({
    name: 'LeaveCorrectQuery',
    inheritAttrs: false,
  });

  //-LeaveCorrectModal 註冊
  const [registerLeaveCorrect, leaveCorrectMethod] = useModal();

  //-table 註冊
  const [registerTable, { reload }] = useTable({
    title: '假別列表',
    api: getLeaveCorrectByKeyword,
    columns: column,
    formConfig: {
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 40,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  /**
   * @description edit
   * @param record
   */
  const handleEdit = (record: LeaveCorrectModel) => {
    leaveCorrectMethod.openModal(true, { record });
  };

  /**
   * @description success
   */
  const handleSuccess = () => {
    useMessage().createMessage.success({ content: '操作成功' });
    reload();
  };
</script>

<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="(column as any).key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '編輯',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as LeaveCorrectModel),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <LeaveCorrectModal @register="registerLeaveCorrect" @success="handleSuccess" />
  </div>
</template>

<style scoped lang="less"></style>
