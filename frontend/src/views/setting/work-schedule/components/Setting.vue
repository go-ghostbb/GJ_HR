<template>
  <div v-loading="loading" class="m-4 p-2 overflow-hidden bg-white">
    <Calendar
      v-model:value="calenderValue"
      @panel-change="onPanelChange"
      @select="onSelect"
      :class="`${prefixCls}-calendar`"
      :fullscreen="false"
      :disabled-date="onDisabledDate"
    >
      <!-- header -->
      <template #headerRender="{ value: current, onChange }">
        <Row justify="space-between">
          <Col>
            <!-- 班表設定文字 -->
            <span v-if="!isSetting" class="ml-4">
              <b> {{ '班表設定' }} </b>
            </span>
            <!-- 班表設定文字 -->
            <span v-if="isSetting" class="ml-4">
              <b> {{ '設定模式' }} </b>
            </span>

            <!-- 年月設定 -->
            <template v-if="!isSetting">
              <!-- 往前一個月 -->
              <Button
                class="ml-2 mr-2"
                type="text"
                shape="circle"
                @click="onChange(current.month(parseInt(String(current.month() - 1), 10)))"
              >
                <Icon icon="ion:chevron-back-outline" />
              </Button>

              <!-- 年下拉式選單 -->
              <Select
                size="small"
                :dropdown-match-select-width="false"
                :value="String(current.year())"
                @change="
                  (newYear) => {
                    onChange(current.year(+newYear!));
                  }
                "
              >
                <SelectOption v-for="val in getYears(current)" :key="String(val)">
                  {{ val }}
                </SelectOption>
              </Select>

              <!-- 月下拉式選單 -->
              <Select
                size="small"
                :dropdown-match-select-width="false"
                class="ml-3"
                :value="String(current.month())"
                @change="
                  (selectedMonth) => {
                    onChange(current.month(parseInt(String(selectedMonth), 10)));
                  }
                "
              >
                <SelectOption
                  v-for="(val, index) in dayjs().localeData().monthsShort()"
                  :key="String(index)"
                >
                  {{ val }}
                </SelectOption>
              </Select>

              <!-- 往後一個月 -->
              <Button
                class="ml-4 mr-5"
                type="text"
                shape="circle"
                @click="onChange(current.month(parseInt(String(current.month() + 1), 10)))"
              >
                <Icon icon="ion:chevron-forward-outline" />
              </Button>
            </template>
          </Col>

          <Col>
            <!-- 非設定模式下 -->
            <Button v-if="!isSetting" class="mr-1 mt-1" size="small" @click="clickCopy()">
              {{ '複製' }}
            </Button>
            <Button v-if="!isSetting" class="mr-1 mt-1" size="small" @click="clickSetting(current)">
              {{ '設定' }}
            </Button>

            <!-- 設定模式下 -->
            <Select
              v-if="isSetting"
              class="mr-4 mb-1"
              size="small"
              :options="workShiftOptions"
              @change="workShiftSelectChange"
              style="width: 100px"
            />
            <Button v-if="isSetting" class="mr-1 mt-1" size="small" @click="handleSave">
              {{ '儲存' }}
            </Button>
            <Button v-if="isSetting" class="mr-1 mt-1" size="small" @click="handleCancel">
              {{ '取消' }}
            </Button>
          </Col>
        </Row>
      </template>

      <!-- cell -->
      <template #dateCellRender="{ current }">
        <ul class="events">
          <li v-for="item in getCellData(current)" :key="item.text">
            <Badge :class="`${prefixCls}-badge`" :color="item.color" :text="item.text" />
          </li>
        </ul>
      </template>
    </Calendar>

    <CopyModal @register="registerCopyModal" />
    <DetailModal ref="detailModalRef" @register="registerDetailModal" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { useDesign } from '@/hooks/web/useDesign';
  import { Badge, Button, Calendar, Col, Row, Select, SelectOption } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import Icon from '@/components/Icon/Icon.vue';
  import { ref, onMounted } from 'vue';
  import { WorkScheduleModel, WorkShiftModel } from '@/api/setting/model/workShiftModel';
  import {
    getWorkScheduleByDate,
    getWorkShiftByKeyword,
    updateWorkScheduleBatch,
  } from '@/api/setting/workShift';
  import { CalendarMode } from 'ant-design-vue/es/calendar/generateCalendar';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import CopyModal from './CopyModal.vue';
  import { useModal } from '@/components/Modal';
  import DetailModal from './DetailModal.vue';

  const { prefixCls } = useDesign('work-schedule-setting-modal');

  const emit = defineEmits(['setting']);

  //-CopyModal註冊
  const [registerCopyModal, copyMethod] = useModal();

  //-DetailModal註冊
  const [registerDetailModal, detailMethod] = useModal();

  //-loading
  const loading = ref(false);

  //-detail modal ref
  const detailModalRef = ref();

  //-班別下拉式選單
  const workShiftOptions = ref<{ label: string; value: string }[]>([]);

  //-選中的班別
  const workShiftSelect = ref<WorkShiftModel>();

  //-是否在設定中
  const isSetting = ref(false);

  //-紀錄設定的當前月份，為了鎖住不讓使用者去設定其他月份
  const editMonth = ref(0);

  //-calender value
  const calenderValue = ref<Dayjs>(dayjs());

  //-schedule資料儲存
  const scheduleData = ref<WorkScheduleModel[]>([]);

  //-暫存資料, 取消時資料恢復用
  const cacheScheduleData = ref<WorkScheduleModel[]>([]);

  //-員工ID
  const employeeId = ref<number>(0);

  /**
   * @description 獲取前後10年下拉式選單
   * @param value
   */
  const getYears = (value: Dayjs) => {
    const year = value.year();
    const years: number[] = [];
    for (let i = year - 10; i < year + 10; i += 1) {
      years.push(i);
    }
    return years;
  };

  /**
   * @description 獲取設定模式下可選框
   * @param currentDate
   */
  const onDisabledDate = (currentDate: Dayjs) => {
    return currentDate.month() + 1 !== editMonth.value && isSetting.value;
  };

  /**
   * @description 當面板發生變化時
   * @param date
   * @param _mode
   */
  const onPanelChange = (date: string | Dayjs, _mode: CalendarMode) => {
    if (typeof date !== 'string') {
      fetch(date);
    }
  };

  /**
   * @description 當面板被選中時
   * @param date
   * @param info
   */
  const onSelect = (date: Dayjs, info: { source: 'year' | 'month' | 'date' | 'customize' }) => {
    if (info.source === 'date' && employeeId.value != 0) {
      if (isSetting.value) {
        //-設定模式下
        onSelectIsSetting(date);
      } else {
        //-不是設定模式下
        onSelectIsNotSetting(date);
      }
    }
  };

  /**
   * @description 不在設定模式下面板被選擇時
   * @param date
   */
  const onSelectIsNotSetting = (date: Dayjs) => {
    const temp = cloneDeep(scheduleData.value);
    const thisDay: WorkScheduleModel[] = [];

    //-找出date的schedule
    temp.forEach((schedule, _index) => {
      const scheduleDay = dayjs(schedule.scheduleDate);
      if (
        scheduleDay.year() === date.year() &&
        scheduleDay.month() === date.month() &&
        scheduleDay.date() === date.date() &&
        schedule.workShift
      ) {
        thisDay.push(schedule);
      }
    });

    //-打開detail modal
    detailMethod.openModal(true, { date, schedule: thisDay });
  };

  /**
   * @description 在設定模式下面板被選擇時
   * @param date
   */
  const onSelectIsSetting = (date: Dayjs) => {
    let exist = false;
    let existIndex = 0;
    const temp = cloneDeep(scheduleData.value);
    const thisDay: WorkScheduleModel[] = [];
    // let totalHours = 0;
    //-判斷date裡是否已存在以選擇的work shift
    temp.forEach((schedule, index) => {
      const scheduleDay = dayjs(schedule.scheduleDate);
      if (
        scheduleDay.year() === date.year() &&
        scheduleDay.month() === date.month() &&
        scheduleDay.date() === date.date() &&
        schedule.workShift
      ) {
        if (schedule.workShift!.ID === workShiftSelect.value?.ID) {
          exist = true;
          existIndex = index;
          return;
        }
        thisDay.push(schedule);
        // totalHours += schedule.workShift.totalHours!;
      }
    });

    if (exist) {
      //-如果存在, 刪除
      temp.splice(existIndex, 1);
      scheduleData.value = temp;
    } else {
      //-如果不存在, 新增
      // 判斷時間重疊
      if (overlap(thisDay)) {
        useMessage().createMessage.error({ content: '時間重疊' });
        return;
      }
      // 判斷是否超過8小時
      // if (totalHours + workShiftSelect.value!.totalHours! > 8) {
      //   useMessage().createMessage.error({ content: '超過8小時' });
      //   return;
      // }
      temp.push({
        ID: 0,
        scheduleDate: date.format('YYYY-MM-DD'),
        employeeId: employeeId.value,
        workShiftId: workShiftSelect.value?.ID,
        workShift: workShiftSelect.value,
      });
      scheduleData.value = temp;
    }
  };

  /**
   * @description 判斷時間是否有重疊
   * @param schedules
   */
  const overlap = (schedules: WorkScheduleModel[]): boolean => {
    let result = false;
    schedules.forEach((schedule) => {
      if (
        schedule.workShift!.workStart! < workShiftSelect.value!.workEnd! &&
        workShiftSelect.value!.workStart! < schedule.workShift!.workEnd!
      ) {
        result = true;
      }
    });
    return result;
  };

  /**
   * @description save
   */
  const handleSave = async () => {
    try {
      loading.value = true;
      await updateWorkScheduleBatch(
        employeeId.value,
        calenderValue.value.format('YYYY-MM'),
        formatScheduleData(calenderValue.value, scheduleData.value),
      );
      useMessage().createMessage.success({ content: '儲存成功' });
    } finally {
      setSetting(false);
      loading.value = false;
      await fetch(calenderValue.value);
    }
  };

  /**
   * @description 只獲取當月資料
   * @param date
   * @param schedule
   */
  const formatScheduleData = (date: Dayjs, schedule: WorkScheduleModel[]): WorkScheduleModel[] => {
    const result: WorkScheduleModel[] = [];
    schedule.forEach((s) => {
      const scheduleDate = dayjs(s.scheduleDate);
      if (scheduleDate.format('YYYY-MM') === date.format('YYYY-MM')) {
        result.push(s);
      }
    });

    return result;
  };

  /**
   * @description cancel
   */
  const handleCancel = () => {
    setSetting(false);
    //-資料恢復
    scheduleData.value = cloneDeep(cacheScheduleData.value);
  };

  /**
   * @description 點擊複製
   */
  const clickCopy = () => {
    copyMethod.openModal(true, { schedules: scheduleData.value, employeeId: employeeId.value });
  };

  /**
   * @description 點擊設定
   * @param date
   */
  const clickSetting = (date: Dayjs) => {
    setSetting(true);
    editMonth.value = date.month() + 1;
    //-暫存原始資料
    cacheScheduleData.value = cloneDeep(scheduleData.value);
  };

  /**
   * @description 設置設定模式
   * @param status
   */
  const setSetting = (status: boolean) => {
    isSetting.value = status;
    emit('setting', status);
  };

  /**
   * @description 獲取cell訊息
   * @param date
   */
  const getCellData = (date: Dayjs): { color: string; text: string }[] => {
    const result: { color: string; text: string }[] = [];
    scheduleData.value.forEach((schedule) => {
      const scheduleDay = dayjs(schedule.scheduleDate);
      if (
        scheduleDay.year() === date.year() &&
        scheduleDay.month() === date.month() &&
        scheduleDay.date() === date.date() &&
        schedule.workShift
      ) {
        //-如果年月日相同, push結果
        result.push({ color: schedule.workShift.color!, text: schedule.workShift.name! });
      }
    });
    return result;
  };

  /**
   * @description api
   * @param date 查詢日期
   */
  const fetch = async (date: Dayjs) => {
    loading.value = true;
    try {
      date = dayjs(`${date.format('YYYY-MM')}-01`, 'YYYY-MM-DD');
      //-查詢前後一個月
      scheduleData.value = await getWorkScheduleByDate({
        employeeId: employeeId.value,
        start: date.add(-1, 'month').format('YYYY-MM-DD'),
        end: date.add(2, 'month').format('YYYY-MM-DD'),
      });
    } finally {
      loading.value = false;
    }
  };

  /**
   * @description 獲取employee id schedule
   * @param empId employee id
   */
  const loadDate = (empId?: number) => {
    if (!empId) {
      return;
    }
    calenderValue.value = dayjs();
    employeeId.value = empId;
    fetch(dayjs());
  };

  /**
   * @description 當班別下拉選單改變時
   * @param e
   */
  const workShiftSelectChange = (e) => {
    workShiftSelect.value = JSON.parse(e);
  };

  /**
   * @description 獲取work shift下拉式選單
   */
  const getWorkShiftOptions = async () => {
    const result: { label: string; value: string }[] = [];
    const workShifts = await getWorkShiftByKeyword();
    workShifts.items.forEach((workShift) => {
      result.push({ label: workShift.name!, value: JSON.stringify(workShift) });
    });
    workShiftOptions.value = result;
  };

  /**
   * @description reload
   * @param date
   */
  const reload = async (date: Dayjs) => {
    //-重新fetch
    await fetch(date);
    //-尋找schedule
    const schedule: WorkScheduleModel[] = [];
    //-遍歷
    scheduleData.value.forEach((s) => {
      const scheduleDay: Dayjs = dayjs(s.scheduleDate);
      if (
        scheduleDay.year() === date.year() &&
        scheduleDay.month() === date.month() &&
        scheduleDay.date() === date.date()
      ) {
        //-如果年月日相同, push結果
        schedule.push(s);
      }
    });
    detailModalRef.value.updateData(schedule);
  };

  defineExpose({ loadDate });

  onMounted(() => {
    getWorkShiftOptions();
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-work-schedule-setting-modal';

  .@{prefix-cls} {
    &-calendar {
      .ant-picker-body {
        padding: 0 !important;
      }

      .ant-picker-content {
        position: relative;
        top: 0;

        thead tr {
          height: 25px;
          // background: @app-content-background;
          th {
            border: @border-color-base 1px solid;
            border-top: 0;
          }
        }
      }

      .ant-picker-cell:hover {
        transition:
          background 0.2s,
          border 0.2s;
        background: @border-color-base;

        .ant-picker-cell-inner {
          background: none !important;
        }
      }

      .ant-picker-cell {
        top: 0;
        height: 104px;
        border: @border-color-base 1px solid;
        vertical-align: top;

        .ant-picker-cell-inner {
          width: 80%;
          border-bottom: #8b949e 1px solid;

          .ant-picker-calendar-date-content {
            height: 70px;
            overflow-y: auto;

            .events {
              margin-bottom: 0;
            }
          }
        }
      }

      .ant-picker-cell-today {
        .ant-picker-cell-inner::before {
          border: none !important;
        }
      }

      .ant-picker-cell-selected {
        .ant-picker-cell-inner {
          background: none !important;
          color: @text-color-base !important;
        }
      }

      .ant-picker-cell-disabled::before {
        height: 100%;
      }
    }

    &-badge {
      .ant-badge-status-text {
        margin-inline-start: 5px !important;
        font-size: 13px !important;
      }
    }
  }
</style>
