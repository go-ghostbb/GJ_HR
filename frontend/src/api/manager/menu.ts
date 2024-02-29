import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { MenuModel, GetMenuByKeywordParams } from './model/menuModel';

/**
 * @description 根據keyword獲取menu
 * @param params 查詢參數
 */
export function getMenuByKeyword(
  params: GetMenuByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<MenuModel[]>(
    { url: '/v1/menu', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 建立menu
 * @param params menu參數
 * @param mode error mode
 * @returns Promise
 */
export function createMenu(params: MenuModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/menu', params }, { errorMessageMode: mode });
}

/**
 * @description 更新menu
 * @param id menu id
 * @param params menu 參數
 * @param mode error mode
 * @returns Promise
 */
export function updateMenu(id: number, params: MenuModel, mode: ErrorMessageMode = 'message') {
  return defHttp.put({ url: `/v1/menu/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除menu
 * @param id menu id
 * @param mode error mode
 * @returns Promise
 */
export function deleteMenu(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/menu/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設置狀態
 * @param id menu id
 * @param status 狀態
 * @param mode error mode
 * @returns Promise
 */
export function setStatus(id: number, status: boolean, mode: ErrorMessageMode = 'message') {
  return defHttp.patch(
    { url: `/v1/menu/${id}/status`, params: { status } },
    { errorMessageMode: mode },
  );
}
