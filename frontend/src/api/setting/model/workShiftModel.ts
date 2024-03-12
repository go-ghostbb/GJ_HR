import { EmployeeModel } from '@/api/manager/model/employeeModel';
import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';

export interface WorkShiftModel extends BasicDatabaseModel {
  code?: string;
  name?: string;
  status?: boolean;
  remark?: string;
  workStart?: Date;
  workEnd?: Date;
  restStart?: Date;
  restEnd?: Date;
  totalHours?: number;
  color?: string;
}

/**
 * @description GetWorkShiftByKeyword interface parameters
 */
export interface GetWorkShiftByKeywordParams extends BasicPageParams {
  keyword?: string;
  status?: string;
}

export interface WorkScheduleModel extends BasicDatabaseModel {
  scheduleDate?: Date;
  employeeId?: number;
  employee?: EmployeeModel;
  workShiftId?: number;
  workShift?: WorkShiftModel;
}

/**
 * @description GetWorkScheduleByDate interface parameters
 */
export interface GetWorkScheduleByDateParams {
  employeeId?: number;
  start?: string;
  end?: string;
}
