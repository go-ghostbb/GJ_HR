import { DepartmentModel } from '@/api/manager/model/departmentModel';
import { VacationModel } from './vacationModel';
import { EmployeeModel } from '@/api/manager/model/employeeModel';
import { BasicDatabaseModel } from '@/api/model/baseModel';

export enum SignType {
  DepartmentManager = 'department manager',
  SpecificEmployee = 'specific employee',
}

export enum SignNotify {
  SignOffPlusNotify = 'sign-off plus notification',
  NotifyOnly = 'notification only',
}

export interface OvertimeSignOffSettingModel extends BasicDatabaseModel {
  departmentId?: number;
  department?: DepartmentModel;
  vacationId?: number;
  vacation?: VacationModel;
  level?: number;
  gteHour?: number;
  signType?: SignType;
  specificEmployeeId?: number;
  specificEmployee?: EmployeeModel;
  notify?: SignNotify;
  remark?: string;
}

/**
 * @description GetOvertimeSignOffSetting interface parameters
 */
export interface GetOvertimeSignOffSettingParams {
  departmentId: number;
  vacationId: number;
}
