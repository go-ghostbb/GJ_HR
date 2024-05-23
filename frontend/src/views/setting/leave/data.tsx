import { Switch } from 'ant-design-vue';
import { setStatus } from '@/api/setting/leave';
import { useMessage } from '@/hooks/web/useMessage';
import { BasicColumn, FormSchema } from '@/components/Table';
import { LeaveCycle, LeavePay } from '@/api/setting/model/leaveModel';

export const columns: BasicColumn[] = [
  {
    title: '假別名稱',
    width: 200,
    customRender: ({ record }) => {
      return record.name;
    },
  },
  {
    title: '假別代碼',
    width: 200,
    customRender: ({ record }) => {
      return record.code;
    },
  },
  {
    title: '狀態',
    width: 120,
    customRender: ({ record }) => {
      return (
        <Switch
          checked={record.status}
          checkedChildren={'啟用'}
          unCheckedChildren={'禁用'}
          loading={record.setStatusLoading}
          onChange={(checked) => {
            (record.setStatusLoading = true),
              setStatus(record.ID, checked as boolean)
                .then(() => {
                  record.status = checked;
                  useMessage().createMessage.success({ content: '設置成功' });
                })
                .catch(() => {
                  useMessage().createMessage.error({ content: '設置失敗' });
                })
                .finally(() => {
                  record.setStatusLoading = false;
                });
          }}
        ></Switch>
      );
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
  {
    field: 'status',
    label: '狀態',
    labelWidth: 120,
    component: 'Select',
    componentProps: {
      options: [
        { label: '啟用', value: 'true' },
        { label: '禁用', value: 'false' },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '假別名稱',
    required: true,
    component: 'Input',
  },
  {
    field: 'code',
    label: '假別代碼',
    required: true,
    component: 'Input',
  },
  {
    field: 'pay',
    label: '支付',
    component: 'RadioButtonGroup',
    defaultValue: LeavePay.None,
    componentProps: {
      options: [
        { label: '不給薪', value: LeavePay.None },
        { label: '半薪', value: LeavePay.Half },
        { label: '全薪', value: LeavePay.All },
      ],
    },
  },
  {
    field: 'cycle',
    label: '週期',
    required: true,
    defaultValue: LeaveCycle.Default,
    component: 'Select',
    componentProps: {
      options: [
        {
          value: LeaveCycle.Default,
          label: '預設(以「年」為單位給予)',
        },
        {
          value: LeaveCycle.Annual,
          label: '週年制',
        },
        {
          value: LeaveCycle.Calendar,
          label: '歷年制（曆年制）',
        },
        {
          value: LeaveCycle.CalendarTwice,
          label: '歷年制（曆年制）【按入職日拆兩次給予】',
        },
      ],
    },
  },
  {
    field: 'default',
    label: '預設給假',
    required: true,
    component: 'InputNumber',
    helpMessage: '每年請假的上限(單位：天)',
    componentProps: {
      placeholder: '以年計算(單位：天)',
      addonAfter: 'Day',
    },
  },
  {
    field: 'minimum',
    label: '請假最小單位',
    required: true,
    component: 'InputNumber',
    helpMessage: '單位：分鐘',
    componentProps: {
      placeholder: '以單次計算(單位：分鐘)',
      addonAfter: 'Minute',
    },
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
