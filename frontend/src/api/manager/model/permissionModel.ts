import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';
import { RoleModel } from './roleModel';

export interface PermissionModel extends BasicDatabaseModel {
  perm?: string;
  name?: string;
  status?: boolean;
  remark?: string;
  roles?: RoleModel[];
}

/**
 * @description: GetPermByKeyword interface parameters
 */
export interface GetPermByKeywordParams extends BasicPageParams {
  keyword?: string;
  status?: string;
}
