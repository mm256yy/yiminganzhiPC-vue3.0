import request from '@/config/axios'
import { EnterpriseReportType } from './type'

/**
 * 企业列表
 */
export const getEnterpriseReportApi = (
  data: EnterpriseReportType
): Promise<TableResponse<EnterpriseReportType>> => {
  return request.get({ url: '/progressReport/companyFillingStatistics', params: data })
}
