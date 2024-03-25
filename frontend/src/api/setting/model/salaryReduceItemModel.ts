import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';

export enum SalaryCalcType {
  DefaultCalc = 'default',
  UnitCalc = 'unit',
  ConditionCalc = 'condition',
}

export enum SalaryCalcUnit {
  DayCalc = 'day',
  HourCalc = 'hour',
}

export enum Operator {
  Eq = '==',
  Gt = '>',
  Gte = '>=',
  Lt = '<',
  Lte = '<=',
}

export interface SalaryReduceItemModel extends BasicDatabaseModel {
  name?: string;
  incomeTax?: boolean;
  amount?: number;
  calcType?: SalaryCalcType;
  monthCalc?: boolean;
  unit?: SalaryCalcUnit;
  operator?: Operator;
  argument?: number;
}

/**
 * @description GetSalaryReduceItemByKeyword interface parameters
 */
export interface GetSalaryReduceItemByKeywordParams extends BasicPageParams {
  keyword?: string;
}
