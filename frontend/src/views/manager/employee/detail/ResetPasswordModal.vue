<template>
  <BasicModal
    :footer="null"
    v-bind="$attrs"
    :class="prefixCls"
    @register="registerModal"
    :title="'重置密碼'"
  >
    <div :class="`${prefixCls}__entry`">
      <div :class="`${prefixCls}__header`">
        <img :src="state.avatarURL || headerImg" :class="`${prefixCls}__header-img`" />
        <p :class="`${prefixCls}__header-name`">
          {{ state.realName }}
        </p>
      </div>

      <BasicForm @register="registerForm" />

      <div :class="`${prefixCls}__footer`">
        <a-button type="primary" block class="mt-2" @click="handleSubmit">
          {{ '確認' }}
        </a-button>
      </div>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { useModalInner } from '@/components/Modal';
  import { useForm } from '@/components/Form';
  import BasicModal from '@/components/Modal/src/BasicModal.vue';
  import BasicForm from '@/components/Form/src/BasicForm.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import headerImg from '/@/assets/images/header.jpg';
  import { reactive } from 'vue';
  import { resetPassword } from '@/api/manager/employee';
  import { ResetPasswordParams } from '@/api/manager/model/employeeModel';

  const emit = defineEmits(['success', 'register']);

  const { prefixCls } = useDesign('employee-resetPassword-modal');

  //-各項參數
  const state = reactive({
    employeeId: 0,
    realName: '',
    avatarURL: '',
  });

  //-modal入口
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    state.employeeId = data.employeeId;
    state.realName = data.realName;
    state.avatarURL = data.avatarURL;
  });

  //-註冊form
  const [registerForm, { resetFields, validate, getFieldsValue }] = useForm({
    showActionButtonGroup: false,
    labelWidth: 80,
    schemas: [
      {
        field: 'password',
        label: '密碼',
        colProps: {
          span: 24,
        },
        component: 'InputPassword',
        required: true,
        rules: [{ min: 6, max: 18, message: '長度必須介於6到18' }],
      },
      {
        field: 'verifyPassword',
        label: '驗證密碼',
        colProps: {
          span: 24,
        },
        component: 'InputPassword',
        required: true,
        rules: [
          {
            validator: (rule, value, callback) => {
              const values = getFieldsValue();
              if (values.password != value) {
                callback('密碼不一致');
              }
              callback();
            },
          },
        ],
      },
    ],
  });

  /**
   * @description 點擊確認事件
   */
  const handleSubmit = async () => {
    try {
      //-驗證表單
      const values = await validate();
      //-往下執行代表通過
      await resetPassword(state.employeeId, values as ResetPasswordParams);
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-employee-resetPassword-modal';

  .@{prefix-cls} {
    &__entry {
      position: relative;
      //height: 240px;
      padding: 130px 30px 30px;
      border-radius: 10px;
    }

    &__header {
      position: absolute;
      top: 0;
      left: calc(50% - 45px);
      width: auto;
      text-align: center;

      &-img {
        width: 70px;
        border-radius: 50%;
      }

      &-name {
        margin-top: 5px;
      }
    }

    &__footer {
      text-align: center;
    }
  }
</style>
