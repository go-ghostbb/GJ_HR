<template>
  <div :class="prefixCls">
    <div class="flex justify-between">
      <div class="body">
        <div class="title flex justify-between">
          <div>遞延</div>
          <div>
            <Switch v-model:checked="state.deferrable" @change="btnStatus(true)" />
          </div>
        </div>

        <div class="depiction">
          <p> 功能開啟後，將限制遞延至下周期之休假天數。超過上限之天數將於下一周期開始時歸零。 </p>
          <p>您亦可替遞延天數設定到期日</p>
        </div>

        <div class="dayInput">
          <span class="required">最大天數</span>
          <Input
            v-model:value="state.deferrableDays"
            :status="state.status.deferrableDays"
            :disabled="!state.deferrable"
            suffix="天"
            @change="validateDeferrableDays"
          />
        </div>

        <div class="duration">
          <Checkbox
            v-model:checked="state.customizableDuration"
            :disabled="!state.deferrable"
            @change="btnStatus(true)"
          >
            <span>遞延到期</span>
          </Checkbox>
          <div class="durationInput" style="display: flex; flex-direction: row">
            <Divider type="vertical" />
            <div>
              <div class="mb-1">
                <span class="required">週期重設後多久到期</span>
                <Select
                  v-model:value="state.duration"
                  :options="getOptions()"
                  :disabled="!state.deferrable || !state.customizableDuration"
                  :status="state.status.duration"
                  style="width: 100%"
                  placeholder="請選擇"
                  @change="validateDuration"
                />
              </div>
              <span class="depiction">若週期比到期日短，有可能會提前到期</span>
            </div>
          </div>
        </div>
      </div>
      <div class="body-btn">
        <Button :disabled="disabledBtn" @click="loadOriginData">取消</Button>
        <Button class="ml-2 mr-2" type="primary" :disabled="disabledBtn" @click="handleSave"
          >儲存</Button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { LeaveModel } from '@/api/setting/model/leaveModel';
  import { useDesign } from '@/hooks/web/useDesign';
  import { reactive, ref, onMounted } from 'vue';
  import { Button, Select, Checkbox, Divider, Input, Switch } from 'ant-design-vue';
  import { updateLeave } from '@/api/setting/leave';

  const { prefixCls } = useDesign('leave-advanced-deferred');

  const emit = defineEmits(['loading', 'success']);

  export interface Props {
    leave: LeaveModel;
  }

  interface defer {
    deferrable?: boolean;
    deferrableDays?: number;
    customizableDuration?: boolean;
    duration?: number;
    status: status;
  }

  interface status {
    deferrableDays: '' | 'error' | 'warning' | undefined;
    duration: '' | 'error' | 'warning' | undefined;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const state = reactive<defer>({
    status: {
      deferrableDays: '',
      duration: '',
    },
  });

  //-是否關閉按鈕
  const disabledBtn = ref(true);

  /**
   * @description 最大天數輸入框更改時觸發
   */
  const validateDeferrableDays = () => {
    btnStatus(true);

    // 0會被下面的轉字串改掉
    // 暴力破解, 直接提前出去
    if (state.deferrableDays === 0) {
      state.status.deferrableDays = '';
      return;
    }

    // 不能為空和只能是正整數
    if (!state.deferrableDays || state.deferrableDays.toString().replace(/[^\d]/g, '') === '') {
      state.deferrableDays = 0;
      state.status.deferrableDays = 'error';
      return;
    } else {
      state.deferrableDays = Number(state.deferrableDays.toString().replace(/[^\d]/g, ''));
      state.status.deferrableDays = '';
    }
  };

  /**
   * @description 設定週期更改時觸發
   * @param e
   */
  const validateDuration = () => {
    btnStatus(true);
    if (state.duration || !state.customizableDuration) {
      state.status.duration = '';
    } else {
      state.status.duration = 'error';
    }
  };

  /**
   * @description 是否開啟儲存按鈕
   * @param enable 開啟, 關閉
   */
  const btnStatus = (enable: boolean) => {
    disabledBtn.value = !enable;
  };

  /**
   * @description 獲取選取時間option
   */
  const getOptions = () => {
    const options: { value: number; label: string }[] = [];
    for (let i = 1; i <= 42; i++) {
      if (i < 12) {
        options.push({
          value: i, // i 個月
          label: `${i}個月`,
        });
      } else if (i > 12) {
        options.push({
          value: (i - 12) * 12, // 單位是月, 進行換算
          label: `${i - 12}年`,
        });
      }
    }
    return options;
  };

  /**
   * @description 載入props資料
   */
  const loadOriginData = () => {
    state.deferrable = props.leave.deferrable;
    state.deferrableDays = props.leave.deferrableDays;
    state.customizableDuration = props.leave.customizableDuration;
    state.duration = props.leave.duration;
    if (state.duration === 0) {
      state.duration = undefined;
    }
    btnStatus(false);
  };

  /**
   * @description 儲存
   */
  const handleSave = async () => {
    emit('loading', true);
    try {
      if (validator()) {
        //-如果通過驗證
        const leave: LeaveModel = props.leave;
        //-放入資料
        leave.deferrable = state.deferrable;
        leave.deferrableDays = state.deferrableDays;
        leave.customizableDuration = state.customizableDuration;
        leave.duration = state.duration;
        //-api
        await updateLeave(leave.ID, leave);
        //-回傳結果到父組建, 更新table資料
        emit('success', leave);
        btnStatus(false);
      }
    } finally {
      emit('loading', false);
    }
  };

  /**
   * @description 驗證表單
   */
  const validator = (): boolean => {
    validateDeferrableDays();
    validateDuration();
    if (state.status.deferrableDays === 'error' || state.status.duration === 'error') {
      return false;
    }
    return true;
  };

  onMounted(() => {
    loadOriginData();
  });
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-leave-advanced-deferred';
  .@{prefix-cls} {
    margin: 8px 0 0 12px;
    font-weight: bold;

    .required::before {
      content: '*';
      display: inline-block;
      margin-inline-end: 4px;
      color: #ed6f6f;
      font-family: SimSun, sans-serif;
      font-size: 14px;
      line-height: 1;
    }

    .body {
      // border: black 1px solid;
      width: 55%;
    }

    .depiction {
      margin-top: 12px;
      color: @text-color-help-dark;
      font-size: 12px;
    }

    .dayInput {
      width: 80%;
      margin-top: 10px;
      font-size: 14px;

      span:is(.ant-input-affix-wrapper) {
        color: @text-color-help-dark;
      }
    }

    .duration {
      margin-top: 14px;
      font-size: 12px;

      .durationInput {
        margin-top: 12px;

        .ant-divider {
          width: 4px;
          height: auto;
          margin-right: 20px;
          margin-left: 0;
          background-color: @border-color-base;
        }
      }
    }
  }
</style>
