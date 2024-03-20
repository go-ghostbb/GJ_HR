<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <!-- 部門列表 -->
    <DepartmentTree class="w-1/4 xl:w-1/5" @select="deptSelect" />

    <!-- 假別列表 -->
    <SlideXTransition>
      <VacationTree
        v-show="departmentId"
        ref="vacationTreeRef"
        class="w-1/4 xl:w-1/5"
        @select="vacationSelet"
      />
    </SlideXTransition>

    <!-- 設定 -->
    <SlideXTransition>
      <Setting
        v-show="departmentId && (vacationId || vacationId === 0)"
        ref="settingRef"
        class="w-2/4 xl:w-55%"
        :vacationId="vacationId"
        :departmentId="departmentId"
      />
    </SlideXTransition>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import DepartmentTree from './components/DepartmentTree.vue';
  import VacationTree from './components/VacationTree.vue';
  import Setting from './components/Setting.vue';
  import { PageWrapper } from '@/components/Page';
  import { SlideXTransition } from '@/components/Transition';

  defineOptions({
    name: 'SignOffOvertimeSetting',
    inheritAttrs: false,
  });

  //-department id
  const departmentId = ref<number>();

  //-vacation id
  const vacationId = ref<number>();

  //-vacationTree ref
  const vacationTreeRef = ref();

  //-setting ref
  const settingRef = ref();

  /**
   * @description 部門樹點擊選中時觸發
   * @param deptId department id
   */
  const deptSelect = (deptId?: number) => {
    departmentId.value = undefined;
    vacationTreeRef.value.reset();
    if (deptId && deptId !== 0) {
      setTimeout(() => {
        departmentId.value = deptId;
      }, 300);
    }
  };

  /**
   * @description 休假日樹點擊選中時觸發
   * @param lId vacation id
   */
  const vacationSelet = (vId?: number) => {
    vacationId.value = undefined;
    if (vId || vId === 0) {
      setTimeout(() => {
        vacationId.value = vId;
      }, 300);
    }
  };
</script>
