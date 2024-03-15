<template>
  <div>
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
                icon: 'ant-design:setting-outlined',
                color: 'warning',
                onClick: handleSetGrade.bind(null, record as PositionRankModel),
              },
              {
                tooltip: '編輯',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as PositionRankModel),
              },
              {
                tooltip: '刪除',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: 'Confirm?',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as PositionRankModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <RankModal @register="registerRankModal" @success="handleSuccess" />
    <grade @register="registerGradeModal" />
  </div>
</template>

<script lang="ts" setup>
  import { columns, searchFormSchema } from './data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useModal } from '@/components/Modal';
  import { useTable, BasicTable, TableAction } from '@/components/Table';
  import { deleteRank, getRankByKeyword } from '@/api/setting/rank';
  import { PositionRankModel } from '@/api/setting/model/positionRankModel';
  import { Button } from 'ant-design-vue';
  import RankModal from './RankModal.vue';
  import grade from './grade/grade.vue';

  defineOptions({
    name: 'PositionRankSetting',
    inheritAttrs: false,
  });

  //-RankModal註冊
  const [registerRankModal, rankMethod] = useModal();

  //-RankModal註冊
  const [registerGradeModal, gradeMethod] = useModal();

  //-table設定
  const [registerTable, { reload, setLoading }] = useTable({
    title: '職級列表',
    api: getRankByKeyword,
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
    rankMethod.openModal(true, { isUpdate: false });
  };

  /**
   * @description 編輯按鈕事件
   * @param record: PositionRankModel
   */
  const handleEdit = (record: PositionRankModel) => {
    rankMethod.openModal(true, {
      record,
      isUpdate: true,
    });
  };

  /**
   * @description 設定職等事件
   * @param record PositionRankModel
   */
  const handleSetGrade = (record: PositionRankModel) => {
    gradeMethod.openModal(true, { record });
  };

  /**
   * @description 刪除按鈕事件
   * @param record: PositionRankModel
   */
  const handleDelete = (record: PositionRankModel) => {
    setLoading(true);
    deleteRank(record.ID)
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
