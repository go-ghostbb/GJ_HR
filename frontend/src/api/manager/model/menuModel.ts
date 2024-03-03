import { BasicDatabaseModel } from '@/api/model/baseModel';
import { RouteMeta } from 'vue-router';

export enum ShowType {
  SOFTWARE = 'software',
  WEB = 'web',
}

/**
 * @description: GetMenuByKeyword interface parameters
 */
export interface GetMenuByKeywordParams {
  keyword?: string;
  status?: string;
  show: ShowType;
}

/**
 * @description Menu interface result
 */
export interface MenuModel extends BasicDatabaseModel {
  type?: string;
  show?: string;
  parentId?: number;
  path?: string;
  name?: string;
  component?: string;
  redirect?: string;
  sort?: number;
  status?: boolean;
  meta?: RouteMeta;
  children?: MenuModel[];
}
