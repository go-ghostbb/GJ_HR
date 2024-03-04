import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { GetPermByKeywordParams, PermissionModel } from './model/permissionModel';
import { BasicFetchResult } from '../model/baseModel';

/**
 * @description 根據keyword獲取permission
 * @param params 查詢參數
 */
export function getPermByKeyword(
  params?: GetPermByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<PermissionModel>>(
    { url: '/v1/permission', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 建立permission
 * @param params permission參數
 * @param mode error mode
 * @returns Promise
 */
export function createPerm(params: PermissionModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/permission', params }, { errorMessageMode: mode });
}

/**
 * @description 更新permission
 * @param id permission id
 * @param params permission 參數
 * @param mode error mode
 * @returns Promise
 */
export function updatePerm(
  id: number,
  params: PermissionModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put({ url: `/v1/permission/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除permission
 * @param id permission id
 * @param mode error mode
 * @returns Promise
 */
export function deletePerm(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/permission/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設置狀態
 * @param id permission id
 * @param status 狀態
 * @param mode error mode
 * @returns Promise
 */
export function setStatus(id: number, status: boolean, mode: ErrorMessageMode = 'message') {
  return defHttp.patch(
    { url: `/v1/permission/${id}/status`, params: { status } },
    { errorMessageMode: mode },
  );
}
