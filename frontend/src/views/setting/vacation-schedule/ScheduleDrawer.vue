<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="register" @submit="handleSubmit" />
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { computed, ref, unref } from 'vue';
  import { scheduleFormSchema } from './data';
  import {
    createVacationSchedule,
    getVacationByKeyword,
    updateVacationSchedule,
  } from '@/api/setting/vacation';
  import { VacationScheduleModel } from '@/api/setting/model/vacationScheduleModel';

  const emit = defineEmits(['success', 'register']);

  const getTitle = computed(() => (!unref(isUpdate) ? '新增休假日' : '編輯休假日'));

  const isUpdate = ref(false);

  const record = ref<VacationScheduleModel>();

  //-控制vacation fetch只執行一次
  const vacationOnce = ref(false);

  //-預設選擇的休假日
  const defaultVacationId = ref(0);

  //-form設定
  const [register, { validate, resetFields, setFieldsValue, updateSchema }] = useForm({
    schemas: scheduleFormSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 24, md: 24 },
    labelWidth: 100,
  });

  //-drawer入口
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });

    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      record.value = data.record;
      setFieldsValue({
        ...data.record,
      });
    } else {
      setFieldsValue({ vacationId: defaultVacationId.value });
      if (data.date) {
        setFieldsValue({
          vacationId: defaultVacationId.value,
          startDate: data.date,
          endDate: data.date,
          endRepeat: data.date,
        });
      }
    }

    //-下面fetch只會執行一次, 由vacationOnce控制
    if (!vacationOnce.value) {
      const vacation = await getVacationByKeyword({ status: true });
      if (vacation.items.length > 0) {
        defaultVacationId.value = vacation.items[0].ID;
        setFieldsValue({ vacationId: defaultVacationId.value });
        updateSchema({
          field: 'vacationId',
          defaultValue: vacation.items[0].ID,
          componentProps: {
            options: vacation.items,
          },
        });
      }
      vacationOnce.value = true;
    }
  });

  /**
   * @description 提交
   */
  const handleSubmit = async () => {
    try {
      setDrawerProps({ confirmLoading: true });
      //-驗證
      const values = await validate();

      //-向下執行代表驗證成功
      if (!unref(isUpdate)) {
        //-創建
        await createVacationSchedule(values as VacationScheduleModel);
      } else {
        //-更新
        await updateVacationSchedule(record.value!.generalKey!, values as VacationScheduleModel);
      }

      emit('success');
      closeDrawer();
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };
</script>
