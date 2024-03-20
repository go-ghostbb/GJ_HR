import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import {
  GetLeaveSignOffSettingParams,
  LeaveSignOffSettingModel,
} from './model/leaveSignOffSettingModel';

/**
 * @description 獲取請假簽核設定
 * @param params dept id and leave id
 * @param mode error mode
 * @returns Promise
 */
export function getLeaveSignOffSetting(
  params: GetLeaveSignOffSettingParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<LeaveSignOffSettingModel[]>(
    { url: '/v1/signOff/leave', params },
    { errorMessageMode: mode },
  );
}

/**
 * @description 批量更新請假簽核設定
 * @param depratmentId department id
 * @param leaveId leave id
 * @param setting LeaveSignOffSettingModel[]
 * @param mode error mode
 * @returns Promise
 */
export function updateLeaveSignOffSettingBatch(
  depratmentId: number,
  leaveId: number,
  setting: LeaveSignOffSettingModel[],
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put(
    {
      url: `/v1/signOff/leave/${depratmentId}/${leaveId}/batch`,
      params: { signOffSetting: setting },
    },
    { errorMessageMode: mode },
  );
}
