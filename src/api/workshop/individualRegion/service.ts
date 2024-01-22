import request from '@/config/axios'

/**
 * 个体户进度明细列表
 */
export const individualProgressRegionApi = (params: any) => {
  return request.get({ url: '/progressReport/individualFillingStatistics', params })
}

/**
 * 个体户区域统计列表
 * @param data
 * @returns
 */
export const individualRegionApi = (params: any) => {
  return request.get({ url: '/progressReport/individualAreaStatistics', params })
}

/**
 * 个体户工作组列表
 */
export const individualWorkGroupApi = (params: any) => {
  return request.get({ url: '/progressReport/individualGridStatistics', params })
}
