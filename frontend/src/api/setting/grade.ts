import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { GetGradeByKeywordParams, PositionGradeModel } from './model/positionGradeModel';
import { BasicFetchResult } from '../model/baseModel';

/**
 * @description 根據keyword獲取grade
 * @param params 查詢參數
 */
export function getGradeByKeyword(
  params: GetGradeByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<PositionGradeModel>>(
    { url: '/v1/grade', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 建立grade
 * @param params grade參數
 * @param mode error mode
 * @returns Promise
 */
export function createGrade(params: PositionGradeModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/grade', params }, { errorMessageMode: mode });
}

/**
 * @description 更新grade
 * @param id grade id
 * @param params grade 參數
 * @param mode error mode
 * @returns Promise
 */
export function updateGrade(
  id: number,
  params: PositionGradeModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put({ url: `/v1/grade/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除grade
 * @param id grade id
 * @param mode error mode
 * @returns Promise
 */
export function deleteGrade(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/grade/${id}` }, { errorMessageMode: mode });
}
