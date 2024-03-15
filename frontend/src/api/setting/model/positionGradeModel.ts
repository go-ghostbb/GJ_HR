import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';
import { PositionRankModel } from './positionRankModel';

export interface PositionGradeModel extends BasicDatabaseModel {
  code?: string;
  name?: string;
  remark?: string;
  rankId?: number;
  rank?: PositionRankModel;
}

/**
 * @description GetGradeByKeyword interface parameters
 */
export interface GetGradeByKeywordParams extends BasicPageParams {
  keyword?: string;
  rankId: number;
}
