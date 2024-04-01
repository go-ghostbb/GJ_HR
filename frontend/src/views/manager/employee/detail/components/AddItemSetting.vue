<template>
  <BasicTable @register="registerTable">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <TableAction
          :actions="[
            {
              auth: 'employee:edit',
              icon: 'ant-design:setting-outlined',
              tooltip: '編輯',
              onClick: handleSetting.bind(null, record),
            },
          ]"
        />
      </template>
    </template>
  </BasicTable>

  <BasicModal @register="registerModal" :title="titleModal" @ok="handleOk">
    <Checkbox v-model:checked="useCustom">使用自訂金額</Checkbox>
    <div v-show="useCustom">
      <span>金額：</span>
      <Input class="w-100px mt-4" v-model:value="amount" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { getByKeywordSalaryAddItem, setSalaryAddItem } from '@/api/manager/employee';
  import { useTable, BasicTable, TableAction } from '@/components/Table';
  import { addItemColumn, addItemSearchFormSchema } from '../data';
  import { useModal, BasicModal } from '@/components/Modal';
  import { watch, ref } from 'vue';
  import { Checkbox, Input } from 'ant-design-vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const props = defineProps({
    employeeId: {
      type: Number,
    },
  });

  //-modal title
  const titleModal = ref('');

  //-是否使用自訂金額
  const useCustom = ref(false);

  //-金額
  const amount = ref<number>(0);

  //-當前設定加項id
  const salaryAddItemId = ref(0);

  //-table設定
  const [registerTable, { reload, getDataSource }] = useTable({
    title: '加項列表',
    api: getByKeywordSalaryAddItem,
    beforeFetch: (params) => {
      params.id = props.employeeId;
      return params;
    },
    afterFetch: (record) => {
      return record;
    },
    columns: addItemColumn,
    formConfig: {
      schemas: addItemSearchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    pagination: false,
    immediate: false,
    actionColumn: {
      width: 40,
      title: '',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  //-modal設定
  const [registerModal, { openModal, closeModal, setModalProps }] = useModal();

  /**
   * @description 設定
   * @param record
   */
  const handleSetting = (record) => {
    salaryAddItemId.value = record.ID;
    titleModal.value = record.name;
    useCustom.value = record.useCustom;
    amount.value = record.customAmount;
    openModal(true);
  };

  /**
   * @description ok
   */
  const handleOk = async () => {
    try {
      setModalProps({ confirmLoading: true });
      await setSalaryAddItem(props.employeeId!, {
        salaryAddItemId: salaryAddItemId.value,
        useCustom: useCustom.value,
        customAmount: Number(amount.value),
      });

      //-更新table資料
      const data = getDataSource();

      for (let i = 0; i < data.length; i++) {
        if (data[i].ID === salaryAddItemId.value) {
          data[i].useCustom = useCustom.value;
          data[i].customAmount = amount.value;
          break;
        }
      }

      useMessage().createMessage.success({ content: '設定成功' });
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };

  watch(
    () => props.employeeId,
    (_v) => {
      reload();
    },
  );
</script>
