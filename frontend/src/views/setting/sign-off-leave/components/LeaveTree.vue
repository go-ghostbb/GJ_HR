<template>
  <div class="m-4 mr-0 overflow-hidden bg-white w-1/4 xl:w-1/5">
    <BasicTree
      v-model:selectedKeys="leaveId"
      title="假別列表"
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
  import { getLeaveByKeyword } from '@/api/setting/leave';

  defineOptions({
    name: 'LeaveTree',
    inheritAttrs: false,
  });

  const emit = defineEmits(['select']);
  const treeData = ref<TreeItem[]>([]);
  const leaveId = ref<number[]>();

  const fetch = async () => {
    const leaveData = await getLeaveByKeyword();
    treeData.value = leaveData.items as unknown as TreeItem[];
  };

  /**
   * @description 點擊時事件
   * @param keys
   */
  const handleSelect = (keys: any) => {
    emit('select', keys[0]);
  };

  /**
   * @description reset
   */
  const reset = () => {
    leaveId.value = undefined;
    emit('select', undefined);
  };

  defineExpose({ reset });

  onMounted(() => {
    fetch();
  });
</script>
