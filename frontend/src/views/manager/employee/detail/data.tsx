import {
  CheckInProcStatus,
  OffWorkAttendStatus,
  WorkAttendStatus,
} from '@/api/manager/model/checkInStatus';
import { DepartmentModel } from '@/api/manager/model/departmentModel';
import { EmploymentStatus } from '@/api/manager/model/employeeModel';
import { SalaryType } from '@/api/setting/model/salaryAddItemModel';
import { DescItem } from '@/components/Description';
import { BasicColumn, FormSchema } from '@/components/Table';
import { Checkbox, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';
import { CheckOutlined } from '@ant-design/icons-vue';
import 'dayjs/plugin/timezone';
import { RuleObject } from 'ant-design-vue/lib/form/interface';

export const detailDescSchema: DescItem[] = [
  {
    field: 'realName',
    label: '姓名',
  },
  {
    field: 'nationalId',
    label: '身份證字號',
  },
  {
    field: 'birth',
    label: '生日',
    render: (curVal, _) => {
      const date = dayjs(curVal);
      return date.format('YYYY-MM-DD');
    },
  },
  {
    field: 'email',
    label: '信箱',
  },
  {
    field: 'mobile',
    label: '手機號碼',
  },
  {
    field: 'department',
    label: '部門',
    render: (curVal: DepartmentModel, _) => {
      return curVal.name;
    },
  },
  {
    field: 'hireDate',
    label: '入職時間',
    render: (curVal, _) => {
      const date = dayjs(curVal);
      return date.format('YYYY-MM-DD');
    },
  },
  {
    field: 'employmentStatus',
    label: '就職狀態',
    render: (curVal: EmploymentStatus, _) => {
      let color: string;
      let text: string;
      switch (curVal) {
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
];

export const absenceColumn: BasicColumn[] = [
  {
    title: '員工編號',
    fixed: 'left',
    width: 100,
    customRender: ({ record }) => {
      return record.employee.code;
    },
  },
  {
    title: '部門編號',
    fixed: 'left',
    width: 100,
    customRender: ({ record }) => {
      return record.employee.department.code;
    },
  },
  {
    title: '部門名稱',
    fixed: 'left',
    width: 100,
    customRender: ({ record }) => {
      return record.employee.department.name;
    },
  },
  {
    title: '出勤日期',
    fixed: 'left',
    width: 100,
    customRender: ({ record }) => {
      return record.date;
    },
  },
  {
    title: '出勤班別代碼',
    fixed: 'left',
    width: 100,
    customRender: ({ record }) => {
      if (!record.workShift) {
        return '';
      }
      return record.workShift.code;
    },
  },
  {
    title: '出勤班別',
    fixed: 'left',
    width: 100,
    customRender: ({ record }) => {
      if (!record.workShift) {
        return '';
      }
      const start = dayjs(record.workShift.workStart, 'HH:mm:ss').format('HH:mm');
      const end = dayjs(record.workShift.workEnd, 'HH:mm:ss').format('HH:mm');
      return `${start}-${end}`;
    },
  },
  {
    title: '刷卡卡號',
    fixed: 'left',
    width: 120,
    customRender: ({ record }) => {
      return record.employee.cardNumber;
    },
  },
  {
    title: '上班',
    children: [
      {
        title: '出勤時間',
        width: 100,
        customRender: ({ record }) => {
          if (!record.workCheckIn) {
            return '';
          }
          return dayjs(record.workCheckIn).format('HH:mm:ss');
        },
      },
      {
        title: '出勤狀態',
        width: 100,
        customRender: ({ record }) => {
          switch (record.workAttendStatus) {
            case WorkAttendStatus.WorkNormal:
              return '正常';
            case WorkAttendStatus.WorkNotSwiped:
              return '未刷卡';
            case WorkAttendStatus.WorkLate:
              return '遲到';
            case WorkAttendStatus.WorkOffDay:
              return '休息日';
          }
        },
      },
      {
        title: '處理狀態',
        width: 100,
        customRender: ({ record }) => {
          switch (record.workAttendProcStatus) {
            case CheckInProcStatus.ProcNormal:
              return '正常';
            case CheckInProcStatus.NotProcessed:
              return <span style={{ color: 'red' }}>未處理</span>;
            case CheckInProcStatus.Processed:
              return <span style={{ color: 'blue' }}>已處理</span>;
          }
        },
      },
    ],
  },
  {
    title: '下班',
    children: [
      {
        title: '出勤時間',
        width: 100,
        customRender: ({ record }) => {
          if (!record.offWorkCheckIn) {
            return '';
          }
          return dayjs(record.offWorkCheckIn).format('HH:mm:ss');
        },
      },
      {
        title: '出勤狀態',
        width: 100,
        customRender: ({ record }) => {
          switch (record.offWorkAttendStatus) {
            case OffWorkAttendStatus.OffWorkNormal:
              return '正常';
            case OffWorkAttendStatus.OffWorkNotSwiped:
              return '未刷卡';
            case OffWorkAttendStatus.OffWorkEarly:
              return '早退';
            case OffWorkAttendStatus.OffWorkOffDay:
              return '休息日';
          }
        },
      },
      {
        title: '處理狀態',
        width: 100,
        customRender: ({ record }) => {
          switch (record.offWorkAttendProcStatus) {
            case CheckInProcStatus.ProcNormal:
              return '正常';
            case CheckInProcStatus.NotProcessed:
              return <span style={{ color: 'red' }}>未處理</span>;
            case CheckInProcStatus.Processed:
              return <span style={{ color: 'blue' }}>已處理</span>;
          }
        },
      },
    ],
  },
  {
    title: '缺勤時數',
    width: 100,
    customRender: ({ record }) => {
      return record.absenceHours;
    },
  },
  {
    title: '請假時數',
    width: 100,
    customRender: ({ record }) => {
      return record.leaveHours;
    },
  },
  {
    title: '簽核中的請假時數',
    width: 100,
    customRender: ({ record }) => {
      return record.signLeaveHours;
    },
  },
  {
    title: '加班時數',
    width: 100,
    customRender: ({ record }) => {
      return record.overtimeHours;
    },
  },
  {
    title: '簽核中的加班時數',
    width: 100,
    customRender: ({ record }) => {
      return record.signOvertimeHours;
    },
  },
];

export const absenceSearchFormSchema: FormSchema[] = [
  {
    field: 'dateRange',
    label: '日期區間',
    component: 'RangePicker',
    required: true,
    rules: [
      {
        validator: (_rule: RuleObject, value: string[]) => {
          const start = dayjs(value[0]);
          const end = dayjs(value[1]);
          if (end.diff(start, 'year') >= 1) {
            return Promise.reject('選取範圍不能超過一年');
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      presets: [
        { label: '過去7天', value: [dayjs().add(-7, 'd'), dayjs()] },
        { label: '過去14天', value: [dayjs().add(-14, 'd'), dayjs()] },
        { label: '過去30天', value: [dayjs().add(-30, 'd'), dayjs()] },
        { label: '過去90天', value: [dayjs().add(-90, 'd'), dayjs()] },
      ],
    },
    colProps: { span: 7 },
  },
  {
    field: 'abnormal',
    component: 'Input',
    defaultValue: true,
    render: ({ model, field }) => {
      return (
        <Checkbox
          v-model:checked={model[field]}
          //onChange={(e) => ((model[field] = e.target.checked), console.log(model[field], e))}
        >
          只顯示異常
        </Checkbox>
      );
    },
    colProps: { span: 8 },
  },
];

export const addItemColumn: BasicColumn[] = [
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
      if (record.useCustom) {
        return '*' + record.customAmount;
      }
      return record.amount;
    },
  },
];

export const addItemSearchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '關鍵字',
    component: 'Input',
    colProps: { span: 8 },
  },
];
