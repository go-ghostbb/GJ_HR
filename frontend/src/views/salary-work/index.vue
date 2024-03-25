<template>
  <div>
    <Card class="m-2">
      <span class="mr-2">開始薪資作業</span>
      <RangePicker v-model:value="datePicker" format="YYYY-MM-DD" />
      <Button class="ml-2" type="primary">執行薪資作業</Button>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { Card, RangePicker, Button } from 'ant-design-vue';
  import { ref } from 'vue';
  import { Dayjs } from 'dayjs';

  defineOptions({
    name: 'SalaryWork',
    inheritAttrs: false,
  });

  //-薪資作業選取範圍
  const datePicker = ref<[Dayjs, Dayjs]>();
</script>
