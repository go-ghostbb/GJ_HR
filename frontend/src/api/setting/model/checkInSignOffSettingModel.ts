import { BasicDatabaseModel } from '@/api/model/baseModel';
import { SignNotify, SignType } from './leaveSignOffSettingModel';
import { EmployeeModel } from '@/api/manager/model/employeeModel';

export interface CheckInSignOffSettingModel extends BasicDatabaseModel {
  level?: number;
  signType?: SignType;
  specificEmployeeId?: number;
  specificEmployee?: EmployeeModel;
  notify?: SignNotify;
  remark?: string;
}
