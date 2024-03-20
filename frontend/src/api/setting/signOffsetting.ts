import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import {
  GetLeaveSignOffSettingParams,
  LeaveSignOffSettingModel,
} from './model/leaveSignOffSettingModel';
import {
  GetOvertimeSignOffSettingParams,
  OvertimeSignOffSettingModel,
} from './model/overtimeSignOffSettingModel';

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

/**
 * @description 獲取加班簽核設定
 * @param params dept id and vacation id
 * @param mode error mode
 * @returns Promise
 */
export function getOvertimeSignOffSetting(
  params: GetOvertimeSignOffSettingParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<OvertimeSignOffSettingModel[]>(
    { url: '/v1/signOff/overtime', params },
    { errorMessageMode: mode },
  );
}

/**
 * @description 批量更新加班簽核設定
 * @param depratmentId department id
 * @param vacationId vacation id
 * @param setting OvertimeSignOffSettingModel[]
 * @param mode error mode
 * @returns Promise
 */
export function updateOvertimeSignOffSettingBatch(
  depratmentId: number,
  vacationId: number,
  setting: OvertimeSignOffSettingModel[],
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put(
    {
      url: `/v1/signOff/overtime/${depratmentId}/${vacationId}/batch`,
      params: { signOffSetting: setting },
    },
    { errorMessageMode: mode },
  );
}
