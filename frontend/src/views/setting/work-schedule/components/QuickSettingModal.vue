<script setup lang="ts">
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import {
    Form,
    FormItem,
    Select,
    Row,
    Col,
    Checkbox,
    RangePicker,
    FormInstance,
  } from 'ant-design-vue';
  import { onMounted, reactive, ref } from 'vue';
  import { getWorkShiftByKeyword } from '@/api/setting/workShift';
  import SelectEmployeeModal from './SelectEmployeeModal.vue';

  const emit = defineEmits(['register', 'reload']);

  export interface FormState {
    mon: number[];
    tue: number[];
    wed: number[];
    thu: number[];
    fri: number[];
    sat: number[];
    sun: number[];
    dateRange: string[];
    employeeId: number[];
    ignoreVacation: boolean;
  }

  //-modal入口
  const [registerModal, { closeModal }] = useModalInner(() => {
    formState.mon = [];
    formState.tue = [];
    formState.wed = [];
    formState.thu = [];
    formState.fri = [];
    formState.sat = [];
    formState.sun = [];
    formState.dateRange = [];
    formState.employeeId = [];
    formState.ignoreVacation = false;
  });

  //-SelectEmployeeModal註冊
  const [registerSelectEmpModal, selectEmpMethod] = useModal();

  //-form state
  const formState = reactive<FormState>({
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
    dateRange: [],
    employeeId: [],
    ignoreVacation: false,
  });

  //-班別下拉式選單
  const workShiftOptions = ref<{ label: string; value: number }[]>([]);

  //-form ref
  const formRef = ref<FormInstance>();

  /**
   * @description 獲取work shift下拉式選單
   */
  const getWorkShiftOptions = async () => {
    const result: { label: string; value: number }[] = [];
    const workShifts = await getWorkShiftByKeyword();
    workShifts.items.forEach((workShift) => {
      result.push({ label: workShift.name!, value: workShift.ID });
    });
    workShiftOptions.value = result;
  };

  /**
   * @description ok
   */
  const handleSubmit = async () => {
    const result = await formRef.value?.validate();
    selectEmpMethod.openModal(true, { schedules: result });
  };

  /**
   * @description success
   */
  const handleSuccess = () => {
    emit('reload');
    closeModal();
  };

  onMounted(() => {
    getWorkShiftOptions();
  });
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :minHeight="350"
    width="700px"
    @ok="handleSubmit"
  >
    <!-- title -->
    <template #title>
      <span>{{ '快速設定' }}</span>
    </template>

    <!-- content -->
    <Form ref="formRef" :model="formState">
      <Row>
        <Col :span="12">
          <FormItem label="一" name="mon">
            <Select
              class="pr-4"
              v-model:value="formState.mon"
              :options="workShiftOptions"
              mode="multiple"
            />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="二" name="tue">
            <Select
              class="pr-4"
              v-model:value="formState.tue"
              :options="workShiftOptions"
              mode="multiple"
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="12">
          <FormItem label="三" name="wed">
            <Select
              class="pr-4"
              v-model:value="formState.wed"
              :options="workShiftOptions"
              mode="multiple"
            />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="四" name="thu">
            <Select
              class="pr-4"
              v-model:value="formState.thu"
              :options="workShiftOptions"
              mode="multiple"
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="12">
          <FormItem label="五" name="fri">
            <Select
              class="pr-4"
              v-model:value="formState.fri"
              :options="workShiftOptions"
              mode="multiple"
            />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="六" name="sat">
            <Select
              class="pr-4"
              v-model:value="formState.sat"
              :options="workShiftOptions"
              mode="multiple"
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="12">
          <FormItem label="日" name="sun">
            <Select
              class="pr-4"
              v-model:value="formState.sun"
              :options="workShiftOptions"
              mode="multiple"
            />
          </FormItem>
        </Col>
      </Row>
      <FormItem label="範圍" required name="dateRange">
        <RangePicker v-model:value="formState.dateRange" value-format="YYYY-MM-DD" />
      </FormItem>
      <FormItem name="ignoreVacation">
        <Checkbox v-model:checked="formState.ignoreVacation">{{ '忽略休假日' }}</Checkbox>
      </FormItem>
    </Form>

    <SelectEmployeeModal @register="registerSelectEmpModal" @success="handleSuccess" />
  </BasicModal>
</template>

<style scoped lang="less"></style>
