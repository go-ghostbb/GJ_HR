<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="modalTitle"
    :width="1000"
    :minHeight="500"
    :footer="null"
  >
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" @click="handleCreate">
          {{ '新增職級' }}
        </Button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '編輯',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as PositionGradeModel),
              },
              {
                tooltip: '刪除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: 'Confirm?',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as PositionGradeModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </BasicModal>
  <GradeModal @register="registerGradeModal" @success="handleSuccess" />
</template>

<script lang="ts" setup>
  import { columns, searchFormSchema } from './data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useModal, useModalInner, BasicModal } from '@/components/Modal';
  import { useTable, BasicTable, TableAction } from '@/components/Table';
  import { deleteGrade, getGradeByKeyword } from '@/api/setting/grade';
  import {
    GetGradeByKeywordParams,
    PositionGradeModel,
  } from '@/api/setting/model/positionGradeModel';
  import { Button } from 'ant-design-vue';
  import GradeModal from './GradeModal.vue';
  import { ref } from 'vue';

  defineEmits(['register']);

  //-modal註冊
  const [registerGradeModal, { openModal }] = useModal();

  //-當前職級
  const rankId = ref<number>(0);

  //-modal title
  const modalTitle = ref<string>('');

  //-modal入口
  const [registerModal] = useModalInner((data) => {
    rankId.value = data.record.ID;
    modalTitle.value = `【${data.record.name}】職等列表`;
    reload();
  });

  //-table設定
  const [registerTable, { reload, setLoading }] = useTable({
    title: '職等列表',
    api: getGradeByKeyword,
    beforeFetch: (params: GetGradeByKeywordParams) => {
      params.rankId = rankId.value;
      return params;
    },
    afterFetch: (record) => {
      return record;
    },
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
    openModal(true, { isUpdate: false, rankId: rankId.value });
  };

  /**
   * @description 編輯按鈕事件
   * @param record: GradeModel
   */
  const handleEdit = (record: PositionGradeModel) => {
    openModal(true, {
      record,
      isUpdate: true,
      rankId: rankId.value,
    });
  };

  /**
   * @description 刪除按鈕事件
   * @param record: GradeModel
   */
  const handleDelete = (record: PositionGradeModel) => {
    setLoading(true);
    deleteGrade(record.ID)
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
