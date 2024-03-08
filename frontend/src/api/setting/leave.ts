import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { GetLeaveByKeywordParams, LeaveModel } from './model/leaveModel';
import { BasicFetchResult } from '../model/baseModel';
import { LeaveGroupModel } from './model/leaveGroupModel';
import { LeaveGroupConditionModel } from './model/leaveGroupConditionModel';

/**
 * @description 根據keyword獲取leave
 * @param params 查詢參數
 */
export function getLeaveByKeyword(
  params: GetLeaveByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<LeaveModel>>(
    { url: '/v1/leave', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 建立leave
 * @param params leave參數
 * @param mode error mode
 * @returns Promise
 */
export function createLeave(params: LeaveModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/leave', params }, { errorMessageMode: mode });
}

/**
 * @description 更新leave
 * @param id leave id
 * @param params leave 參數
 * @param mode error mode
 * @returns Promise
 */
export function updateLeave(id: number, params: LeaveModel, mode: ErrorMessageMode = 'message') {
  return defHttp.put({ url: `/v1/leave/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除leave
 * @param id leave id
 * @param mode error mode
 * @returns Promise
 */
export function deleteLeave(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/leave/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設置狀態
 * @param id leave id
 * @param status 狀態
 * @param mode error mode
 * @returns Promise
 */
export function setStatus(id: number, status: boolean, mode: ErrorMessageMode = 'message') {
  return defHttp.patch(
    { url: `/v1/leave/${id}/status`, params: { status } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 獲取群組
 * @param leaveId leave id
 * @param mode error mode
 * @returns Promise
 */
export function getLeaveGroup(leaveId: number, mode: ErrorMessageMode = 'message') {
  return defHttp.get<LeaveGroupModel[]>(
    { url: `/v1/leave/group/${leaveId}` },
    { errorMessageMode: mode },
  );
}

/**
 * @description 新增群組
 * @param params LeaveGroupModel
 * @param mode error mode
 * @returns Promise
 */
export function createGroup(params: LeaveGroupModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/leave/group', params }, { errorMessageMode: mode });
}

/**
 * @description 刪除群組
 * @param id group id
 * @param mode error mode
 * @returns Promise
 */
export function deleteGroup(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/leave/group/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設置群組的員工
 * @param id group id
 * @param employeeId employee id
 * @param mode error mode
 * @returns Promise
 */
export function setLeaveGroupEmployee(
  id: number,
  employeeId: number[],
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.patch(
    { url: `/v1/leave/group/${id}/employee`, params: { employeeId } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 設置群組的條件
 * @param id group id
 * @param condition condition list
 * @param mode error mode
 * @returns Promise
 */
export function setLeaveGroupCond(
  id: number,
  condition: LeaveGroupConditionModel[],
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.patch(
    { url: `/v1/leave/group/${id}/condition`, params: { condition } },
    { errorMessageMode: mode },
  );
}
