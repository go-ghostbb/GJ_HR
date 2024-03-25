<template>
  <div v-loading="loading">
    <Button @click="handleUpload">上傳</Button>
  </div>
</template>

<script lang="ts" setup>
  import { useMessage } from '@/hooks/web/useMessage';
  import { UploadData } from '@/wailsjs/go/service/checkInService';
  import { Button } from 'ant-design-vue';
  import { ref } from 'vue';

  defineOptions({
    name: 'CheckInDataUpload',
    inheritAttrs: false,
  });

  const loading = ref(false);

  /**
   * @description 上傳
   */
  const handleUpload = async () => {
    loading.value = true;
    const resp = await UploadData();
    if (resp.success) {
      useMessage().createMessage.success({ content: '上傳成功' });
    } else {
      if (resp.msg !== 'close') {
        useMessage().createMessage.error({ content: '上傳失敗:' + resp.msg });
      }
    }

    loading.value = false;
  };
</script>
