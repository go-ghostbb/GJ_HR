import { EmployeeModel } from '@/api/manager/model/employeeModel';
import { BasicDatabaseModel } from '@/api/model/baseModel';
import { VacationModel } from './vacationModel';

export interface VacationScheduleModel extends BasicDatabaseModel {
  scheduleDate?: Date[];
  employeeId?: number;
  employee?: EmployeeModel;
  vacationId?: number;
  vaaction?: VacationModel;
}
