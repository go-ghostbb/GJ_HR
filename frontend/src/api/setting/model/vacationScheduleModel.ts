import { BasicDatabaseModel } from '@/api/model/baseModel';
import { VacationModel } from './vacationModel';

export enum VacationScheduleRepeat {
  RepeatNone = 'none',
  RepeatWeek = 'week',
  RepeatMonth = 'month',
  RepeatYear = 'year',
}

export interface VacationScheduleModel extends BasicDatabaseModel {
  scheduleDate?: Date;
  generalKey?: string;
  vacationId?: number;
  vacation?: VacationModel;
  startDate?: Date;
  endDate?: Date;
  repeat?: VacationScheduleRepeat;
  endRepeat?: Date;
}

/**
 * @description GetVacationScheduleByDate interface parameters
 */
export interface GetVacationScheduleByDateParams {
  start?: string;
  end?: string;
}
