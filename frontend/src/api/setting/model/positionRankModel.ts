import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';
import { PositionGradeModel } from './positionGradeModel';

export interface PositionRankModel extends BasicDatabaseModel {
  code?: string;
  name?: string;
  remark?: string;
  grade?: PositionGradeModel[];
}

/**
 * @description GetRankByKeyword interface parameters
 */
export interface GetRankByKeywordParams extends BasicPageParams {
  keyword?: string;
}
