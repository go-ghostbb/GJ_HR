import { BasicDatabaseModel } from '@/api/model/baseModel';
import { EmployeeModel } from '@/api/manager/model/employeeModel';
import { VacationModel } from './vacationModel';
import { VacationGroupOvertimeRateModel } from './vacationGroupOvertimeRateModel';

export interface VacationGroupModel extends BasicDatabaseModel {
  vacationId?: number;
  vacation?: VacationModel;
  name?: string;

  employee?: EmployeeModel[];
  vacationGroupOvertimeRate?: VacationGroupOvertimeRateModel[];
}
