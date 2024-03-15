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
  import { PositionRankModel } from '@/api/setting/model/positionRankModel';
  import { createRank, updateRank } from '@/api/setting/rank';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const record = ref<PositionRankModel>();

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
  const getTitle = computed(() => (!unref(isUpdate) ? '新增職級' : '編輯職級'));

  //-提交
  const handleSubmit = async () => {
    try {
      //-驗證表單內容
      const values = await validate();

      //-往下執行代表通過

      //-api
      setModalProps({ confirmLoading: true });
      if (!unref(isUpdate)) {
        //-新增
        await createRank(values as PositionRankModel);
      } else {
        //-編輯
        await updateRank(record.value!.ID, values as PositionRankModel);
      }
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };
</script>
