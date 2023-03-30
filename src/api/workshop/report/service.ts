import request from '@/config/axios'
import { ReportQueryType, ReportUpdateType } from './types'

// 获取报告列表
export const getReportListApi = (
  query: Partial<ReportQueryType>
): Promise<TableResponse<ReportQueryType>> => {
  return request.get({ url: '/report', params: query })
}

/**
 * 查看单个报告
 * @param {Object} id 报告 ID
 */
export const getReportByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/report/${id}` })
}

/**
 * 更新报告表
 * @param {Object} data
 */
export const updateReportApi = (data: ReportUpdateType): Promise<ReportUpdateType> => {
  return request.post({ url: '/report/update', data })
}

/**
 * 新增报告表
 * @param {Object} data
 */
export const addReportApi = (data: ReportUpdateType): Promise<ReportUpdateType> => {
  return request.post({ url: '/report/create', data })
}

/**
 * 删除报告表
 * @param {Object} id
 */
export const delReportByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/report/delete/${id}` })
}
