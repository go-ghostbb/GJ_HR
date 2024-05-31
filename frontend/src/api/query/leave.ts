import { ErrorMessageMode } from '#/axios';
import { defHttp } from '@/utils/http/axios';
import { BasicFetchResult } from '@/api/model/baseModel';
import { LeaveCorrectModel } from '@/api/query/model/leaveCorrect';

/**
 * @description 根據keyword獲取leave correct
 * @param params
 * @param mode
 */
export function getLeaveCorrectByKeyword(
  params: { keyword?: string; year: string },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<LeaveCorrectModel>>(
    {
      url: '/v1/query/leave/correct/keyword',
      params,
    },
    { errorMessageMode: mode },
  );
}
