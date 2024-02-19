import request from '@/config/axios'
import { EnterpriseReportType } from './type'

/**
 * 企业进度统计列表
 */
export const getEnterpriseReportApi = (
  data: EnterpriseReportType
): Promise<TableResponse<EnterpriseReportType>> => {
  return request.get({ url: '/progressReport/companyFillingStatistics', params: data })
}

/**
 * 企业区域统计列表
 */
export const enterpriseRegionalStatisticsApi = (params: any) => {
  return request.get({ url: '/progressReport/companyAreaStatistics', params })
}

/**
 * 企业工作组列表
 */
export const enterpriseWorkGroupApi = (params: any) => {
  return request.get({ url: '/progressReport/companyGridStatistics', params })
}
