import { BasicDatabaseModel } from '@/api/model/baseModel';
import { EmployeeModel } from '@/api/manager/model/employeeModel';
import { LeaveModel } from '@/api/setting/model/leaveModel';

export interface LeaveCorrectModel extends BasicDatabaseModel {
  employeeId?: number;
  employee?: EmployeeModel;
  leaveId?: number;
  leave?: LeaveModel;
  effective?: string;
  expired?: string;
  available?: number;
  used?: number;
  signing?: number;
  isDefer?: boolean;
}
