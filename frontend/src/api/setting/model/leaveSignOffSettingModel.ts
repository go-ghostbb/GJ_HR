import { DepartmentModel } from '@/api/manager/model/departmentModel';
import { BasicDatabaseModel } from '@/api/model/baseModel';
import { LeaveModel } from './leaveModel';
import { EmployeeModel } from '@/api/manager/model/employeeModel';

export enum SignType {
  DepartmentManager = 'department manager',
  SpecificEmployee = 'specific employee',
}

export enum SignNotify {
  SignOffPlusNotify = 'sign-off plus notification',
  NotifyOnly = 'notification only',
}

export interface LeaveSignOffSettingModel extends BasicDatabaseModel {
  departmentId?: number;
  department?: DepartmentModel;
  leaveId?: number;
  leave?: LeaveModel;
  level?: number;
  gteDay?: number;
  signType?: SignType;
  specificEmployeeId?: number;
  specificEmployee?: EmployeeModel;
  notify?: SignNotify;
  remark?: string;
}

/**
 * @description GetLeaveSignOffSetting interface parameters
 */
export interface GetLeaveSignOffSettingParams {
  departmentId: number;
  leaveId: number;
}
