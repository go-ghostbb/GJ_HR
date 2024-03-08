<template>
  <div v-loading="loading" :class="prefixCls">
    <div :class="`${prefixCls}-head`"> 進階設定 </div>
    <div :class="`${prefixCls}-body`">
      <DeferedSetting :leave="props.leave" @loading="setLoading" @success="handleSuccess" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { LeaveModel } from '@/api/setting/model/leaveModel';
  import { useDesign } from '@/hooks/web/useDesign';
  import DeferedSetting from './DeferedSetting.vue';
  import { ref } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';

  export interface Props {
    leave: LeaveModel;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const emit = defineEmits(['success']);

  const { prefixCls } = useDesign('leave-advanced-card');

  const loading = ref(false);

  /**
   * @description 設定loading狀態
   * @param state
   */
  const setLoading = (state: boolean) => {
    loading.value = state;
  };

  /**
   * @description 回傳leave
   */
  const handleSuccess = (leave: LeaveModel) => {
    emit('success', leave);
    useMessage().createMessage.success({ content: '設定成功' });
  };
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-leave-advanced-card';

  .@{prefix-cls} {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: auto;
    margin: 0 0 0 8px;
    padding: 0;
    border: @border-color-base 1px solid;
    border-radius: 8px;
    background-color: @component-background;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji';
    font-size: 14px;

    &-head {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 38px;
      margin-bottom: -1px;
      padding: 0 12px;
      // border-bottom: 1px solid @border-color-base;
      border-radius: 8px 8px 0 0;
      background: transparent;
      color: @text-color-base;
      font-size: 16px;
      font-weight: 600;
    }

    &-body {
      box-sizing: border-box;
      padding: 6px 0;
      border-radius: 0 0 8px 8px;
      font-size: 14px;
    }
  }
</style>
