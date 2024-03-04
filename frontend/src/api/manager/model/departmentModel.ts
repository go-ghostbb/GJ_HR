import { BasicDatabaseModel } from '@/api/model/baseModel';
import { EmployeeModel } from './employeeModel';

/**
 * @description Department interface result
 */
export interface DepartmentModel extends BasicDatabaseModel {
  parentId?: number;
  code?: string;
  name?: string;
  remark?: string;
  managerId?: number;
  manager?: EmployeeModel;
  children?: DepartmentModel[];
}

/**
 * @description GetDepartmentByKeyword interface parameters
 */
export interface GetDepartmentByKeywordParams {
  keyword?: string;
  status?: string;
}
