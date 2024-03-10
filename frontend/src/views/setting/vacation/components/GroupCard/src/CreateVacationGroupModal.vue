<template>
  <BasicModal
    v-bind="$attrs"
    :minHeight="100"
    :height="100"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" style="z-index: 999" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { createGroup } from '@/api/setting/vacation';
  import { VacationGroupModel } from '@/api/setting/model/vacationGroupModel';
  import { useForm, BasicForm } from '@/components/Form';
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { computed, ref, unref } from 'vue';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const vacationId = ref(0);

  //-modal title
  const getTitle = computed(() => (!unref(isUpdate) ? '新增群組' : '編輯群組'));

  //-form
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: [
      {
        field: 'name',
        label: '群組名稱',
        required: true,
        component: 'Input',
      },
    ],
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  //-modal入口
  const [registerModal, { closeModal, setModalProps }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });

    isUpdate.value = !!data?.isUpdate;
    vacationId.value = data.vacationId;

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });
    }
  });

  /**
   * @description 點擊確認事件
   */
  const handleSubmit = async () => {
    try {
      setModalProps({ confirmLoading: true });
      //-驗證表單
      const values: VacationGroupModel = await validate();

      values.vacationId = vacationId.value;

      await createGroup(values);

      emit('success');
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };
</script>
