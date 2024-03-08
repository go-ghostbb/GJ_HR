import { BasicDatabaseModel } from '@/api/model/baseModel';
import { LeaveModel } from './leaveModel';
import { EmployeeModel } from '@/api/manager/model/employeeModel';
import { LeaveGroupCondition } from './leaveGroupConditionModel';

export interface LeaveGroupModel extends BasicDatabaseModel {
  leaveId?: number;
  leave?: LeaveModel;
  name?: string;

  employee?: EmployeeModel[];
  leaveGroupCondition?: LeaveGroupCondition[];
}
