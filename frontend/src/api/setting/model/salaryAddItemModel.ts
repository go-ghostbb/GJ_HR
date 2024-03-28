import { EmployeeModel } from '@/api/manager/model/employeeModel';
import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';

export enum SalaryType {
  FixedSalary = 'fixed',
  NonFixedSalary = 'non-fixed',
}

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

export interface SalaryAddItemModel extends BasicDatabaseModel {
  name?: string;
  salaryType?: SalaryType;
  incomeTax?: boolean;
  benefits?: boolean;
  premiums?: boolean;
  amount?: number;
  calcType?: SalaryCalcType;
  monthCalc?: boolean;
  unit?: SalaryCalcUnit;
  operator?: Operator;
  argument?: number;
  employee?: EmployeeModel[];
}

/**
 * @description GetSalaryAddItemByKeyword interface parameters
 */
export interface GetSalaryAddItemByKeywordParams extends BasicPageParams {
  keyword?: string;
}
