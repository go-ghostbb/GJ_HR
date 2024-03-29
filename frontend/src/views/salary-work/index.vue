<template>
  <div v-loading="loading" class="h-full">
    <!-- 上方選取範圍 -->
    <Card class="m-2">
      <span class="mr-2">開始薪資作業</span>
      <RangePicker v-model:value="datePicker" format="YYYY-MM-DD" />
      <Button class="ml-2" type="primary" @click="handleStartWork">執行薪資作業</Button>
    </Card>

    <!-- 下方table -->
    <Card class="m-2 h-[calc(100%-108px)]">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  icon: 'ant-design:setting-outlined',
                  tooltip: '設定',
                  onClick: handleSetting.bind(null, record as CalcSalaryModel),
                },
                {
                  icon: 'ant-design:delete-outlined',
                  color: 'error',
                  tooltip: '刪除',
                  popConfirm: {
                    title: '確認是否刪除',
                    placement: 'left',
                    confirm: handleDelete.bind(null, record as CalcSalaryModel),
                  },
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </Card>

    <EmployeeSelectModal @register="registerEmployeeModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { Card, RangePicker, Button } from 'ant-design-vue';
  import { ref } from 'vue';
  import { Dayjs } from 'dayjs';
  import EmployeeSelectModal from './EmployeeSelectModal.vue';
  import { useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { deleteSalaryCalc, getSalaryCalc } from '@/api/salary-work/salary-work';
  import { columns } from './data';
  import { useTable, BasicTable, TableAction } from '@/components/Table';
  import { CalcSalaryModel } from '@/api/salary-work/model/salary-work';
  import { useGo } from '@/hooks/web/usePage';

  defineOptions({
    name: 'SalaryWork',
    inheritAttrs: false,
  });

  const loading = ref(false);

  //-EmployeeSelectModal註冊
  const [registerEmployeeModal, employeeMethod] = useModal();

  //-薪資作業選取範圍
  const datePicker = ref<[Dayjs, Dayjs]>();

  //-註冊useGo
  const go = useGo();

  //-table設定
  const [registerTable, { reload }] = useTable({
    title: '',
    api: getSalaryCalc,
    columns,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    resizeHeightOffset: 8,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  /**
   * @description 點擊執行薪資作業事件
   */
  const handleStartWork = () => {
    if (!datePicker.value) {
      useMessage().createMessage.error({ content: '請選取作業範圍' });
      return;
    }
    employeeMethod.openModal(true, {
      dateRangeStart: datePicker.value[0].format('YYYY-MM-DD'),
      dateRangeEnd: datePicker.value[1].format('YYYY-MM-DD'),
    });
  };

  /**
   * @description 成功
   */
  const handleSuccess = () => {
    setLoading(false);
    useMessage().createMessage.success({ content: '操作成功' });
    reload();
  };

  /**
   * @description 設定loading
   * @param status
   */
  const setLoading = (status: boolean) => {
    loading.value = status;
  };

  /**
   * @description 點擊刪除
   * @param record CalcSalaryModel
   */
  const handleDelete = async (record: CalcSalaryModel) => {
    try {
      setLoading(true);
      await deleteSalaryCalc(record.ID);
      handleSuccess();
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description 點擊設定
   * @param record
   */
  const handleSetting = (record: CalcSalaryModel) => {
    go(`/salaryWork/setting/${record.ID}`);
    console.log(record);
  };
</script>
