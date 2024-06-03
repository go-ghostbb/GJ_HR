import { ErrorMessageMode } from '#/axios';
import { defHttp } from '@/utils/http/axios';
import { CheckInStatusModel } from '@/api/manager/model/checkInStatus';
import { BasicFetchResult } from '@/api/model/baseModel';

/**
 * @description 根據區間和員工ID獲取打卡狀態
 * @param params
 * @param mode error mode
 * @returns Promise
 */
export function getByDateRangeAndKeywordCheckInStatus(
  params: {
    keyword?: string;
    dateRange: string[];
    abnormal: boolean;
    page?: number;
    pageSize?: number;
  },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<CheckInStatusModel>>(
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

/**
 * @description 更新狀態表
 * @param id
 * @param params
 * @param mode
 */
export function updateCheckInStatus(
  id: number,
  params: { work?: string; offWork?: string; workShiftId: number },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put({ url: `/v1/checkIn/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 重新計算狀態
 * @param params
 * @param mode
 */
export function filingCheckInStatus(
  params: { employeeId: number[]; dateRange: string[] },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post({ url: `/v1/checkInStatus/filing`, params }, { errorMessageMode: mode });
}
