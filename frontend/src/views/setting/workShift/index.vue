<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" @click="handleCreate">
          {{ '新增班別' }}
        </Button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '編輯',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as WorkShiftModel),
              },
              {
                tooltip: '刪除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: 'Confirm?',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as WorkShiftModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <WorkShiftModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { deleteWorkShift, getWorkShiftByKeyword } from '@/api/setting/workShift';
  import { columns, searchFormSchema } from './data';
  import { WorkShiftModel } from '@/api/setting/model/workShiftModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useModal } from '@/components/Modal';
  import { useTable, BasicTable, TableAction } from '@/components/Table';
  import WorkShiftModal from './WorkShiftModal.vue';
  import { Button } from 'ant-design-vue';

  defineOptions({
    name: 'WorkShiftSetting',
    inheritAttrs: false,
  });

  //-modal註冊
  const [registerModal, { openModal }] = useModal();

  //-table設定
  const [registerTable, { reload, setLoading }] = useTable({
    title: '假別列表',
    api: getWorkShiftByKeyword,
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
    openModal(true, { isUpdate: false });
  };

  /**
   * @description 編輯按鈕事件
   * @param record: WorkShiftModel
   */
  const handleEdit = (record: WorkShiftModel) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
  };

  /**
   * @description 刪除按鈕事件
   * @param record: WorkShiftModel
   */
  const handleDelete = (record: WorkShiftModel) => {
    setLoading(true);
    deleteWorkShift(record.ID)
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
