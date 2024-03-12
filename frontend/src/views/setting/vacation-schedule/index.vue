<template>
  <div>
    <div v-loading="loading">
      <Calendar
        v-model:value="calendarValue"
        :class="`${prefixCls}-calendar`"
        :fullscreen="false"
        @select="onSelect"
        @panel-change="onPanelChange"
      >
        <!-- header slot -->
        <template #headerRender="{ value: current, onChange }">
          <div style="padding: 10px">
            <!-- 新增按鈕 -->
            <Button type="primary" shape="circle" @click="handleCreate">
              <FileAddOutlined />
            </Button>

            <!-- 前一頁按鈕 -->
            <Button
              class="ml-2 mr-2"
              type="text"
              shape="circle"
              @click="onChange(current.month(parseInt(String(current.month() - 1), 10)))"
            >
              <Icon icon="ion:chevron-back-outline" />
            </Button>

            <!-- 年select -->
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

            <!-- 月select -->
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

            <!-- 下一頁 -->
            <Button
              class="ml-2 mr-2"
              type="text"
              shape="circle"
              @click="onChange(current.month(parseInt(String(current.month() + 1), 10)))"
            >
              <Icon icon="ion:chevron-forward-outline" />
            </Button>
          </div>
        </template>

        <!-- cell slot -->
        <template #dateCellRender="{ current }">
          <ul class="events">
            <li
              v-for="(item, index) in getCellData(current)"
              :key="`schedule_${current.month}_${index}`"
            >
              <Badge :class="`${prefixCls}-badge`" :color="item.color" :text="item.text" />
            </li>
          </ul>
        </template>
      </Calendar>
    </div>
    <!-- modal -->
    <ScheduleModal @register="registerScheduleDrawer" @success="handleSuccess" />
    <DetailModal ref="detailModalRef" @register="registerDetailModal" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import dayjs, { Dayjs } from 'dayjs';
  import { Badge, Calendar, Select, SelectOption, Button } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { CalendarMode } from 'ant-design-vue/es/calendar/generateCalendar';
  import { ref, onMounted } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { FileAddOutlined } from '@ant-design/icons-vue';
  import 'dayjs/plugin/localeData';
  import { getVacationScheduleByDate } from '@/api/setting/vacation';
  import { VacationScheduleModel } from '@/api/setting/model/vacationScheduleModel';
  import DetailModal from './DetailModal.vue';
  import ScheduleModal from './ScheduleModal.vue';
  import { useDrawer } from '@/components/Drawer';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useModal } from '@/components/Modal';

  defineOptions({
    name: 'VacationScheduleSetting',
    inheritAttrs: false,
  });

  const { prefixCls } = useDesign('vacation-schedule');

  //-loading
  const loading = ref(false);

  //-面板value
  const calendarValue = ref<Dayjs>(dayjs());

  //-schedule資料儲存
  const scheduleData = ref<VacationScheduleModel[]>([]);

  //-註冊ScheduleModal
  const [registerScheduleDrawer, scheduleMethod] = useDrawer();

  //-註冊DetailModal
  const [registerDetailModal, detailMethod] = useModal();
  const detailModalRef = ref();

  /**
   * @description 面板select事件
   * @param date Dayjs
   * @param info source: 'year' | 'month' | 'date' | 'customize'
   */
  const onSelect = (date: Dayjs, info: { source: 'year' | 'month' | 'date' | 'customize' }) => {
    if (info.source === 'date') {
      //-尋找schedule
      const schedule: VacationScheduleModel[] = [];
      //-遍歷
      scheduleData.value.forEach((s) => {
        const scheduleDay = dayjs(s.scheduleDate);
        if (
          scheduleDay.year() === date.year() &&
          scheduleDay.month() === date.month() &&
          scheduleDay.date() === date.date() &&
          s.vacation
        ) {
          //-如果年月日相同, push結果
          schedule.push(s);
        }
      });
      //-打開modal
      detailMethod.openModal(true, { date, schedule });
    }
  };

  /**
   * @description 面板變化時觸發
   * @param date Dayjs
   * @param _mode
   */
  const onPanelChange = (date: string | Dayjs, _mode: CalendarMode) => {
    if (typeof date !== 'string') {
      fetch(date);
    }
  };

  /**
   * @description 點擊新增事件
   */
  const handleCreate = () => {
    scheduleMethod.openDrawer(true, { isUpdate: false });
  };

  /**
   * @description 獲取前後10年
   * @param value
   */
  const getYears = (value: Dayjs): number[] => {
    const year = value.year();
    const years: number[] = [];
    for (let i = year - 10; i < year + 10; i += 1) {
      years.push(i);
    }
    return years;
  };

  /**
   * @description 獲取cell展示資料
   * @param date 日期
   */
  const getCellData = (date: Dayjs): { color: string; text: string }[] => {
    const result: { color: string; text: string }[] = [];
    scheduleData.value.forEach((schedule) => {
      const scheduleDay = dayjs(schedule.scheduleDate);
      if (
        scheduleDay.year() === date.year() &&
        scheduleDay.month() === date.month() &&
        scheduleDay.date() === date.date() &&
        schedule.vacation
      ) {
        //-如果年月日相同, push結果
        result.push({ color: schedule.vacation.color!, text: schedule.vacation.name! });
      }
    });
    return result;
  };

  /**
   * @description 成功
   */
  const handleSuccess = async () => {
    useMessage().createMessage.success({ content: '操作成功' });
    fetch(calendarValue.value);
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
      scheduleData.value = await getVacationScheduleByDate({
        start: date.add(-1, 'month').format('YYYY-MM-DD'),
        end: date.add(2, 'month').format('YYYY-MM-DD'),
      });
    } finally {
      loading.value = false;
    }
  };

  /**
   * @description reload
   * @param date
   */
  const reload = async (date: Dayjs) => {
    //-重新fetch
    await fetch(calendarValue.value);
    //-尋找schedule
    const schedule: VacationScheduleModel[] = [];
    //-遍歷
    scheduleData.value.forEach((s) => {
      const scheduleDay = dayjs(s.scheduleDate);
      if (
        scheduleDay.year() === date.year() &&
        scheduleDay.month() === date.month() &&
        scheduleDay.date() === date.date() &&
        s.vacation
      ) {
        //-如果年月日相同, push結果
        schedule.push(s);
      }
    });
    detailModalRef.value.updateData(schedule);
  };

  //-init
  onMounted(() => {
    fetch(dayjs());
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-vacation-schedule';
  @full: calc(100vh - 83px);
  @cell: calc((@full - 77px) / 6);
  @content: calc(@cell - 24px);

  .@{prefix-cls} {
    &-calendar {
      height: @full;
      border-radius: 0;

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
            border-right: @border-color-base 1px solid;
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
        height: @cell;
        border: @border-color-base 1px solid;
        vertical-align: top;

        .ant-picker-cell-inner {
          width: 80%;
          height: 100%;

          .ant-picker-calendar-date-value {
            border-bottom: #8b949e 1px solid;
            border-radius: 4px;
          }

          .ant-picker-calendar-date-content {
            height: calc(100% - 26px);
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
