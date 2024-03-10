<template>
  <AInput
    v-model:value="currentSelect"
    :placeholder="placeholder"
    :class="prefixCls"
    :style="disabled ? { cursor: 'not-allowed', width } : { cursor: 'pointer', width }"
    :disabled="disabled"
    :size="size"
    :readonly="readonly"
    @click="triggerPopover"
  >
    <template v-if="allowClear" #suffix>
      <Icon icon="ant-design:close-circle-filled" style="font-size: 14px" @click="clear" />
    </template>
    <template #addonBefore>
      <Popover
        placement="bottomLeft"
        trigger="click"
        v-model="visible"
        :overlayClassName="`${prefixCls}-popover`"
      >
        <template #content>
          <ColorPanel
            ref="colorPanelRef"
            v-model="currentSelect"
            @ok="triggerPopover"
            @cancel="triggerPopover"
          />
        </template>
        <div ref="trigger" style="width: 100%; height: 100%">
          <div
            style="width: 8px; height: 8px; border-radius: 50%"
            :style="{ 'background-color': currentSelect }"
          ></div>
        </div>
      </Popover>
    </template>
  </AInput>
</template>

<script lang="ts" setup>
  import { Input, Popover } from 'ant-design-vue';
  import ColorPanel from './ColorPanel.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { ref, watch, watchEffect } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { SizeType } from 'ant-design-vue/es/config-provider';

  const AInput = Input;

  const emit = defineEmits(['update:value', 'change']);

  const { prefixCls } = useDesign('color-picker');

  const currentSelect = ref('');
  const visible = ref(true);
  const trigger = ref<HTMLDivElement>();
  const colorPanelRef = ref<any>();

  export interface Props {
    value?: string;
    width?: string;
    disabled?: boolean;
    allowClear?: boolean;
    placeholder?: string | number;
    size?: SizeType;
    readonly?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    value: '',
    width: '100%',
  });

  const clear = () => {
    currentSelect.value = '';
  };

  const triggerPopover = () => {
    if (trigger.value) {
      trigger.value.click();
      colorPanelRef.value?.reset();
    }
  };

  watchEffect(() => {
    currentSelect.value = props.value;
  });

  watch(
    () => currentSelect.value,
    (v) => {
      emit('update:value', v);
      emit('change', v);
    },
  );
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-color-picker';

  .@{prefix-cls} {
    .ant-input {
      cursor: pointer;
    }

    .ant-input-suffix {
      //color: #bfbfbf;

      .app-iconify {
        margin: 0;
        transition: color 0.3s;
        color: rgb(0 0 0 / 25%);
        cursor: pointer;
      }

      .app-iconify:hover {
        transition: color 0.3s;
        //color: #bfbfbf;
        color: rgb(0 0 0 / 50%);
      }
    }
  }
</style>
