import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { BasicFetchResult } from '../model/baseModel';
import {
  GetWorkScheduleByDateParams,
  GetWorkShiftByKeywordParams,
  WorkScheduleModel,
  WorkShiftModel,
} from './model/workShiftModel';

/**
 * @description 根據keyword獲取workShift
 * @param params 查詢參數
 * @param mode
 */
export function getWorkShiftByKeyword(
  params?: GetWorkShiftByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<WorkShiftModel>>(
    { url: '/v1/workShift', params },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description 建立workShift
 * @param params workShift參數
 * @param mode error mode
 * @returns Promise
 */
export function createWorkShift(params: WorkShiftModel, mode: ErrorMessageMode = 'message') {
  return defHttp.post({ url: '/v1/workShift', params }, { errorMessageMode: mode });
}

/**
 * @description 更新workShift
 * @param id workShift id
 * @param params workShift 參數
 * @param mode error mode
 * @returns Promise
 */
export function updateWorkShift(
  id: number,
  params: WorkShiftModel,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put({ url: `/v1/workShift/${id}`, params }, { errorMessageMode: mode });
}

/**
 * @description 刪除workShift
 * @param id workShift id
 * @param mode error mode
 * @returns Promise
 */
export function deleteWorkShift(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/workShift/${id}` }, { errorMessageMode: mode });
}

/**
 * @description 設置狀態
 * @param id workShift id
 * @param status 狀態
 * @param mode error mode
 * @returns Promise
 */
export function setStatus(id: number, status: boolean, mode: ErrorMessageMode = 'message') {
  return defHttp.patch(
    { url: `/v1/workShift/${id}/status`, params: { status } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 查詢work schedule
 * @param params 查詢條件
 * @param mode error mode
 * @returns Promise
 */
export function getWorkScheduleByDate(
  params: GetWorkScheduleByDateParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get({ url: '/v1/workShift/schedule', params }, { errorMessageMode: mode });
}

/**
 * @description 批量更新schedule
 * @param employeeId employee id
 * @param yearMonth
 * @param schedules WorkScheduleModel[]
 * @param mode error mode
 * @returns Promise
 */
export function updateWorkScheduleBatch(
  employeeId: number,
  yearMonth: string,
  schedules: WorkScheduleModel[],
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.put(
    { url: `/v1/workShift/schedule/${employeeId}/batch`, params: { schedules, yearMonth } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 刪除班表
 * @param id
 * @param mode
 */
export function deleteWorkSchedule(id: number, mode: ErrorMessageMode = 'message') {
  return defHttp.delete({ url: `/v1/workShift/schedule/${id}` }, { errorMessageMode: mode });
}
