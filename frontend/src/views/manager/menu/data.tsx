import { BasicColumn, FormSchema } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import Icon from '@/components/Icon/Icon.vue';
import { Switch } from 'ant-design-vue';
import dayjs from 'dayjs';
import { setStatus } from '@/api/manager/menu';
import { usePermission } from '@/hooks/web/usePermission';

const isDir = (type: string) => type === 'directory';
const isMenu = (type: string) => type === 'menu';
const isIFrame = (type: string) => type === 'iframe';

export const columns: BasicColumn[] = [
  {
    title: '菜單名稱',
    width: 200,
    customRender: ({ record }) => {
      return record.meta.title;
    },
  },
  {
    title: '圖標',
    width: 50,
    customRender: ({ record }) => {
      return <Icon icon={record.meta.icon}></Icon>;
    },
  },
  {
    title: '路由',
    customRender: ({ record }) => {
      return record.path;
    },
  },
  {
    title: '組件',
    customRender: ({ record }) => {
      return record.component;
    },
  },
  {
    title: '排序',
    width: 50,
    customRender: ({ record }) => {
      return record.sort;
    },
  },
  {
    title: '狀態',
    width: 80,
    customRender: ({ record }) => {
      return (
        <Switch
          disabled={!usePermission().hasPermission('menu:update:status')}
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
    width: 150,
    customRender: ({ record }) => {
      const date = dayjs(record.CreatedAt);
      return date.format('YYYY-MM-DD HH:mm');
    },
  },
  {
    title: '最後更新時間',
    width: 150,
    customRender: ({ record }) => {
      const date = dayjs(record.UpdatedAt);
      return date.format('YYYY-MM-DD HH:mm');
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
    field: 'type',
    label: '類型',
    component: 'RadioButtonGroup',
    defaultValue: 'directory',
    componentProps: {
      options: [
        { label: '資料夾', value: 'directory' },
        { label: '目錄', value: 'menu' },
        { label: 'IFrame', value: 'iframe' },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'meta.title',
    label: '菜單名稱',
    component: 'Input',
    required: true,
  },
  {
    field: 'parentId',
    label: '資料夾',
    component: 'TreeSelect',
    defaultValue: 0,
    componentProps: {
      fieldNames: {
        label: 'label',
        value: 'value',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'path',
    label: '路由',
    component: 'Input',
    required: true,
  },
  {
    field: 'name',
    label: '名稱',
    helpMessage: '建議跟組件名稱一致',
    component: 'Input',
    required: true,
  },
  {
    field: 'redirect',
    label: 'redirect',
    component: 'Input',
    ifShow: ({ values }) => isDir(values.type),
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'meta.icon',
    label: '圖標',
    component: 'IconPicker',
  },
  {
    field: '',
    label: '進階設定',
    component: 'Divider',
    colProps: { lg: 24 },
    componentProps: {
      style: { 'font-weight': 'bold', 'font-size': '18px' },
      orientation: 'center',
    },
  },
  {
    field: 'component',
    label: '組件',
    component: 'Input',
    ifShow: ({ values }) => isMenu(values.type),
  },
  {
    field: 'meta.frameSrc',
    label: 'IFrame網址',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => isIFrame(values.type),
  },
  {
    field: 'meta.transitionName',
    label: '動畫名稱',
    component: 'Input',
    ifShow: ({ values }) => isMenu(values.type),
  },
  {
    field: 'meta.currentActiveMenu',
    label: '激活菜單',
    component: 'Input',
    ifShow: ({ values }) => isMenu(values.type),
  },
  {
    field: 'meta.ignoreKeepAlive',
    label: '忽略緩存',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    ifShow: ({ values }) => isMenu(values.type) || isIFrame(values.type),
  },
  {
    field: 'meta.affix',
    label: '固定標籤',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    ifShow: ({ values }) => isMenu(values.type) || isIFrame(values.type),
  },
  {
    field: 'meta.hideBreadcrumb',
    label: '隱藏Breadcrumb顯示',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
  },
  {
    field: 'meta.hideChildrenInMenu',
    label: '隱藏所有子菜單',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    ifShow: ({ values }) => isDir(values.type),
  },
  {
    field: 'meta.hideTab',
    label: 'hideTab',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    ifShow: ({ values }) => isMenu(values.type) || isIFrame(values.type),
  },
  {
    field: 'meta.hideMenu',
    label: 'hideMenu',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    ifShow: ({ values }) => isMenu(values.type),
  },
  {
    field: 'meta.ignoreRoute',
    label: '忽略路由',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    ifShow: ({ values }) => isDir(values.type) || isMenu(values.type),
  },
  {
    field: 'meta.hidePathForChildren',
    label: 'hidePathForChildren',
    helpMessage: '是否在子級菜單的完整path中忽略本級path',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    ifShow: ({ values }) => isDir(values.type),
  },
];
