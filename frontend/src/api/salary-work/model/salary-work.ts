import { EmployeeModel } from '@/api/manager/model/employeeModel';
import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';
import { SalaryAddItemModel, SalaryType } from '@/api/setting/model/salaryAddItemModel';
import { SalaryReduceItemModel } from '@/api/setting/model/salaryReduceItemModel';

export interface CalcSalaryModel extends BasicDatabaseModel {
  founderEmployeeId?: number;
  founder?: EmployeeModel;
  start?: Date;
  end?: Date;
  stage?: number;
  calcSalaryEmployee?: CalcSalaryEmployeeModel[];
}

export interface CalcSalaryEmployeeModel extends BasicDatabaseModel {
  employeeId?: number;
  employee?: EmployeeModel;
  calcSalaryId?: number;
  calcSalary?: CalcSalaryModel;
  salary?: number;
  hourlySalary?: number;
  salaryAdd?: CalcSalaryAddModel[];
  salaryReduce?: CalcSalaryReduceModel[];
}

export interface CalcSalaryAddModel extends BasicDatabaseModel {
  calcSalaryEmployeeId?: number;
  calcSalary?: CalcSalaryEmployeeModel;
  salaryAddItemId?: number;
  salaryAddItem?: SalaryAddItemModel;
  amount?: number;
  salaryType?: SalaryType;
  incomeTax?: boolean;
  benefits?: boolean;
  premiums?: boolean;
}

export interface CalcSalaryReduceModel extends BasicDatabaseModel {
  calcSalaryEmployeeId?: number;
  calcSalary?: CalcSalaryEmployeeModel;
  salaryReduceItemId?: number;
  salaryReduceItem?: SalaryReduceItemModel;
  amount?: number;
  incomeTax?: boolean;
}

export interface CalaSalaryParams {
  employeeId: number[];
  dateRangeStart: string;
  dateRangeEnd: string;
}

/**
 * @description: GetSalaryCalc interface parameters
 */
export interface GetSalaryCalcParams extends BasicPageParams {}
