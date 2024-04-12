<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <!-- 設定 -->
    <Setting ref="settingRef" class="w-2/4 xl:w-55%" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import Setting from './components/Setting.vue';
  import { PageWrapper } from '@/components/Page';

  defineOptions({
    name: 'SignOffCheckInSetting',
    inheritAttrs: false,
  });

  //-setting ref
  const settingRef = ref();

  onMounted(() => {
    settingRef.value.fetch();
  });
</script>
