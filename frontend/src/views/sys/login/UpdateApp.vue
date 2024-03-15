<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <div v-show="getShow" class="enter-x" style="width: 350px">
    <span>{{ `${props.oldVersion} -> ${props.newVersion}` }}</span>
    <br />
    <br />

    <div class="mt-4">
      <!--內容-->
      <div class="justify-between flex enter-x">
        <div>
          <span>Progress :</span>
        </div>
        <div v-if="!done" class="mr-9 enter-x">
          <!--開始按鈕-->
          <Tooltip v-if="!start && !loading" :class="`${prefixCls}-action__item`" title="start">
            <span @click="handleStart">
              <Icon icon="ion:play-outline" color="green" />
            </span>
          </Tooltip>
          <!--loading-->
          <Tooltip v-if="loading" :class="`${prefixCls}-action__item`" title="loading">
            <span class="loader"> </span>
          </Tooltip>
          <!--暫停按鈕-->
          <Tooltip v-if="start && !loading" :class="`${prefixCls}-action__item`" title="pause">
            <span @click="handlePause">
              <Icon icon="ion:pause-outline" color="red" />
            </span>
          </Tooltip>
          <!--停止按鈕-->
          <Tooltip
            v-if="percentage !== 0 && !loading"
            :class="`${prefixCls}-action__item`"
            title="stop"
          >
            <span @click="handleStop">
              <Icon icon="ion:stop-outline" color="gray" />
            </span>
          </Tooltip>
        </div>
      </div>

      <Progress :size="15" :percent="percentage" />
      <!--更新資訊-->
      <div style="height: 80px">
        <div v-if="showInfo">
          <span>
            {{ downloadInfo }}
          </span>
        </div>
      </div>
    </div>

    <div>
      <Button v-if="done" class="mt-2" type="primary" block @click="handleDone">
        Done (will shut down the system)
      </Button>
      <Button
        v-else
        class="mt-2"
        :disabled="start || percentage !== 0"
        block
        @click="setLoginState(LoginStateEnum.LOGIN)"
      >
        Back
      </Button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import LoginFormTitle from './LoginFormTitle.vue';
  import { computed, ref, unref } from 'vue';
  import { LoginStateEnum, useLoginState } from '@/views/sys/login/useLogin';
  import { Button, Tooltip, Progress } from 'ant-design-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { EventsOff, EventsOn, Quit } from '@/wailsjs/runtime';
  import Icon from '@/components/Icon/Icon.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { DoUpdate, Pause, Stop } from '@/wailsjs/go/service/updateService';

  export interface Props {
    newVersion?: string;
    oldVersion?: string;
  }

  interface humanizeBytes {
    size: string;
    suffix: string;
  }

  interface result {
    percentage: number;
    now: humanizeBytes;
    max: humanizeBytes;
    speed: humanizeBytes;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const percentage = ref(0);
  const downloadInfo = ref<string>('');
  const start = ref(false);
  const done = ref(false);
  const stop = ref(false);
  const loading = ref(false);
  const showInfo = ref(false);

  const { prefixCls } = useDesign('update-app');
  const { getLoginState, setLoginState } = useLoginState();
  const { createMessage, createErrorModal } = useMessage();
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.UPDATE_APP);

  const handleStart = async () => {
    if (props.newVersion !== props.oldVersion) {
      start.value = true;
      stop.value = true;
      showInfo.value = true;
      loading.value = true;

      // 開啟更新監聽事件
      EventsOn('updateProgress', (data: result) => {
        loading.value = false;
        percentage.value = data.percentage;
        downloadInfo.value = `${data.now.size}${data.now.suffix}/${data.max.size}${data.max.suffix} (Speed : ${data.speed.size}${data.speed.suffix}/s)`;
      });

      const resp = await DoUpdate();
      if (!resp.success) {
        if (!(resp.msg === 'http2: response body closed')) {
          createErrorModal({
            title: 'Update failed',
            content: 'error message:' + resp.msg,
            onOk: () => {
              start.value = false;
            },
          });
        }
      } else {
        done.value = true;
      }
    } else {
      createMessage.error({ content: 'Unable to update' });
    }
  };

  const handleDone = () => {
    Quit();
  };

  const handlePause = async () => {
    if (percentage.value === 0) {
      return;
    }
    await Pause();
    start.value = false;
  };

  const handleStop = async () => {
    await Stop();
    EventsOff('updateProgress');
    percentage.value = 0;
    start.value = false;
    showInfo.value = false;
    downloadInfo.value = '';
  };
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-update-app';

  .@{prefix-cls}-action {
    &__item {
      @keyframes rotation {
        0% {
          transform: rotate(0deg);
        }

        100% {
          transform: rotate(360deg);
        }
      }

      cursor: pointer;

      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      &.loader {
        display: inline-block;
        box-sizing: border-box;
        width: 12px;
        height: 12px;
        animation: rotation 1s linear infinite;
        border-top: 3px solid#0b79ee;
        border-right: 3px solid transparent;
        border-radius: 50%;
        cursor: default;

        &:hover {
          background-color: @app-content-background;
        }
      }
    }
  }
</style>
