import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import {
  EmployeeModel,
  EmploymentStatus,
  GetEmployeeByKeywordParams,
  ResetPasswordParams,
} from './model/employeeModel';
import { BasicFetchResult } from '../model/baseModel';

/**
 * @description 根據params獲取對應員工
 * @param params 查詢條件
 * @param mode error mode
 * @returns Promise
 */
export function getEmployeeByKeyword(
  params?: GetEmployeeByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<EmployeeModel>>(
    { url: '/v1/employee', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 根據employee id 獲取相對應員工
 * @param id employee id
 * @param mode error mode
 * @returns Promise
 */
export function getEmployeeByID(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.get<EmployeeModel>({ url: `/v1/employee/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設置登入狀態, 啟用, 禁用
 * @param id employee id
 * @param status 狀態
 * @param mode error mode
 * @returns Promise
 */
export function setLoginStatus(id: number, status: boolean, mode: ErrorMessageMode = 'message') {
  return defHttp.patch(
    { url: `/v1/employee/${id}/login/status`, params: { status } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 設置就職狀態
 * @param id employee id
 * @param employeeStatus EmploymentStatus
 * @param mode error mode
 * @returns Promise
 */
export function setEmploymentStatus(
  id: number,
  employeeStatus: EmploymentStatus,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.patch(
    { url: `/v1/employee/${id}/employmentStatus`, params: { employeeStatus } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 建立employee
 * @param params employee參數
 * @param mode error mode
 * @returns Promise
 */
export function createEmployee(params: EmployeeModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/employee', params }, { errorMessageMode: mode });
}

/**
 * @description 更新employee
 * @param id employee id
 * @param params employee 參數
 * @param mode error mode
 * @returns Promise
 */
export function updateEmployee(
  id: number,
  params: EmployeeModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put({ url: `/v1/employee/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除employee
 * @param id employee id
 * @param mode error mode
 * @returns Promise
 */
export function deleteEmployee(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/employee/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 重置密碼
 * @param id employee id
 * @param params password
 * @param mode error mode
 * @returns Promise
 */
export function resetPassword(
  id: number,
  params: ResetPasswordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.patch({ url: `/v1/employee/${id}/password`, params }, { errorMessageMode: mode });
}
