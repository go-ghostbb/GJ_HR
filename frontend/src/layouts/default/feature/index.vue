<template>
  <LayoutLockPage />
  <SettingDrawer
    v-if="getIsFixedSettingDrawer && (!getShowMultipleTab || getFullContent)"
    :class="prefixCls"
  />>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';

  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useDesign } from '@/hooks/web/useDesign';

  import { SettingButtonPositionEnum } from '@/enums/appEnum';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';

  defineOptions({ name: 'LayoutFeatures' });

  const LayoutLockPage = createAsyncComponent(() => import('@/views/sys/lock/index.vue'));
  const SettingDrawer = createAsyncComponent(() => import('@/layouts/default/setting/index.vue'));

  const { getShowSettingButton, getSettingButtonPosition, getFullContent } = useRootSetting();
  const { prefixCls } = useDesign('setting-drawer-feature');
  const { getShowHeader } = useHeaderSetting();

  const getIsFixedSettingDrawer = computed(() => {
    if (!unref(getShowSettingButton)) {
      return false;
    }
    const settingButtonPosition = unref(getSettingButtonPosition);

    if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
      return !unref(getShowHeader) || unref(getFullContent);
    }
    return settingButtonPosition === SettingButtonPositionEnum.FIXED;
  });

  const { getShowMultipleTab } = useMultipleTabSetting();
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-setting-drawer-feature';

  .@{prefix-cls} {
    display: flex;
    position: absolute;
    z-index: 10;
    top: 45%;
    right: 0;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 6px 0 0 6px;
    background-color: @primary-color;
    color: @white;
    cursor: pointer;

    svg {
      width: 1em;
      height: 1em;
    }
  }
</style>
