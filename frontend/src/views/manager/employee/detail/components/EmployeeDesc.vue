<template>
  <Description
    :collapseOptions="{ canExpand: true, helpMessage: 'help me' }"
    :column="4"
    :data="props.employeeInfo"
    :schema="detailDescSchema"
  />
</template>

<script lang="ts" setup>
  import { EmployeeModel } from '@/api/manager/model/employeeModel';
  import { Description } from '@/components/Description';
  import { detailDescSchema } from '../data';

  const props = defineProps({
    employeeInfo: {
      type: Object as PropType<EmployeeModel>,
    },
  });
</script>
