import { DepartmentModel } from '@/api/manager/model/departmentModel';
import { EmploymentStatus } from '@/api/manager/model/employeeModel';
import { DescItem } from '@/components/Description';
import { Tag } from 'ant-design-vue';
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
