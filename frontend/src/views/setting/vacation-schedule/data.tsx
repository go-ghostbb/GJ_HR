import { VacationScheduleRepeat } from '@/api/setting/model/vacationScheduleModel';
import { DescItem } from '@/components/Description';
import { FormSchema } from '@/components/Form';
import dayjs from 'dayjs';

export const scheduleFormSchema: FormSchema[] = [
  {
    field: 'vacationId',
    label: '休假日類別',
    component: 'Select',
    defaultValue: 1,
    componentProps: {
      fieldNames: { label: 'name', value: 'ID' },
      allowClear: false,
    },
  },
  {
    field: 'startDate',
    label: '開始',
    component: 'DatePicker',
    defaultValue: dayjs().format('YYYY-MM-DD'),
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      allowClear: false,
    },
  },
  {
    field: 'endDate',
    label: '結束',
    component: 'DatePicker',
    defaultValue: dayjs().format('YYYY-MM-DD'),
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      allowClear: false,
    },
  },
  {
    field: 'repeat',
    label: '重複',
    component: 'Select',
    defaultValue: 'none',
    componentProps: {
      options: [
        { label: '永不', value: VacationScheduleRepeat.RepeatNone },
        { label: '每周', value: VacationScheduleRepeat.RepeatWeek },
        { label: '每月', value: VacationScheduleRepeat.RepeatMonth },
        { label: '每年', value: VacationScheduleRepeat.RepeatYear },
      ],
      allowClear: false,
    },
  },
  {
    field: 'endRepeat',
    label: '結束重複',
    component: 'DatePicker',
    defaultValue: dayjs().format('YYYY-MM-DD'),
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      allowClear: false,
    },
    ifShow: ({ values }) => values.repeat !== 'none' && values.repeat,
  },
  {
    field: 'remark',
    label: '備註',
    component: 'InputTextArea',
    componentProps: {
      rows: 6,
    },
  },
];

export const vacationDescSchema: DescItem[] = [
  {
    field: 'startDate',
    label: '開始',
    render: (_curVal, data) => {
      return dayjs(data.endDate).format('YYYY-MM-DD');
    },
  },
  {
    field: 'endDate',
    label: '結束',
    render: (_curVal, data) => {
      return dayjs(data.endDate).format('YYYY-MM-DD');
    },
  },
  {
    field: 'repeat',
    label: '重複',
    render: (curVal, _data) => {
      switch (curVal) {
        case 'none':
          return '永不';
        case 'week':
          return '每周';
        case 'month':
          return '每月';
        case 'year':
          return '每年';
      }
    },
  },
  {
    field: 'endRepeat',
    label: '結束重複',
    show: (data) => data.repeat !== 'none',
    render: (_curVal, data) => {
      return dayjs(data.endRepeat).format('YYYY-MM-DD');
    },
  },
  {
    field: 'remark',
    label: '備註',
  },
];
