<template>
  <PageWrapper v-loading="loading" contentBackground @back="goBack">
    <!-- 標題 -->
    <template #title>
      <img :src="avatarURL || headerImg" :class="`${prefixCls}__img`" />
      {{ employeeInfo?.realName }}
    </template>

    <!-- 右上角按鈕 -->
    <template #extra>
      <a-button
        type="primary"
        :danger="loginStatus"
        :color="loginStatus ? '' : 'success'"
        :loading="loginStatusLoading"
        @click="handleSetLoginStatus(!loginStatus)"
      >
        {{ loginStatus ? '禁用帳號' : '啟用帳號' }}
      </a-button>
      <a-button type="primary" @click="handleResetPassword">
        {{ '重置密碼' }}
      </a-button>
    </template>

    <!-- tab -->
    <template #footer>
      <Tabs default-active-key="detail" v-model:activeKey="tabActiveKey">
        <TabPane key="detail" tab="員工資料" />
        <TabPane key="logs" tab="操作日誌" />
      </Tabs>
    </template>

    <!-- 內容 -->
    <div class="m-4 desc-wrap">
      <template v-if="tabActiveKey == 'detail'">
        <Description
          :collapseOptions="{ canExpand: true, helpMessage: 'help me' }"
          :column="4"
          :data="employeeInfo"
          :schema="detailDescSchema"
        />
      </template>

      <template v-if="tabActiveKey == 'logs'">
        <div v-for="i in 10" :key="i">這是使用者{{ employeeId }}操作日誌</div>
      </template>
    </div>

    <ResetPasswordModal
      @register="resetPasswordRegisterModal"
      @success="handleResetPasswordSuccess"
    />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { onMounted, ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '@/components/Page';
  import { Description } from '@/components/Description';
  import { useGo } from '@/hooks/web/usePage';
  import { useTabs } from '@/hooks/web/useTabs';
  import { Tabs, TabPane } from 'ant-design-vue';
  import headerImg from '@/assets/images/header.jpg';
  import { getEmployeeByID, setLoginStatus } from '@/api/manager/employee';
  import { EmployeeModel } from '@/api/manager/model/employeeModel';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useMessage } from '@/hooks/web/useMessage';
  import { detailDescSchema } from './data';
  import ResetPasswordModal from './ResetPasswordModal.vue';
  import { useModal } from '@/components/Modal';

  const { prefixCls } = useDesign('employee-detail');

  const tabActiveKey = ref<string>('detail');

  //-註冊ResetPasswordModal
  const [resetPasswordRegisterModal, resetPassword] = useModal();

  //-畫面是否載入中
  const loading = ref(false);

  //-註冊useGo
  const go = useGo();

  //-註冊useTabs
  const { setTitle } = useTabs();

  //-此處可以得到員工ID, 根據路由參數獲取
  const employeeId = ref(useRoute().params?.id);

  //-員工資訊
  const employeeInfo = ref<EmployeeModel>();

  //-登入狀態&loading
  const loginStatus = ref<boolean>();
  const loginStatusLoading = ref<boolean>(false);

  //-頭像URL
  const avatarURL = computed(() => {
    if (employeeInfo.value && employeeInfo.value.avatar !== '') {
      return `${import.meta.env.VITE_GLOB_API_URL}/assets/employee/${employeeId.value}/${employeeInfo.value.avatar}`;
    } else {
      return undefined;
    }
  });

  /**
   * @description 頁面左側點擊返回鏈結時的操作
   */
  const goBack = () => {
    go('/manager/employee');
  };

  /**
   * @description 獲取員工資訊
   */
  const getEmployeeInfo = async () => {
    const info = await getEmployeeByID(Number(employeeId.value));
    employeeInfo.value = info;
    loginStatus.value = info.loginInformation?.status;
    //-設置Tab的標題（不會影響頁面標題）
    setTitle('詳情：' + employeeInfo.value.realName);
  };

  /**
   * @description 設置登入狀態
   * @param status
   */
  const handleSetLoginStatus = (status: boolean) => {
    if (employeeInfo.value) {
      loginStatusLoading.value = true;
      setLoginStatus(employeeInfo.value.ID, status)
        .then(() => {
          loginStatus.value = status;
          useMessage().createMessage.success({ content: '設置成功' });
        })
        .finally(() => {
          loginStatusLoading.value = false;
        });
    }
  };

  /**
   * @description 點擊重置密碼事件
   */
  const handleResetPassword = () => {
    resetPassword.openModal(true, {
      employeeId: employeeInfo.value?.ID,
      realName: employeeInfo.value?.realName,
      avatarURL: avatarURL.value?.valueOf(),
    });
  };

  /**
   * @description 重置密碼成功時觸發
   */
  const handleResetPasswordSuccess = () => {
    useMessage().createMessage.success({ content: '重置密碼成功' });
  };

  onMounted(() => {
    getEmployeeInfo();
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-employee-detail';

  .@{prefix-cls} {
    &__img {
      width: 40px;
      border-radius: 50%;
    }
  }
</style>
