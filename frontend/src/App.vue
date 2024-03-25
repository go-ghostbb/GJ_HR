<template>
  <ConfigProvider :locale="getAntdLocale" :theme="themeConfig">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { AppProvider } from '@/components/Application';
  import { useTitle } from '@/hooks/web/useTitle';
  import { useLocale } from '@/locales/useLocale';
  import { ConfigProvider } from 'ant-design-vue';

  import { useDarkModeTheme } from '@/hooks/setting/useDarkModeTheme';
  import 'dayjs/locale/zh-cn';
  import 'dayjs/locale/zh-tw';
  import { computed } from 'vue';

  import dayjs from 'dayjs';
  import { dayjsLocale } from '@/utils/dayjs';
  import advancedFormat from 'dayjs/plugin/advancedFormat';
  import customParseFormat from 'dayjs/plugin/customParseFormat';
  import localeData from 'dayjs/plugin/localeData';
  import weekday from 'dayjs/plugin/weekday';
  import weekOfYear from 'dayjs/plugin/weekOfYear';
  import weekYear from 'dayjs/plugin/weekYear';
  import timezone from 'dayjs/plugin/timezone';
  import utc from 'dayjs/plugin/utc';
  import { EventsOn } from './wailsjs/runtime/runtime';
  import { useEmployeeStore } from './store/modules/employee';
  import { SetApiUrl } from '@/wailsjs/go/service/systemService';

  dayjs.extend(customParseFormat);
  dayjs.extend(advancedFormat);
  dayjs.extend(weekday);
  dayjs.extend(localeData);
  dayjs.extend(weekOfYear);
  dayjs.extend(weekYear);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  dayjs.locale(dayjsLocale());

  // support Multi-language
  const { getAntdLocale } = useLocale();

  const { isDark, darkTheme } = useDarkModeTheme();

  const themeConfig = computed(() =>
    Object.assign(
      {
        token: {
          colorPrimary: '#0960bd',
          colorSuccess: '#55D187',
          colorWarning: '#EFBD47',
          colorError: '#ED6F6F',
          colorInfo: '#0960bd',
        },
      },
      isDark.value ? darkTheme : {},
    ),
  );
  // Listening to page changes and dynamically changing site titles
  useTitle();

  // 監聽setToken
  EventsOn('setToken', (token: string) => {
    useEmployeeStore().setToken(token);
  });

  // 像後端設置api url
  SetApiUrl(import.meta.env.VITE_GLOB_API_URL);
</script>
