<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <!-- 部門列表 -->
    <DepartmentTree class="w-1/4 xl:w-1/5" @select="deptSelect" />

    <!-- 假別列表 -->
    <SlideXTransition>
      <LeaveTree
        v-show="departmentId"
        ref="leaveTreeRef"
        class="w-1/4 xl:w-1/5"
        @select="leaveSelet"
      />
    </SlideXTransition>

    <!-- 設定 -->
    <SlideXTransition>
      <Setting
        v-show="departmentId && leaveId"
        ref="settingRef"
        class="w-2/4 xl:w-55%"
        :leaveId="leaveId"
        :departmentId="departmentId"
      />
    </SlideXTransition>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import DepartmentTree from './components/DepartmentTree.vue';
  import LeaveTree from './components/LeaveTree.vue';
  import Setting from './components/Setting.vue';
  import { PageWrapper } from '@/components/Page';
  import { SlideXTransition } from '@/components/Transition';

  defineOptions({
    name: 'SignOffLeaveSetting',
    inheritAttrs: false,
  });

  //-department id
  const departmentId = ref<number>();

  //-leave id
  const leaveId = ref<number>();

  //-leaveTree ref
  const leaveTreeRef = ref();

  //-setting ref
  const settingRef = ref();

  /**
   * @description 部門樹點擊選中時觸發
   * @param deptId department id
   */
  const deptSelect = (deptId?: number) => {
    departmentId.value = undefined;
    leaveTreeRef.value.reset();
    if (deptId && deptId !== 0) {
      setTimeout(() => {
        departmentId.value = deptId;
      }, 300);
    }
  };

  /**
   * @description 假別樹點擊選中時觸發
   * @param lId leave id
   */
  const leaveSelet = (lId?: number) => {
    leaveId.value = undefined;
    if (lId && lId !== 0) {
      setTimeout(() => {
        leaveId.value = lId;
      }, 300);
    }
  };
</script>
