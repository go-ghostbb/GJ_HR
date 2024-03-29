import { BasicColumn } from '@/components/Table';
import { toThousands } from './utils';

export const columns: BasicColumn[] = [
  {
    title: '員工姓名',
    customRender: ({ record }) => {
      return record.employee.realName;
    },
  },
  {
    title: '本薪',
    width: 200,
    customRender: ({ record }) => {
      return '$' + toThousands(record.salary);
    },
  },
  {
    title: '加項',
    width: 200,
    customRender: ({ record }) => {
      let count = 0;
      if (record.salaryAdd && record.salaryAdd.length > 0) {
        record.salaryAdd.forEach((s) => {
          count += s.amount;
        });
      }
      return '+$' + toThousands(count);
    },
  },
  {
    title: '加項總額',
    width: 200,
    customRender: ({ record }) => {
      let count = 0;
      if (record.salaryAdd && record.salaryAdd.length > 0) {
        record.salaryAdd.forEach((s) => {
          count += s.amount;
        });
      }
      return '$' + toThousands(count + record.salary);
    },
  },
  {
    title: '減項',
    width: 200,
    customRender: ({ record }) => {
      let count = 0;
      if (record.salaryReduce && record.salaryReduce.length > 0) {
        record.salaryReduce.forEach((s) => {
          count += s.amount;
        });
      }
      return '-$' + toThousands(count);
    },
  },
  {
    title: '實發金額',
    width: 200,
    customRender: ({ record }) => {
      let addCount = 0;
      let reduceCount = 0;
      //-加項遍歷
      if (record.salaryAdd && record.salaryAdd.length > 0) {
        record.salaryAdd.forEach((s) => {
          addCount += s.amount;
        });
      }
      //-減項遍歷
      if (record.salaryReduce && record.salaryReduce.length > 0) {
        record.salaryReduce.forEach((s) => {
          reduceCount += s.amount;
        });
      }
      return '$' + toThousands(record.salary + addCount - reduceCount);
    },
  },
];
