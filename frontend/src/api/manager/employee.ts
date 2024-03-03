import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { EmployeeModel, GetEmployeeByKeywordParams } from './model/employeeModel';

export function getEmployeeByKeyword(
  params: GetEmployeeByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<EmployeeModel[]>(
    { url: '/v1/employee', params },
    {
      errorMessageMode: mode,
    },
  );
}
