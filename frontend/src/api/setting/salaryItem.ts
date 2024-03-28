import { defHttp } from '@/utils/http/axios';
import { BasicFetchResult } from '../model/baseModel';
import { ErrorMessageMode } from '#/axios';
import { GetSalaryAddItemByKeywordParams, SalaryAddItemModel } from './model/salaryAddItemModel';
import {
  GetSalaryReduceItemByKeywordParams,
  SalaryReduceItemModel,
} from './model/salaryReduceItemModel';

/**
 * @description 根據keyword獲取薪資加項
 * @param params 查詢參數
 */
export function getSalaryAddItemByKeyword(
  params?: GetSalaryAddItemByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<SalaryAddItemModel>>(
    { url: '/v1/salary/add', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 建立薪資加項
 * @param params 薪資加項參數
 * @param mode error mode
 * @returns Promise
 */
export function createSalaryAddItem(
  params: SalaryAddItemModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post({ url: '/v1/salary/add', params }, { errorMessageMode: mode });
}

/**
 * @description 更新薪資加項
 * @param id 薪資加項 id
 * @param params 薪資加項 參數
 * @param mode error mode
 * @returns Promise
 */
export function updateSalaryAddItem(
  id: number,
  params: SalaryAddItemModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put({ url: `/v1/salary/add/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除薪資加項
 * @param id 薪資加項 id
 * @param mode error mode
 * @returns Promise
 */
export function deleteSalaryAddItem(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/salary/add/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設定加項套用員工
 * @param id 薪資加項 id
 * @param employeeId employee id
 * @param mode error mode
 * @returns Promise
 */
export function setSalaryAddItemEmployee(
  id: number,
  employeeId: number[],
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.patch(
    { url: `/v1/salary/add/${id}/employee`, params: { employeeId } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 根據keyword獲取薪資減項
 * @param params 查詢參數
 */
export function getSalaryReduceItemByKeyword(
  params?: GetSalaryReduceItemByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<SalaryAddItemModel>>(
    { url: '/v1/salary/reduce', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 建立薪資減項
 * @param params 薪資減項參數
 * @param mode error mode
 * @returns Promise
 */
export function createSalaryReduceItem(
  params: SalaryReduceItemModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post({ url: '/v1/salary/reduce', params }, { errorMessageMode: mode });
}

/**
 * @description 更新薪資減項
 * @param id 薪資減項 id
 * @param params 薪資減項 參數
 * @param mode error mode
 * @returns Promise
 */
export function updateSalaryReduceItem(
  id: number,
  params: SalaryReduceItemModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put({ url: `/v1/salary/reduce/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除薪資減項
 * @param id 薪資減項 id
 * @param mode error mode
 * @returns Promise
 */
export function deleteSalaryReduceItem(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/salary/reduce/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設定減項套用員工
 * @param id 薪資減項 id
 * @param employeeId employee id
 * @param mode error mode
 * @returns Promise
 */
export function setSalaryReduceItemEmployee(
  id: number,
  employeeId: number[],
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.patch(
    { url: `/v1/salary/reduce/${id}/employee`, params: { employeeId } },
    { errorMessageMode: mode },
  );
}
