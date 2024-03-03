import { genMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/zh_TW';
import { deepMerge } from '@/utils';

const modules = import.meta.glob('./zh-TW/**/*.{json,ts,js}', { eager: true });

export default {
  message: {
    ...genMessage(modules as Recordable<Recordable>, 'zh-TW'),
    antdLocale: {
      ...antdLocale,
      DatePicker: deepMerge(
        antdLocale.DatePicker,
        genMessage(modules as Recordable<Recordable>, 'zh-TW').antdLocale.DatePicker,
      ),
    },
  },
};
