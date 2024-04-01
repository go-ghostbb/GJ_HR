import { EmploymentStatus, SalaryCycle } from '@/api/manager/model/employeeModel';
import { BasicColumn, FormSchema } from '@/components/Table';
import dayjs from 'dayjs';
import { Tag, Avatar } from 'ant-design-vue';

const avatarPrefixURL = `${import.meta.env.VITE_GLOB_API_URL}/assets/employee`;

export const columns: BasicColumn[] = [
  {
    title: '姓名',
    width: 100,
    customRender: ({ record }) => {
      return record.realName;
    },
  },
  {
    title: '頭像',
    width: 100,
    customRender: ({ record }) => {
      const avatar = record.avatar as string;
      if (avatar && avatar !== '') {
        return (
          <Avatar size={60} src={`${avatarPrefixURL}/${record.ID}/${avatar}`}>
            {record.realName}
          </Avatar>
        );
      } else {
        return <Avatar size={60}>{record.realName}</Avatar>;
      }
    },
  },
  {
    title: '入職時間',
    width: 100,
    customRender: ({ record }) => {
      const date = dayjs(record.hireDate);
      return date.format('YYYY-MM-DD');
    },
  },
  {
    title: '就職狀態',
    width: 80,
    customRender: ({ record }) => {
      const employmentStatus = record.employmentStatus as EmploymentStatus;
      let color: string;
      let text: string;
      switch (employmentStatus) {
        case EmploymentStatus.Active:
          text = '在職';
          color = 'green';
          break;
        case EmploymentStatus.UnpaidLeave:
          text = '停薪留職';
          color = '';
          break;
        case EmploymentStatus.Resigned:
          text = '離職';
          color = 'red';
          break;
      }
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: '備註',
    width: 500,
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
  {
    field: 'employmentStatus',
    label: '就職狀態',
    component: 'Select',
    labelWidth: 120,
    defaultValue: EmploymentStatus.Active,
    componentProps: {
      options: [
        { label: '在職', value: EmploymentStatus.Active },
        { label: '停薪留職', value: EmploymentStatus.UnpaidLeave },
        { label: '離職', value: EmploymentStatus.Resigned },
      ],
    },
    colProps: { span: 8 },
  },
];

const basicInfoFormSchema: FormSchema[] = [
  {
    field: 'basicInfoDivider',
    label: '基本資料',
    component: 'Divider',
    colProps: { lg: 24 },
    componentProps: {
      style: { 'font-weight': 'bold', 'font-size': '18px' },
      orientation: 'center',
    },
  },
  {
    field: 'nationalId',
    label: '身份證字號',
    component: 'Input',
    required: true,
  },
  {
    field: 'birth',
    label: '生日',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      allowClear: false,
    },
    required: true,
  },
  {
    field: 'email',
    label: '信箱',
    component: 'Input',
    required: true,
  },
  {
    field: 'mobile',
    label: '手機號',
    component: 'Input',
    required: true,
  },
];

const salayFormSchema: FormSchema[] = [
  {
    field: 'salaryDivider',
    label: '薪資設定',
    component: 'Divider',
    colProps: { lg: 24 },
    componentProps: {
      style: { 'font-weight': 'bold', 'font-size': '18px' },
      orientation: 'center',
    },
  },
  {
    field: 'salary',
    label: '薪資金額',
    component: 'Input',
    required: true,
    rules: [
      {
        validator: (rule, val) => {
          if (val.toString().indexOf('.') === -1 && val.toString().substr(-1) === '.') {
            return Promise.resolve();
          }

          // convert to number
          const reg = /^(\d{0,10})(\.\d{1,4})?$/;
          if (!reg.test(val)) {
            return Promise.reject('格式不對');
          } else {
            val = Number(val);
          }

          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'salaryCycle',
    label: '計薪週期',
    component: 'Select',
    required: true,
    componentProps: {
      options: [
        {
          label: '月薪制',
          value: SalaryCycle.Month,
        },
        {
          label: '時薪制',
          value: SalaryCycle.Hour,
        },
      ],
    },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'realName',
    label: '姓名',
    component: 'Input',
    required: true,
  },
  {
    field: 'departmentId',
    defaultValue: 0,
    label: '部門',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'name',
        value: 'ID',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'hireDate',
    label: '到職日期',
    component: 'DatePicker',
    defaultValue: dayjs(new Date()),
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      allowClear: false,
    },
    required: true,
  },
  {
    field: 'cardNumber',
    label: '卡機卡號',
    component: 'Input',
  },
  ...basicInfoFormSchema,
  ...salayFormSchema,
];
