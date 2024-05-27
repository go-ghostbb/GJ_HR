<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { Dropdown, DropMenu } from '@/components/Dropdown';
  import Icon from '@/components/Icon/Icon.vue';
  import { useAppStore } from '@/store/modules/app';
  import { GetApiUrlList } from '@/wailsjs/go/service/systemService';
  import type { ApiAddress } from '#/store';
  import { useLoading } from '@/components/Loading';
  import { health } from '@/api/sys/base';
  import { useMessage } from '@/hooks/web/useMessage';

  const props = defineProps({
    /**
     * Whether to display text
     */
    showText: { type: Boolean, default: true },
    /**
     * Whether to refresh the interface when changing
     */
    reload: { type: Boolean },
  });

  const appStore = useAppStore();

  const apiList = ref<DropMenu[]>([]);

  const selectedKeys = ref<string[]>([]);

  const [openFullLoading, closeFullLoading] = useLoading({
    tip: '測試連線中...',
  });

  const getLocaleText = computed(() => {
    const key = selectedKeys.value[0];
    if (!key) {
      return '';
    }
    return apiList.value.find((item) => item.event === key)?.text;
  });

  async function handleMenuEvent(menu: DropMenu) {
    openFullLoading();

    try {
      const apiRes: { key: string; val: string } = JSON.parse(menu.event as string);

      //-連線測試
      await health(apiRes.val);

      appStore.setApiAddress({
        key: apiRes.key,
        val: apiRes.val,
      });
      if (props.reload) {
        location.reload();
      }
    } finally {
      closeFullLoading();
    }
  }

  function findSelectedKeys() {
    selectedKeys.value = [
      apiList.value.find((item) => {
        const { val = '' } = appStore.getApiAddress as ApiAddress;
        const data: { key: string; val: string } = JSON.parse(item.event as string);
        return data.val === val;
      })?.event as string,
    ];
  }

  onMounted(async () => {
    const result = await GetApiUrlList();
    if (result.success) {
      const data: { key: string; val: string }[] = result.data;
      const temp: DropMenu[] = [];
      data.forEach((item) => {
        temp.push({
          event: JSON.stringify(item),
          text: `${item.key} - ${item.val}`,
        });
      });
      apiList.value = temp;
      findSelectedKeys();
    }
  });
</script>

<template>
  <Dropdown
    placement="bottom"
    :trigger="['click']"
    :dropMenuList="apiList"
    :selectedKeys="selectedKeys"
    @menu-event="handleMenuEvent"
    overlayClassName="app-api-picker-overlay"
  >
    <span class="cursor-pointer flex items-center">
      <Icon icon="ant-design:api-outlined" />
      <span v-if="showText" class="ml-1">{{ getLocaleText }}</span>
    </span>
  </Dropdown>
</template>

<style lang="less">
  .app-api-picker-overlay {
    .ant-dropdown-menu-item {
      min-width: 300px;
    }
  }
</style>
