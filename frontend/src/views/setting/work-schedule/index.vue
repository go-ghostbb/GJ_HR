<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <!-- 部門列表 -->
    <DepartmentTree class="w-1/4 xl:w-1/5" :setting="isSetting" @select="deptSelect" />

    <!-- 員工列表 -->
    <SlideXTransition>
      <EmployeeTree
        v-show="departmentId"
        ref="employeeTreeRef"
        class="w-1/4 xl:w-1/5"
        :setting="isSetting"
        @select="employeeSelect"
      />
    </SlideXTransition>

    <!-- setting -->
    <SlideXTransition>
      <Setting
        v-show="departmentId && employeeId"
        ref="settingRef"
        class="w-2/4 xl:w-55%"
        @setting="setSetting"
      />
    </SlideXTransition>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import DepartmentTree from './components/DepartmentTree.vue';
  import EmployeeTree from './components/EmployeeTree.vue';
  import Setting from './components/Setting.vue';
  import { PageWrapper } from '@/components/Page';
  import { SlideXTransition } from '@/components/Transition';

  defineOptions({
    name: 'WorkScheduleSetting',
    inheritAttrs: false,
  });

  //-當前選擇的部門ID
  const departmentId = ref<number>();

  //-當前選擇的員工ID
  const employeeId = ref<number>();

  //-employeeTree ref
  const employeeTreeRef = ref();

  //-setting ref
  const settingRef = ref();

  //-是否在設定中
  const isSetting = ref(false);

  /**
   * @description 部門樹點擊選中時觸發
   * @param deptId department id
   */
  const deptSelect = (deptId?: number) => {
    departmentId.value = undefined;
    if (deptId && deptId !== 0) {
      setTimeout(() => {
        departmentId.value = deptId;
        employeeTreeRef.value.fetch(departmentId.value);
      }, 300);
    }
  };

  /**
   * @description 員工樹點擊選中時觸發
   * @param empId employee id
   */
  const employeeSelect = (empId?: number) => {
    employeeId.value = undefined;
    if (empId && empId !== 0) {
      setTimeout(() => {
        employeeId.value = empId;
        settingRef.value.loadDate(empId);
      }, 300);
    }
  };

  /**
   * @description 設定
   * @param status
   */
  const setSetting = (status: boolean) => {
    isSetting.value = status;
  };
</script>
