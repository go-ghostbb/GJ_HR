import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { GetVacationByKeywordParams, VacationModel } from './model/vacationModel';
import { BasicFetchResult } from '../model/baseModel';
import { VacationGroupOvertimeRateModel } from './model/vacationGroupOvertimeRateModel';
import { VacationGroupModel } from './model/vacationGroupModel';

/**
 * @description 根據keyword獲取vacation
 * @param params 查詢參數
 */
export function getVacationByKeyword(
  params: GetVacationByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<VacationModel>>(
    { url: '/v1/vacation', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 建立vacation
 * @param params vacation參數
 * @param mode error mode
 * @returns Promise
 */
export function createVacation(params: VacationModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/vacation', params }, { errorMessageMode: mode });
}

/**
 * @description 更新vacation
 * @param id vacation id
 * @param params vacation 參數
 * @param mode error mode
 * @returns Promise
 */
export function updateVacation(
  id: number,
  params: VacationModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put({ url: `/v1/vacation/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除vacation
 * @param id vacation id
 * @param mode error mode
 * @returns Promise
 */
export function deleteVacation(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/vacation/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設置狀態
 * @param id vacation id
 * @param status 狀態
 * @param mode error mode
 * @returns Promise
 */
export function setStatus(id: number, status: boolean, mode: ErrorMessageMode = 'message') {
  return defHttp.patch(
    { url: `/v1/vacation/${id}/status`, params: { status } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 獲取群組
 * @param vacationId vacation id
 * @param mode error mode
 * @returns Promise
 */
export function getVacationGroup(vacationId: number, mode: ErrorMessageMode = 'message') {
  return defHttp.get<VacationGroupModel[]>(
    { url: `/v1/vacation/group/${vacationId}` },
    { errorMessageMode: mode },
  );
}

/**
 * @description 新增群組
 * @param params VacationGroupModel
 * @param mode error mode
 * @returns Promise
 */
export function createGroup(params: VacationGroupModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/vacation/group', params }, { errorMessageMode: mode });
}

/**
 * @description 刪除群組
 * @param id group id
 * @param mode error mode
 * @returns Promise
 */
export function deleteGroup(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/vacation/group/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設置群組的員工
 * @param id group id
 * @param employeeId employee id
 * @param mode error mode
 * @returns Promise
 */
export function setVacationGroupEmployee(
  id: number,
  employeeId: number[],
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.patch(
    { url: `/v1/vacation/group/${id}/employee`, params: { employeeId } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 設置群組的加班倍率區間
 * @param id group id
 * @param condition condition list
 * @param mode error mode
 * @returns Promise
 */
export function setVacationGroupOvertimeRate(
  id: number,
  overtimeRate: VacationGroupOvertimeRateModel[],
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.patch(
    { url: `/v1/vacation/group/${id}/condition`, params: { overtimeRate } },
    { errorMessageMode: mode },
  );
}
