import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { DepartmentModel, GetDepartmentByKeywordParams } from './model/departmentModal';

/**
 * @description 根據keyword獲取department
 * @param params 查詢參數
 */
export function getDepartmentByKeyword(
  params: GetDepartmentByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<DepartmentModel[]>(
    { url: '/v1/department', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 建立department
 * @param params department參數
 * @param mode error mode
 * @returns Promise
 */
export function createDepartment(params: DepartmentModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/department', params }, { errorMessageMode: mode });
}

/**
 * @description 更新department
 * @param id department id
 * @param params department 參數
 * @param mode error mode
 * @returns Promise
 */
export function updateDepartment(
  id: number,
  params: DepartmentModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put({ url: `/v1/department/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除department
 * @param id department id
 * @param mode error mode
 * @returns Promise
 */
export function deleteDepartment(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/department/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設置狀態
 * @param id department id
 * @param status 狀態
 * @param mode error mode
 * @returns Promise
 */
export function setStatus(id: number, status: boolean, mode: ErrorMessageMode = 'message') {
  return defHttp.patch(
    { url: `/v1/department/${id}/status`, params: { status } },
    { errorMessageMode: mode },
  );
}
