<script setup lang="ts">
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { Form, FormItem, Transfer, Button, InputNumber, FormInstance } from 'ant-design-vue';
  import { onMounted, reactive, ref } from 'vue';
  import dayjs from 'dayjs';
  import { getLeaveByKeyword } from '@/api/setting/leave';
  import { LeaveModel, ResetAvailableParams } from '@/api/setting/model/leaveModel';
  import { useDesign } from '@/hooks/web/useDesign';
  import SelectEmployeeModal from './SelectEmployeeModal.vue';

  const { prefixCls } = useDesign('leave-reset-available');

  const emit = defineEmits(['register', 'success']);

  interface FormState {
    leaveId: number[];
    employeeId: number[];
    year: number;
  }

  interface MockData {
    key: string;
    title: string;
    description: string;
    disabled: boolean;
  }

  //-SelectEmployeeModal註冊
  const [registerEmpModal, empMethod] = useModal();

  //-form state
  const formState = reactive<FormState>({
    leaveId: [],
    employeeId: [],
    year: dayjs().year(),
  });

  //-form ref
  const formRef = ref<FormInstance>();

  /**
   * @description leave transfer data source
   */
  const leaveDataSource = ref<MockData[]>([]);

  //-modal入口
  const [registerModal, { setModalProps, closeModal, changeLoading }] = useModalInner(
    (_data) => {},
  );

  /**
   * @description ok
   */
  const handleSubmit = async () => {
    const result = (await formRef.value?.validate()) as ResetAvailableParams;

    // convert to number
    for (let i = 0; i < result.leaveId.length; i++) {
      result.leaveId[i] = Number(result.leaveId[i]);
    }
    empMethod.openModal(true, { formData: result });
  };

  /**
   * @description success
   */
  const handleSuccess = () => {
    closeModal();
    emit('success');
  };

  /**
   * @description fetch
   */
  const fetch = async () => {
    changeLoading(true);
    const leaves = await getLeaveByKeyword();
    const tmpLeaveDataSource: MockData[] = [];

    if (leaves) {
      leaves.items.forEach((item: LeaveModel) => {
        tmpLeaveDataSource.push({
          key: String(item.ID),
          title: item.name!,
          description: '',
          disabled: false,
        });
      });
    }

    leaveDataSource.value = tmpLeaveDataSource;

    changeLoading(false);
  };

  onMounted(() => {
    fetch();
  });
</script>

<template>
  <BasicModal class="test" v-bind="$attrs" @register="registerModal" @ok="handleSubmit">
    <template #title>
      {{ '給假' }}
      <Button class="ml-2" @click="fetch" size="small">刷新</Button>
    </template>

    <Form :class="`${prefixCls}-form`" ref="formRef" :model="formState">
      <FormItem name="year" label="年">
        <InputNumber v-model:value="formState.year" style="width: 100px" />
      </FormItem>

      <FormItem name="leaveId" label="假別">
        <Transfer
          v-model:target-keys="formState.leaveId"
          :data-source="leaveDataSource"
          :list-style="{ height: '200px', width: '150px' }"
        >
          <template #render="item">
            <span>{{ item.title }}</span>
          </template>
        </Transfer>
      </FormItem>
    </Form>

    <SelectEmployeeModal @register="registerEmpModal" @success="handleSuccess" />
  </BasicModal>
</template>

<style lang="less">
  @prefix-cls: ~'@{namespace}-leave-reset-available';

  .@{prefix-cls} {
    &-form {
      .ant-transfer-list-body {
        height: 200px;
      }
    }
  }
</style>
