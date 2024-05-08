import { ErrorMessageMode } from '#/axios';
import { defHttp } from '@/utils/http/axios';
import { CheckInStatusModel } from '@/api/manager/model/checkInStatus';

/**
 * @description 根據區間和員工ID獲取打卡狀態
 * @param params
 * @param mode error mode
 * @returns Promise
 */
export function getByDateRangeAndKeywordCheckInStatus(
  params: {
    keyword: string;
    dateRange: string[];
    abnormal: boolean;
    page: number;
    pageSize: number;
  },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<CheckInStatusModel[]>(
    {
      url: `/v1/query/checkIn/status/keyword`,
      params: {
        keyword: params.keyword,
        dateRangeStart: params.dateRange[0],
        dateRangeEnd: params.dateRange[1],
        abnormal: params.abnormal,
        page: params.page,
        pageSize: params.pageSize,
      },
    },
    { errorMessageMode: mode },
  );
}
