import { BasicColumn } from '@/components/Table';
import dayjs from 'dayjs';

export const columns: BasicColumn[] = [
  {
    title: '薪資期間',
    width: 200,
    customRender: ({ record }) => {
      const start = dayjs(record.start).format('YYYY-MM-DD');
      const end = dayjs(record.end).format('YYYY-MM-DD');
      return `${start} ~ ${end}`;
    },
  },
  {
    title: '員工人數',
    width: 100,
    customRender: ({ record }) => {
      return record.calcSalaryEmployee.length;
    },
  },
  {
    title: '階段',
    customRender: ({ record }) => {
      switch (record.stage) {
        case 1:
          return '第一步 (調整薪資)';
      }
    },
  },
  {
    title: '建立者',
    width: 100,
    customRender: ({ record }) => {
      return record.founder.realName;
    },
  },
];
