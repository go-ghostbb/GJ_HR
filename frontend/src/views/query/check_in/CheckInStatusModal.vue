<script setup lang="ts">
  import BasicModal from '@/components/Modal/src/BasicModal.vue';
  import { useModalInner } from '@/components/Modal';
  import { CheckInStatusModel } from '@/api/manager/model/checkInStatus';
  import { Form, FormItem, DatePicker, FormInstance } from 'ant-design-vue';
  import { reactive, ref } from 'vue';
  import { updateCheckInStatus } from '@/api/query/check_in';

  const emit = defineEmits(['success', 'register']);

  interface FormState {
    workShiftId: number;
    work: string;
    offWork: string;
  }

  const formState = reactive<FormState>({
    workShiftId: 0,
    work: '',
    offWork: '',
  });

  const formRef = ref<FormInstance>();

  const id = ref(0);

  //-modal入口
  const [registerModal, { closeModal, setModalProps }] = useModalInner(
    (data: { record: CheckInStatusModel }) => {
      id.value = data.record.ID;
      formState.workShiftId = data.record.workShiftId!;
      if (data.record.workCheckIn) {
        formState.work = data.record.workCheckIn;
      }
      if (data.record.offWorkCheckIn) {
        formState.offWork = data.record.offWorkCheckIn;
      }
    },
  );

  /**
   * @description ok
   */
  const handleOk = async () => {
    setModalProps({ confirmLoading: true });
    //-驗證
    await formRef.value?.validate();

    await updateCheckInStatus(id.value, {
      workShiftId: formState.workShiftId,
      work: formState.work,
      offWork: formState.offWork,
    });

    emit('success');
    setModalProps({ confirmLoading: false });
    closeModal();
  };
</script>

<template>
  <BasicModal v-bind="$attrs" @register="registerModal" @ok="handleOk">
    <Form ref="formRef" :model="formState">
      <FormItem label="上班時間" name="work">
        <DatePicker v-model:value="formState.work" valueFormat="YYYY-MM-DD HH:mm:ss" showTime />
      </FormItem>
      <FormItem label="下班時間" name="work">
        <DatePicker v-model:value="formState.offWork" valueFormat="YYYY-MM-DD HH:mm:ss" showTime />
      </FormItem>
    </Form>
  </BasicModal>
</template>

<style scoped lang="less"></style>
