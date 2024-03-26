import {
  CheckInProcStatus,
  OffWorkAttendStatus,
  WorkAttendStatus,
} from '@/api/manager/model/checkInStatus';
import { DepartmentModel } from '@/api/manager/model/departmentModel';
import { EmploymentStatus } from '@/api/manager/model/employeeModel';
import { DescItem } from '@/components/Description';
import { BasicColumn, FormSchema } from '@/components/Table';
import { Checkbox, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

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
      const date = dayjs(record.workCheckInDate);
      return date.format('YYYY-MM-DD');
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
      const start = dayjs(record.workShift.workStart).tz('UTC').format('HH:mm');
      const end = dayjs(record.workShift.workEnd).tz('UTC').format('HH:mm');
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
          const time = dayjs(record.workAttendTime).tz('UTC').format('HH:mm:ss');
          if (time === '00:00:00') {
            return '';
          }
          return time;
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
              return '未處理';
            case CheckInProcStatus.Processed:
              return '已處理';
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
          const time = dayjs(record.offWorkAttendTime).tz('UTC').format('HH:mm:ss');
          if (time === '00:00:00') {
            return '';
          }
          return time;
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
              return '未處理';
            case CheckInProcStatus.Processed:
              return '已處理';
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
