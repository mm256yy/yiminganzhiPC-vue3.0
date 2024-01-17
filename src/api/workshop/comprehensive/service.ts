import request from '@/config/axios'
import { ComprehensiveReportType } from './types'

/**
 * 交通/电力/移动联通铁塔电信/文物
 */
export const getComprehensiveReportApi = (
  data: ComprehensiveReportType
): Promise<TableResponse<ComprehensiveReportType>> => {
  return request.get({ url: '/progressReport/professionalProjectsStatistics', params: data })
}
