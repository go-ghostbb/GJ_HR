<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { LeaveModel } from '@/api/setting/model/leaveModel';
  import { computed, ref, unref } from 'vue';
  import { formSchema } from './data';
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { useForm, BasicForm } from '@/components/Form';
  import { createLeave, updateLeave } from '@/api/setting/leave';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const record = ref<LeaveModel>();

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
    } else {
      record.value = { ID: 0 };
    }
  });

  //-modal標題
  const getTitle = computed(() => (!unref(isUpdate) ? '新增假別' : '編輯假別'));

  //-提交
  const handleSubmit = async () => {
    try {
      //-驗證表單內容
      const values = await validate();

      //-往下執行代表通過

      //-number格式
      //-猜測套件問題有時候number會變成string, 需手動轉回來
      values.default = Number(values.default);
      values.minimum = Number(values.minimum);
      //-將進階設定資料放入
      values.deferrable = record.value?.deferrable;
      values.deferrableDays = record.value?.deferrableDays;
      values.customizableDuration = record.value?.customizableDuration;
      values.duration = record.value?.duration;
      //-api
      setModalProps({ confirmLoading: true });
      if (!unref(isUpdate)) {
        //-新增
        await createLeave(values as LeaveModel);
      } else {
        //-編輯
        await updateLeave(record.value!.ID, values as LeaveModel);
      }
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };
</script>
