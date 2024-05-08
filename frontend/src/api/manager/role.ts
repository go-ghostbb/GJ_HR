import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { GetRoleByKeywordParams, RoleModel } from './model/roleModel';
import { BasicFetchResult } from '../model/baseModel';

/**
 * @description 根據keyword獲取role
 * @param params 查詢參數
 * @param mode
 */
export function getRoleByKeyword(
  params?: GetRoleByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<RoleModel>>(
    { url: '/v1/role', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 建立role
 * @param params role參數
 * @param mode error mode
 * @returns Promise
 */
export function createRole(params: RoleModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/role', params }, { errorMessageMode: mode });
}

/**
 * @description 更新role
 * @param id role id
 * @param params role 參數
 * @param mode error mode
 * @returns Promise
 */
export function updateRole(id: number, params: RoleModel, mode: ErrorMessageMode = 'message') {
  return defHttp.put({ url: `/v1/role/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除role
 * @param id role id
 * @param mode error mode
 * @returns Promise
 */
export function deleteRole(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/role/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設置狀態
 * @param id role id
 * @param status 狀態
 * @param mode error mode
 * @returns Promise
 */
export function setStatus(id: number, status: boolean, mode: ErrorMessageMode = 'message') {
  return defHttp.patch(
    { url: `/v1/role/${id}/status`, params: { status } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 設置可用menu
 * @param id role id
 * @param menuId menu id => number[]
 * @param mode error mode
 * @returns Promise
 */
export function setMenu(id: number, menuId: number[], mode: ErrorMessageMode = 'message') {
  return defHttp.patch(
    { url: `/v1/role/${id}/menu`, params: { menuId } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 設置可用permission
 * @param id role id
 * @param permissionId permission id => number[]
 * @param mode error mode
 * @returns Promise
 */
export function setPerm(id: number, permissionId: number[], mode: ErrorMessageMode = 'message') {
  return defHttp.patch(
    { url: `/v1/role/${id}/permission`, params: { permissionId } },
    { errorMessageMode: mode },
  );
}
