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
  import { PositionGradeModel } from '@/api/setting/model/positionGradeModel';
  import { createGrade, updateGrade } from '@/api/setting/grade';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const record = ref<PositionGradeModel>();
  const rankId = ref<number>(0);

  //-form設定
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  //-modal入口
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    rankId.value = data.rankId;

    //-如果是要編輯的話，把值塞進form
    if (unref(isUpdate)) {
      record.value = data?.record;
      setFieldsValue({ ...record.value });
    } else {
      record.value = { ID: 0 };
    }
  });

  //-modal標題
  const getTitle = computed(() => (!unref(isUpdate) ? '新增職等' : '編輯職等'));

  //-提交
  const handleSubmit = async () => {
    try {
      //-驗證表單內容
      const values = await validate();

      //-往下執行代表通過

      values.rankId = rankId.value;
      console.log(values);
      //-api
      setModalProps({ confirmLoading: true });
      if (!unref(isUpdate)) {
        //-新增
        await createGrade(values as PositionGradeModel);
      } else {
        //-編輯
        await updateGrade(record.value!.ID, values as PositionGradeModel);
      }
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };
</script>
