import { BasicDatabaseModel } from '@/api/model/baseModel';
import { RoleModel } from './roleModel';

/**
 * @description Employee interface result
 */
export interface EmployeeModel extends BasicDatabaseModel {
  hireDate?: Date;
  terminationDate?: Date;
  employmentStatus?: string;
  backend?: boolean;
  realName?: string;
  nationalId?: string;
  birth?: Date;
  email?: string;
  mobile?: string;
  avatar?: string;
  loginInformation?: LoginInformationModel;
  roles?: RoleModel[];
  departmentId?: number;
}

/**
 * @description 登入資訊
 */
export interface LoginInformationModel extends BasicDatabaseModel {
  employeeId: number;
  status: boolean;
  account: string;
  password: string;
}

/**
 * @description GetEmployeeByKeyword interface parameters
 */
export interface GetEmployeeByKeywordParams {
  keyword?: string;
  employmentStatus?: string;
  departmentId?: number;
}
