<script setup lang="ts">
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { getByDateRangeAndKeywordCheckInStatus } from '@/api/query/check_in';
  import { column, searchFormSchema } from './data';
  import { Button } from 'ant-design-vue';
  import { ref } from 'vue';
  import { CheckInExcel } from '@/wailsjs/go/service/excelService';
  import { excel } from '@/wailsjs/go/models';
  import { useLocaleStore } from '@/store/modules/locale';
  import { useMessage } from '@/hooks/web/useMessage';
  import dayjs from 'dayjs';
  import {
    CheckInProcStatus,
    OffWorkAttendStatus,
    WorkAttendStatus,
    CheckInStatusModel,
  } from '@/api/manager/model/checkInStatus';
  import CheckInStatusModal from './CheckInStatusModal.vue';
  import { useModal } from '@/components/Modal';

  defineOptions({
    name: 'CheckInStatusQuery',
    inheritAttrs: false,
  });

  const searchInfo = ref<{
    keyword?: string;
    dateRange: string[];
    abnormal: boolean;
    page?: number;
    pageSize?: number;
  }>();

  //-check-in設定
  const [registerCheckInModal, checkInMethod] = useModal();

  //-table設定
  const [registerTable, { setLoading, reload }] = useTable({
    title: '出缺勤列表',
    beforeFetch: (params: {
      keyword?: string;
      dateRange: string[];
      abnormal: boolean;
      page: number;
      pageSize: number;
    }) => {
      searchInfo.value = params;
      return params;
    },
    api: getByDateRangeAndKeywordCheckInStatus,
    columns: column,
    formConfig: {
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    immediate: false,
    actionColumn: {
      width: 40,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  /**
   * @description 匯出excel
   */
  const exportExcel = async () => {
    setLoading(true);
    if (!searchInfo.value) {
      setLoading(false);
      return;
    }

    const res = await getByDateRangeAndKeywordCheckInStatus({
      keyword: searchInfo.value?.keyword,
      dateRange: searchInfo.value!.dateRange,
      abnormal: searchInfo.value!.abnormal,
      page: 0,
      pageSize: 0,
    });

    const data: excel.CheckInData[] = [];

    res.items.forEach((item) => {
      const start = dayjs(item.workShift?.workStart, 'HH:mm:ss').format('HH:mm');
      const end = dayjs(item.workShift?.workEnd, 'HH:mm:ss').format('HH:mm');

      const temp: excel.CheckInData = {
        code: item.employee!.code!,
        realName: item.employee!.realName!,
        departmentCode: item.employee!.department!.code!,
        departmentName: item.employee!.department!.name!,
        date: item.date!,
        workShiftCode: item.workShift!.code!,
        time: `${start}-${end}`,
        cardNum: item.employee!.cardNumber!,
        workCheckIn: item.workCheckIn ? dayjs(item.workCheckIn).format('HH:mm:ss') : '',
        workAttendStatus: '',
        workAttendProcStatus: '',
        offWorkCheckIn: item.offWorkCheckIn ? dayjs(item.offWorkCheckIn).format('HH:mm:ss') : '',
        offWorkAttendStatus: '',
        offWorkAttendProcStatus: '',
        absenceHours: Math.round(item.absenceHours! * 100) / 100,
        leaveHours: item.leaveHours!,
        signLeaveHours: item.leaveHours!,
        overtimeHours: item.overtimeHours!,
        signOvertimeHours: item.signOvertimeHours!,
      };

      switch (item.workAttendStatus) {
        case WorkAttendStatus.WorkNormal:
          temp.workAttendStatus = '正常';
          break;
        case WorkAttendStatus.WorkNotSwiped:
          temp.workAttendStatus = '未刷卡';
          break;
        case WorkAttendStatus.WorkLate:
          temp.workAttendStatus = '遲到';
          break;
        case WorkAttendStatus.WorkOffDay:
          temp.workAttendStatus = '休息日';
          break;
      }

      switch (item.workAttendProcStatus) {
        case CheckInProcStatus.ProcNormal:
          temp.workAttendProcStatus = '正常';
          break;
        case CheckInProcStatus.NotProcessed:
          temp.workAttendProcStatus = '未處理';
          break;
        case CheckInProcStatus.Processed:
          temp.workAttendProcStatus = '已處理';
          break;
      }

      switch (item.offWorkAttendStatus) {
        case OffWorkAttendStatus.OffWorkNormal:
          temp.offWorkAttendStatus = '正常';
          break;
        case OffWorkAttendStatus.OffWorkNotSwiped:
          temp.offWorkAttendStatus = '未刷卡';
          break;
        case OffWorkAttendStatus.OffWorkEarly:
          temp.offWorkAttendStatus = '早退';
          break;
        case OffWorkAttendStatus.OffWorkOffDay:
          temp.offWorkAttendStatus = '休息日';
          break;
      }

      switch (item.offWorkAttendProcStatus) {
        case CheckInProcStatus.ProcNormal:
          temp.offWorkAttendProcStatus = '正常';
          break;
        case CheckInProcStatus.NotProcessed:
          temp.offWorkAttendProcStatus = '未處理';
          break;
        case CheckInProcStatus.Processed:
          temp.offWorkAttendProcStatus = '已處理';
          break;
      }

      data.push(temp);
    });

    const exportRes = await CheckInExcel('checkIn.xlsx', data, useLocaleStore().getLocale);
    if (exportRes.success) {
      useMessage().createMessage.success({ content: '匯出成功' });
    } else {
      useMessage().createMessage.error({ content: exportRes.msg });
    }

    setLoading(false);
  };

  /**
   * @description 編輯
   * @param record
   */
  const handleEdit = (record: CheckInStatusModel) => {
    checkInMethod.openModal(true, { record });
  };

  /**
   * @description success
   */
  const handleSuccess = () => {
    useMessage().createMessage.success({ content: '操作成功' });
    reload();
  };
</script>

<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" @click="exportExcel">
          {{ '匯出excel' }}
        </Button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="(column as any).key === 'action'">
          <TableAction
            :actions="[
              {
                tooltip: '編輯',
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record as CheckInStatusModel),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <CheckInStatusModal @register="registerCheckInModal" @success="handleSuccess" />
  </div>
</template>

<style scoped lang="less"></style>
