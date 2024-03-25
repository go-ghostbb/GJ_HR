import { SalaryType } from '@/api/setting/model/salaryAddItemModel';
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
    title: '薪資類型',
    customRender: ({ record }) => {
      switch (record.salaryType) {
        case SalaryType.FixedSalary:
          return '固定薪資';
        case SalaryType.NonFixedSalary:
          return '非固定薪資';
      }
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
    title: '職工福利金',
    customRender: ({ record }) => {
      if (record.benefits) {
        return <CheckOutlined />;
      }
      return '-';
    },
  },
  {
    title: '補充保費',
    customRender: ({ record }) => {
      if (record.premiums) {
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
