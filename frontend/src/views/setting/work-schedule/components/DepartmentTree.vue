<template>
  <div class="m-4 mr-0 overflow-hidden bg-white w-1/4 xl:w-1/5">
    <BasicTree
      title="部門列表"
      :disabled="props.setting"
      toolbar
      search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ key: 'ID', title: 'name' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { BasicTree, TreeItem } from '@/components/Tree';
  import { getDepartmentByKeyword } from '@/api/manager/department';

  defineOptions({
    name: 'DepartmentTree',
    inheritAttrs: false,
  });

  export interface Props {
    setting: boolean;
  }

  const props = withDefaults(defineProps<Props>(), { setting: false });

  const emit = defineEmits(['select']);
  const treeData = ref<TreeItem[]>([]);

  const fetch = async () => {
    treeData.value = (await getDepartmentByKeyword()) as unknown as TreeItem[];
  };

  /**
   * @description 點擊時事件
   * @param keys
   */
  const handleSelect = (keys: any) => {
    emit('select', keys[0]);
  };

  onMounted(() => {
    fetch();
  });
</script>
