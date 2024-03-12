import { setStatus } from '@/api/setting/workShift';
import { BasicColumn, FormSchema } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { Switch } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: '班別名稱',
    width: 200,
    customRender: ({ record }) => {
      return record.name;
    },
  },
  {
    title: '班別代碼',
    width: 200,
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
    label: '班別名稱',
    required: true,
    component: 'Input',
  },
  {
    field: 'code',
    label: '班別代碼',
    required: true,
    component: 'Input',
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
    field: 'workStart',
    label: '上班時間',
    required: true,
    component: 'TimePicker',
    componentProps: {
      valueFormat: 'HH:mm:ss',
    },
  },
  {
    field: 'workEnd',
    label: '下班時間',
    required: true,
    component: 'TimePicker',
    componentProps: {
      valueFormat: 'HH:mm:ss',
    },
  },
  {
    field: 'restStart',
    label: '休息開始時間',
    required: true,
    component: 'TimePicker',
    componentProps: {
      valueFormat: 'HH:mm:ss',
    },
  },
  {
    field: 'restEnd',
    label: '休息開始時間',
    required: true,
    component: 'TimePicker',
    componentProps: {
      valueFormat: 'HH:mm:ss',
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
