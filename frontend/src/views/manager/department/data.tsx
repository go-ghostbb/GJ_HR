import { BasicColumn, FormSchema } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import dayjs from 'dayjs';
import { Switch } from 'ant-design-vue';
import { setStatus } from '@/api/manager/department';
import { usePermission } from '@/hooks/web/usePermission';

export const columns: BasicColumn[] = [
  {
    title: '部門名稱',
    width: 200,
    customRender: ({ record }) => {
      return record.name;
    },
  },
  {
    title: '代碼',
    width: 160,
    customRender: ({ record }) => {
      return record.code;
    },
  },
  {
    title: '狀態',
    width: 80,
    customRender: ({ record }) => {
      return (
        <Switch
          disabled={!usePermission().hasPermission('department:update:status')}
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
    title: '主管',
    width: 160,
    customRender: ({ record }) => {
      if (record.manager) {
        return record.manager.realName;
      }
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
    label: '部門名稱',
    component: 'Input',
    required: true,
  },
  {
    field: 'code',
    label: '部門代碼',
    component: 'Input',
    required: true,
  },
  {
    field: 'parentId',
    defaultValue: 0,
    label: '上級部門',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'label',
        value: 'value',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'managerId',
    label: '主管',
    slot: 'manager',
    show: false,
  },
  {
    label: '備註',
    field: 'remark',
    component: 'InputTextArea',
  },
];
