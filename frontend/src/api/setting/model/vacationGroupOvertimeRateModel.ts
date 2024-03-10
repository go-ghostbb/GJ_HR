import { BasicDatabaseModel } from '@/api/model/baseModel';
import { VacationGroupModel } from './vacationGroupModel';

export interface VacationGroupOvertimeRateModel extends BasicDatabaseModel {
  vacationGroupId?: number;
  vacationGroup?: VacationGroupModel;
  hours?: number;
  multiply?: number;
  level?: number;
  isFill?: boolean;
  fill?: number;
}
