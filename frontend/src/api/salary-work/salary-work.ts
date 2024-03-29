import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import {
  CalaSalaryParams,
  CalcSalaryEmployeeModel,
  CalcSalaryModel,
  GetSalaryCalcParams,
} from './model/salary-work';
import { BasicFetchResult } from '../model/baseModel';

/**
 * @description 計算薪資
 * @param params
 * @param mode error mode
 * @returns Promise
 */
export function calcSalary(params: CalaSalaryParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/salary/work', params }, { errorMessageMode: mode });
}

/**
 * @description 查詢所有薪資作業
 * @param params
 * @param mode error mode
 * @returns Promise
 */
export function getSalaryCalc(params?: GetSalaryCalcParams, mode: ErrorMessageMode = 'message') {
  return defHttp.get<BasicFetchResult<CalcSalaryModel>>(
    { url: '/v1/salary', params },
    { errorMessageMode: mode },
  );
}

/**
 * @description 刪除薪資作業
 * @param id calc id
 * @param mode error mode
 * @returns Promise
 */
export function deleteSalaryCalc(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/salary/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 根據ID獲取薪資作業
 * @param id calc id
 * @param mode error mode
 * @returns Promise
 */
export function getByIDSalaryCalc(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.get<CalcSalaryModel>({ url: `/v1/salary/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 儲存設定
 * @param calcSalaryEmployee
 * @param mode error mode
 * @returns Promise
 */
export function saveCalcEmployee(
  calcSalaryEmployee: CalcSalaryEmployeeModel[],
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put(
    { url: '/v1/salary/calcEmployee', params: { calcSalaryEmployee } },
    { errorMessageMode: mode },
  );
}
