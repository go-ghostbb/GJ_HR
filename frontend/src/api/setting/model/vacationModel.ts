import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';
import { VacationScheduleModel } from './vacationScheduleModel';
import { VacationGroupOvertimeRateModel } from './vacationGroupOvertimeRateModel';

export interface VacationModel extends BasicDatabaseModel {
  code?: string;
  name?: string;
  status?: boolean;
  remark?: string;
  color?: string;
  schedule?: VacationScheduleModel[];
  overtimeRate?: VacationGroupOvertimeRateModel[];
}

/**
 * @description GetVacationByKeyword interface parameters
 */
export interface GetVacationByKeywordParams extends BasicPageParams {
  keyword?: string;
  status?: string;
}
