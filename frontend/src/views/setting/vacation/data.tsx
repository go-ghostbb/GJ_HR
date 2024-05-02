import { setStatus } from '@/api/setting/vacation';
import { BasicColumn, FormSchema } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { Switch } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: '休假日名稱',
    width: 200,
    customRender: ({ record }) => {
      return record.name;
    },
  },
  {
    title: '休假日代碼',
    width: 180,
    customRender: ({ record }) => {
      return record.code;
    },
  },
  {
    title: '顏色',
    width: 50,
    customRender: ({ record }) => {
      return (
        <div
          style={{
            width: '12px',
            height: '12px',
            position: 'relative',
            left: '30%',
            'border-radius': '50%',
            'background-color': record.color,
          }}
        ></div>
      );
    },
  },
  {
    title: '狀態',
    width: 120,
    customRender: ({ record }) => {
      return (
        <Switch
          // disabled={!usePermission().hasPermission('role:update:status')}
          disabled={record.ID === 0}
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
    label: '休假日名稱',
    required: true,
    component: 'Input',
  },
  {
    field: 'code',
    label: '休假日代碼',
    required: true,
    component: 'Input',
    componentProps: {
      disabled: false,
    },
  },
  {
    field: 'weight',
    label: '權重',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '顏色',
    field: 'color',
    defaultValue: '#0BFA49',
    component: 'ColorPicker',
    componentProps: {
      width: '140px',
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
