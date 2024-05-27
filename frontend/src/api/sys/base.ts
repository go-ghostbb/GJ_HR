import { defHttp } from '@/utils/http/axios';

export const health = (url: string) => {
  return defHttp.get(
    { url: '/health', timeout: 10000 },
    {
      joinPrefix: false,
      apiUrl: url,
    },
  );
};
