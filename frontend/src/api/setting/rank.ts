import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { GetRankByKeywordParams, PositionRankModel } from './model/positionRankModel';
import { BasicFetchResult } from '../model/baseModel';

/**
 * @description 根據keyword獲取rank
 * @param params 查詢參數
 */
export function getRankByKeyword(
  params: GetRankByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<PositionRankModel>>(
    { url: '/v1/rank', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 建立rank
 * @param params rank參數
 * @param mode error mode
 * @returns Promise
 */
export function createRank(params: PositionRankModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/rank', params }, { errorMessageMode: mode });
}

/**
 * @description 更新rank
 * @param id rank id
 * @param params rank 參數
 * @param mode error mode
 * @returns Promise
 */
export function updateRank(
  id: number,
  params: PositionRankModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put({ url: `/v1/rank/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除rank
 * @param id rank id
 * @param mode error mode
 * @returns Promise
 */
export function deleteRank(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/rank/${id}` }, { errorMessageMode: mode });
}
