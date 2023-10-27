import request from '@/config/axios'
import { IndividualRegionType } from './type'

/**
 * 企业列表
 */
export const IndividualRegionApi = (
  data: IndividualRegionType
): Promise<TableResponse<IndividualRegionType>> => {
  return request.get({ url: '/progressReport/individualFillingStatistics', params: data })
}
