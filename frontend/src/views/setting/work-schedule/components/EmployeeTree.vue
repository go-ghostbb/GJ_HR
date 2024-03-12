<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="員工列表"
      toolbar
      :disabled="props.setting"
      search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ key: 'ID', title: 'realName' }"
      :loading="loading"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTree, TreeItem } from '@/components/Tree';
  import { getEmployeeByKeyword } from '@/api/manager/employee';

  const emit = defineEmits(['select']);
  const treeData = ref<TreeItem[]>([]);
  const loading = ref(false);

  export interface Props {
    setting: boolean;
  }

  const props = withDefaults(defineProps<Props>(), { setting: false });

  const fetch = async (departmentId: number) => {
    loading.value = true;
    const employees = await getEmployeeByKeyword({ departmentId: departmentId });
    treeData.value = employees.items as unknown as TreeItem[];
    loading.value = false;
  };

  /**
   * @description 點擊時事件
   * @param keys
   */
  const handleSelect = (keys: any) => {
    emit('select', keys[0]);
  };

  defineExpose({ fetch });
</script>
