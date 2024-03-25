import { BasicColumn, FormSchema } from '@/components/Table';
import { CheckOutlined } from '@ant-design/icons-vue';

export const columns: BasicColumn[] = [
  {
    title: '名稱',
    customRender: ({ record }) => {
      return record.name;
    },
  },
  {
    title: '所得稅',
    customRender: ({ record }) => {
      if (record.incomeTax) {
        return <CheckOutlined />;
      }
      return '-';
    },
  },
  {
    title: '預設/單位金額',
    customRender: ({ record }) => {
      return record.amount;
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
