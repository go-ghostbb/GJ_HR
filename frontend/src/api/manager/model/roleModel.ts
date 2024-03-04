import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';
import { PermissionModel } from './permissionModel';
import { MenuModel } from './menuModel';

export interface RoleModel extends BasicDatabaseModel {
  code?: string;
  name?: string;
  status?: boolean;
  remark?: string;
  permissions?: PermissionModel[];
  menus?: MenuModel[];
}

/**
 * @description: GetRoleByKeyword interface parameters
 */
export interface GetRoleByKeywordParams extends BasicPageParams {
  keyword?: string;
  status?: string;
}
