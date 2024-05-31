<script setup lang="ts">
  import { BasicTable, useTable } from '@/components/Table';
  import { column, searchFormSchema } from './data';
  import { getLeaveCorrectByKeyword } from '@/api/query/leave';

  defineOptions({
    name: 'LeaveCorrectQuery',
    inheritAttrs: false,
  });

  const [registerTable, { setLoading, reload }] = useTable({
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
  });
</script>

<template>
  <div>
    <BasicTable @register="registerTable" />
  </div>
</template>

<style scoped lang="less"></style>
