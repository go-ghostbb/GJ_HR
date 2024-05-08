<template>
  <div v-loading="loading">
    <Button @click="handleUploadExcel">上傳(Excel)版本</Button>
    <Button @click="handleUploadTxt">上傳(Txt)版本</Button>
    <Button @click="handleUploadTxtDir">上傳(Txt Dir)版本</Button>
  </div>
</template>

<script lang="ts" setup>
  import { useMessage } from '@/hooks/web/useMessage';
  import { UploadData, UploadTxtData, UploadTxtDataDir } from '@/wailsjs/go/service/checkInService';
  import { Button } from 'ant-design-vue';
  import { ref } from 'vue';

  defineOptions({
    name: 'CheckInDataUpload',
    inheritAttrs: false,
  });

  const loading = ref(false);

  /**
   * @description 上傳Excel
   */
  const handleUploadExcel = async () => {
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

  /**
   * @description 上傳txt
   */
  const handleUploadTxt = async () => {
    loading.value = true;
    const resp = await UploadTxtData();
    if (resp.success) {
      useMessage().createMessage.success({ content: '上傳成功' });
    } else {
      if (resp.msg !== 'close') {
        useMessage().createMessage.error({ content: '上傳失敗:' + resp.msg });
      }
    }

    loading.value = false;
  };

  /**
   * @description 上傳txt 資料夾內所有
   */
  const handleUploadTxtDir = async () => {
    loading.value = true;
    const resp = await UploadTxtDataDir();
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
