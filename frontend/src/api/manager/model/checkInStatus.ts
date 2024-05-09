import { BasicDatabaseModel } from '@/api/model/baseModel';
import { EmployeeModel } from './employeeModel';
import { WorkShiftModel } from '@/api/setting/model/workShiftModel';

export enum WorkAttendStatus {
  WorkNormal = 'normal',
  WorkNotSwiped = 'not swiped',
  WorkLate = 'late',
  WorkOffDay = 'off day',
}

export enum CheckInProcStatus {
  ProcNormal = 'normal',
  NotProcessed = 'not processed',
  Processed = 'processed',
}

export enum OffWorkAttendStatus {
  OffWorkNormal = 'normal',
  OffWorkNotSwiped = 'not swiped',
  OffWorkEarly = 'early',
  OffWorkOffDay = 'off day',
}

export interface CheckInStatusModel extends BasicDatabaseModel {
  employeeId?: number;
  employee?: EmployeeModel;
  workShiftId?: number;
  workShift?: WorkShiftModel;
  date?: string;
  workCheckIn?: string;
  workAttendStatus?: WorkAttendStatus;
  workAttendProcStatus?: CheckInProcStatus;
  offWorkCheckIn?: string;
  offWorkAttendStatus?: OffWorkAttendStatus;
  offWorkAttendProcStatus?: CheckInProcStatus;
  absenceHours?: number;
  leaveHours?: number;
  signLeaveHours?: number;
  overtimeHours?: number;
  signOvertimeHours?: number;
}
