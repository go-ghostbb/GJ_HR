<script setup lang="ts">
  import { BasicTable, useTable } from '@/components/Table';
  import { getByDateRangeAndKeywordCheckInStatus } from '@/api/query/check_in';
  import { column, searchFormSchema } from './data';

  defineOptions({
    name: 'CheckInStatusQuery',
    inheritAttrs: false,
  });

  //-table設定
  const [registerTable] = useTable({
    title: '出缺勤列表',
    api: getByDateRangeAndKeywordCheckInStatus,
    columns: column,
    formConfig: {
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    immediate: false,
  });
</script>

<template>
  <BasicTable @register="registerTable" />
</template>

<style scoped lang="less"></style>
