<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :footer="null">
    <Result title="此為重複休假日">
      <template #extra>
        <div v-if="!unref(isUpdate)">
          <Button @click="all">刪除所有</Button>
          <Button class="ml-3" @click="one">刪除此筆</Button>
          <Button class="ml-3" @click="closeModal">取消</Button>
        </div>
        <div v-else>
          <Button @click="all">更新所有</Button>
          <Button class="ml-3" @click="one">更新此筆</Button>
          <Button class="ml-3" @click="closeModal">取消</Button>
        </div>
      </template>
    </Result>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Button, Result } from 'ant-design-vue';
  import { ref, unref } from 'vue';

  const isUpdate = ref(false);
  const scheduleData = ref();

  const emit = defineEmits(['result', 'register']);

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    isUpdate.value = !!data?.isUpdate;
    scheduleData.value = data.schedule;
  });

  const one = () => {
    closeModal();
    emit('result', 'one', scheduleData.value);
  };

  const all = () => {
    closeModal();
    emit('result', 'all', scheduleData.value);
  };
</script>
