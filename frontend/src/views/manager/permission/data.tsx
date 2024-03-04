import { BasicColumn, FormSchema } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { Switch } from 'ant-design-vue';
import dayjs from 'dayjs';
import { setStatus } from '@/api/manager/permission';
import { usePermission } from '@/hooks/web/usePermission';

export const columns: BasicColumn[] = [
  {
    title: '名稱',
    width: 200,
    customRender: ({ record }) => {
      return record.name;
    },
  },
  {
    title: '權限標示',
    width: 180,
    customRender: ({ record }) => {
      return record.perm;
    },
  },
  {
    title: '狀態',
    width: 120,
    customRender: ({ record }) => {
      return (
        <Switch
          disabled={!usePermission().hasPermission('permission:update:status')}
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
    title: '創建時間',
    width: 180,
    customRender: ({ record }) => {
      const date = dayjs(record.CreatedAt);
      return date.format('YYYY-MM-DD HH:mm');
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
    label: '名稱',
    required: true,
    component: 'Input',
  },
  {
    field: 'perm',
    label: '權限標示',
    helpMessage: [
      '通常是"表名稱:操作", 如果是帶欄位的話"表名稱:操作:欄位"',
      '例如：',
      '表名稱:employee 操作:create => "employee:create"',
      '表名稱:employee 操作:update 欄位:status => "employee:update:status"',
    ],
    required: true,
    component: 'Input',
    componentProps: {
      disabled: false,
    },
  },
  {
    label: '備註',
    field: 'remark',
    component: 'InputTextArea',
  },
];
