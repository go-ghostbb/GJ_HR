import { BasicColumn, FormSchema } from '@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '職級名稱',
    width: 200,
    customRender: ({ record }) => {
      return record.name;
    },
  },
  {
    title: '職級代碼',
    width: 200,
    customRender: ({ record }) => {
      return record.code;
    },
  },
  {
    title: '備註',
    customRender: ({ record }) => {
      return record.remark;
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '關鍵字',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '職級名稱',
    required: true,
    component: 'Input',
  },
  {
    field: 'code',
    label: '職級代碼',
    required: true,
    component: 'Input',
  },
  {
    label: '備註',
    field: 'remark',
    component: 'InputTextArea',
    componentProps: {
      rows: 6,
    },
  },
];
