<template>
  <BasicTable @register="registerTable" />
</template>

<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { absenceColumn, absenceSearchFormSchema } from '../data';
  import { getByDateRangeCheckInStatus } from '@/api/manager/employee';

  const props = defineProps({
    employeeId: {
      type: Number,
    },
  });

  //-table設定
  const [registerTable] = useTable({
    title: '出缺勤列表',
    api: getByDateRangeCheckInStatus,
    beforeFetch: (params) => {
      params.id = props.employeeId;
      return params;
    },
    afterFetch: (record) => {
      return record;
    },
    columns: absenceColumn,
    formConfig: {
      schemas: absenceSearchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    pagination: false,
    immediate: false,
  });
</script>
