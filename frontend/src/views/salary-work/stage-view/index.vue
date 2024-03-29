<template>
  <div v-loading="loading">
    <!-- header -->
    <Card class="m-2">
      <!-- title -->
      <h3 class="ml-3">
        <Icon icon="ant-design:calendar-outlined" />
        薪資期間：
        {{ dayjs(calcData.start).format('YYYY-MM-DD') }} ~
        {{ dayjs(calcData.end).format('YYYY-MM-DD') }}
      </h3>
      <!-- steps -->
      <div class="w-50% mt-10">
        <Steps
          :current="calcData.stage! - 1"
          :items="stepsItem"
          size="small"
          label-placement="vertical"
        />
      </div>
    </Card>

    <!-- body -->
    <Card class="m-2">
      <BasicTable @register="registerTable">
        <!-- title -->
        <template #tableTitle>
          <span> {{ `員工人數：${calcData.calcSalaryEmployee?.length}` }} </span>
        </template>

        <!-- toolbar -->
        <template #toolbar>
          <Button :disabled="disabledSave" @click="handleSave">儲存</Button>
          <Button type="primary" @click="goNext">下一步</Button>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  icon: 'ant-design:plus-outlined',
                  tooltip: '加項',
                  onClick: handlePlus.bind(null, record as CalcSalaryEmployeeModel),
                },
                {
                  icon: 'ant-design:minus-outlined',
                  color: 'error',
                  tooltip: '減項',
                  onClick: handleMinus.bind(null, record as CalcSalaryEmployeeModel),
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </Card>

    <addModal @register="registerAddModal" @success="handleAddSuccess" />
    <reduceModal @register="registerReduceModal" @success="handleReduceSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import {
    CalcSalaryAddModel,
    CalcSalaryEmployeeModel,
    CalcSalaryModel,
    CalcSalaryReduceModel,
  } from '@/api/salary-work/model/salary-work';
  import { getByIDSalaryCalc, saveCalcEmployee } from '@/api/salary-work/salary-work';
  import { useTabs } from '@/hooks/web/useTabs';
  import { onMounted, ref } from 'vue';
  import dayjs from 'dayjs';
  import { useRoute } from 'vue-router';
  import { Card, Steps, Button } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { useTable, BasicTable, TableAction } from '@/components/Table';
  import { columns } from './data';
  import addModal from './addModal.vue';
  import reduceModal from './reduceModal.vue';
  import { useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';

  defineOptions({
    name: 'SalaryWorkSetting',
    inheritAttrs: false,
  });

  //-addModal註冊
  const [registerAddModal, addMethod] = useModal();

  //-reduceModal註冊
  const [registerReduceModal, reduceMethod] = useModal();

  //-id
  const calcId = ref(useRoute().params?.id);

  //-薪資作業資料
  const calcData = ref<CalcSalaryModel>({ ID: 0 });

  //-loading
  const loading = ref(false);

  //-註冊useTabs
  const { setTitle } = useTabs();

  //-關閉儲存按鈕
  const disabledSave = ref(true);

  //-步驟條
  const stepsItem = [
    {
      title: '步驟一：調整薪資',
    },
    {
      title: '步驟二：檢查與確認',
    },
    {
      title: '步驟三：完成作業',
    },
  ];

  //-table設定
  const [registerTable, { setTableData, getDataSource }] = useTable({
    columns,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    resizeHeightOffset: 8,
    pagination: false,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
    tableSetting: { redo: false },
    canResize: false,
  });

  /**
   * @description fetch
   */
  const fetch = async () => {
    if (typeof calcId.value === 'string') {
      try {
        loading.value = true;
        //-fetch
        calcData.value = await getByIDSalaryCalc(Number(calcId.value));

        //-set title
        const start = dayjs(calcData.value.start).format('YYYY-MM-DD');
        const end = dayjs(calcData.value.end).format('YYYY-MM-DD');
        switch (calcData.value.stage) {
          case 1:
            setTitle(`調整薪資:${start} ~ ${end}`);
            break;
        }

        //-寫入table
        setTableData(calcData.value.calcSalaryEmployee!);
      } finally {
        loading.value = false;
      }
    }
  };

  /**
   * @description 加項
   * @param record
   */
  const handlePlus = (record: CalcSalaryEmployeeModel) => {
    addMethod.openModal(true, { id: record.ID, addItem: record.salaryAdd });
  };

  /**
   * @description 減項
   * @param record
   */
  const handleMinus = (record: CalcSalaryEmployeeModel) => {
    reduceMethod.openModal(true, { id: record.ID, reduceItem: record.salaryReduce });
  };

  /**
   * @description 加項設定成功
   * @param item
   */
  const handleAddSuccess = (id: number, item: CalcSalaryAddModel[]) => {
    const data = getDataSource() as CalcSalaryEmployeeModel[];
    for (let i = 0; i < data.length; i++) {
      if (data[i].ID === id) {
        data[i].salaryAdd = item;
      }
    }
    disabledSave.value = false;
  };

  /**
   * @description 減項設定成功
   * @param item
   */
  const handleReduceSuccess = (id: number, item: CalcSalaryReduceModel[]) => {
    const data = getDataSource() as CalcSalaryEmployeeModel[];
    for (let i = 0; i < data.length; i++) {
      if (data[i].ID === id) {
        data[i].salaryReduce = item;
      }
    }
    disabledSave.value = false;
  };

  /**
   * @description save
   */
  const handleSave = async () => {
    try {
      loading.value = true;
      await saveCalcEmployee(getDataSource());
      useMessage().createMessage.success({ content: '儲存成功' });
      disabledSave.value = true;
    } finally {
      loading.value = false;
    }
  };

  /**
   * @description 前往下一階段
   */
  const goNext = () => {
    if (!disabledSave.value) {
      useMessage().createMessage.error({ content: '請先儲存內容' });
    }
  };

  onMounted(() => {
    fetch();
  });
</script>
