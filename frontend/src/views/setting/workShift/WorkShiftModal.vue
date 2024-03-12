<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { formSchema } from './data';
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { useForm, BasicForm } from '@/components/Form';
  import { createWorkShift, updateWorkShift } from '@/api/setting/workShift';
  import { WorkShiftModel } from '@/api/setting/model/workShiftModel';
  import dayjs from 'dayjs';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const record = ref<WorkShiftModel>();

  //-form設定
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  //-modal入口
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    //-如果是要編輯的話，把值塞進form
    if (unref(isUpdate)) {
      record.value = data?.record;
      setFieldsValue({ ...record.value });
      setFieldsValue({
        workStart: dayjs(record.value?.workStart).tz('UTC').format('HH:mm:ss'),
        workEnd: dayjs(record.value?.workEnd).tz('UTC').format('HH:mm:ss'),
        restStart: dayjs(record.value?.restStart).tz('UTC').format('HH:mm:ss'),
        restEnd: dayjs(record.value?.restEnd).tz('UTC').format('HH:mm:ss'),
      });
    } else {
      record.value = { ID: 0 };
    }
  });

  //-modal標題
  const getTitle = computed(() => (!unref(isUpdate) ? '新增班別' : '編輯班別'));

  //-提交
  const handleSubmit = async () => {
    try {
      //-驗證表單內容
      const values = await validate();

      //-往下執行代表通過
      // date轉換型態
      values.workStart = dayjs(values.workStart, 'HH:mm:ss').format('YYYY-MM-DDTHH:mm:ssZ');
      values.workEnd = dayjs(values.workEnd, 'HH:mm:ss').format('YYYY-MM-DDTHH:mm:ssZ');
      values.restStart = dayjs(values.restStart, 'HH:mm:ss').format('YYYY-MM-DDTHH:mm:ssZ');
      values.restEnd = dayjs(values.restEnd, 'HH:mm:ss').format('YYYY-MM-DDTHH:mm:ssZ');
      //-api
      setModalProps({ confirmLoading: true });
      if (!unref(isUpdate)) {
        //-新增
        await createWorkShift(values as WorkShiftModel);
      } else {
        //-編輯
        await updateWorkShift(record.value!.ID, values as WorkShiftModel);
      }
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };
</script>
