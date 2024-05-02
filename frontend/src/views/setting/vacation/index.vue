<template>
  <div>
    <BasicTable @register="registerTable">
      <template #expandedRowRender="{ record }">
        <div style="display: flex">
          <div style="width: 35%">
            <GroupCard :vacationId="(record as VacationModel).ID" />
          </div>
        </div>
      </template>

      <template #toolbar>
        <a-button type="primary" @click="handleCreate">
          {{ '新增休假日' }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="(column as any).key === 'action'">
          <TableAction
            v-if="(record as VacationModel).ID !== 0"
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as VacationModel),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: 'Confirm?',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record as VacationModel),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <VacationModal @register="registerVacationModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { columns, searchFormSchema } from './data';
  import { deleteVacation, getVacationByKeyword } from '@/api/setting/vacation';
  import VacationModal from './VacationModal.vue';
  import { useModal } from '@/components/Modal';
  import { VacationModel } from '@/api/setting/model/vacationModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { GroupCard } from './components/GroupCard';

  defineOptions({
    name: 'VacationSetting',
    inheritAttrs: false,
  });

  //-VacationModal註冊
  const [registerVacationModal, vacationMethod] = useModal();

  //-table設定
  const [registerTable, { reload, setLoading }] = useTable({
    title: '休假日列表',
    api: getVacationByKeyword,
    afterFetch: (record: VacationModel[]) => {
      record.unshift({
        ID: 0,
        name: '工作日',
        status: true,
      });
      return record;
    },
    columns,
    formConfig: {
      labelWidth: 120,
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
   * @description 點擊編輯事件
   * @param record VacationModel
   */
  const handleEdit = (record: VacationModel) => {
    vacationMethod.openModal(true, {
      record,
      isUpdate: true,
    });
  };

  /**
   * @description 點擊新增事件
   * @param record
   */
  const handleCreate = () => {
    vacationMethod.openModal(true, {
      isUpdate: false,
    });
  };

  /**
   * @description 點擊編輯事件
   * @param record VacationModel
   */
  const handleDelete = (record: VacationModel) => {
    setLoading(true);
    deleteVacation(record.ID)
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
