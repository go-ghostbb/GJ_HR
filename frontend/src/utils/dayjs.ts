import { useLocaleStoreWithOut } from '@/store/modules/locale';

const localeStore = useLocaleStoreWithOut();

export function dayjsLocale(): string {
  let text = '';
  switch (localeStore.getLocale) {
    case 'zh_TW':
      text = 'zh-tw';
      break;
    case 'zh_CN':
      text = 'zh-cn';
      break;
    default:
      text = 'en';
  }
  return text;
}
