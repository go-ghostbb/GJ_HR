<script setup lang="ts">
  import { useModalInner } from '@/components/Modal';
  import { LeaveCorrectModel } from '@/api/query/model/leaveCorrect';
  import { reactive, ref } from 'vue';
  import { Form, FormItem, DatePicker, Input, FormInstance } from 'ant-design-vue';
  import BasicModal from '@/components/Modal/src/BasicModal.vue';
  import { updateLeaveCorrect } from '@/api/query/leave';

  const emit = defineEmits(['success', 'register']);

  interface FormState {
    effective: string;
    expired: string;
    available: number;
  }

  //-紀錄form
  const formState = reactive<FormState>({
    effective: '',
    expired: '',
    available: 0,
  });

  //-form ref
  const formRef = ref<FormInstance>();

  //-leave correct id
  const id = ref(0);

  //-modal入口
  const [registerModal, { closeModal, setModalProps }] = useModalInner(
    (data: { record: LeaveCorrectModel }) => {
      id.value = data.record.ID;
      formState.effective = data.record.effective!;
      formState.expired = data.record.expired!;
      formState.available = data.record.available!;
    },
  );

  /**
   * @description ok
   */
  const handleOk = async () => {
    setModalProps({ confirmLoading: true });

    try {
      //-驗證
      await formRef.value?.validate();

      //-將input出來的字串轉數字
      formState.available = Number(formState.available);

      //-api
      await updateLeaveCorrect(id.value, formState);

      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };
</script>

<template>
  <div>
    <BasicModal @register="registerModal" @ok="handleOk">
      <Form ref="formRef" :model="formState">
        <!-- 生效時間 -->
        <FormItem label="生效時間" name="effective">
          <DatePicker v-model:value="formState.effective" valueFormat="YYYY-MM-DD" />
        </FormItem>

        <!-- 過期時間 -->
        <FormItem label="過期時間" name="expired">
          <DatePicker v-model:value="formState.expired" valueFormat="YYYY-MM-DD" />
        </FormItem>

        <!-- 可用天數 -->
        <FormItem label="可用天數" name="available">
          <Input v-model:value="formState.available" />
        </FormItem>
      </Form>
    </BasicModal>
  </div>
</template>

<style scoped lang="less"></style>
