import { BasicDatabaseModel } from '@/api/model/baseModel';
import { VacationModel } from './vacationModel';

export enum VacationScheduleRepeat {
  RepeatNone = 'none',
  RepeatWeek = 'week',
  RepeatMonth = 'month',
  RepeatYear = 'year',
}

export interface VacationScheduleModel extends BasicDatabaseModel {
  scheduleDate?: string;
  generalKey?: string;
  vacationId?: number;
  vacation?: VacationModel;
  startDate?: string;
  endDate?: string;
  repeat?: VacationScheduleRepeat;
  endRepeat?: string;
}

/**
 * @description GetVacationScheduleByDate interface parameters
 */
export interface GetVacationScheduleByDateParams {
  start?: string;
  end?: string;
}
