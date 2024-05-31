import { BasicColumn, FormSchema } from '@/components/Table';
import dayjs from 'dayjs';

export const column: BasicColumn[] = [
  {
    title: '員工編號',
    customRender: ({ record }) => {
      return record.employee.code;
    },
  },
  {
    title: '員工姓名',
    customRender: ({ record }) => {
      return record.employee.realName;
    },
  },
  {
    title: '假別',
    customRender: ({ record }) => {
      return record.leave.name;
    },
  },
  {
    title: '生效時間',
    customRender: ({ record }) => {
      return record.effective;
    },
  },
  {
    title: '過期時間',
    customRender: ({ record }) => {
      return record.expired;
    },
  },
  {
    title: '可用天數',
    customRender: ({ record }) => {
      return Math.round(record.available * 100) / 100;
    },
  },
  {
    title: '簽核中天數',
    customRender: ({ record }) => {
      return Math.round(record.signing * 100) / 100;
    },
  },
  {
    title: '已使用天數',
    customRender: ({ record }) => {
      return Math.round(record.used * 100) / 100;
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '關鍵字',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    label: '年度',
    labelWidth: 60,
    field: 'year',
    component: 'Select',
    defaultValue: dayjs().format('YYYY'),
    componentProps: {
      options: createSearchSelectOptions(),
    },
    colProps: { span: 4 },
  },
];

function createSearchSelectOptions() {
  const start = dayjs().year();
  const options: { label: string; value: string }[] = [];
  for (let i = start - 5; i <= start + 2; i++) {
    options.push({
      label: String(i),
      value: String(i),
    });
  }
  return options;
}
