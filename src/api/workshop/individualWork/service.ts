import request from '@/config/axios'
import { IndividualWorkType } from './types'

/**
 * 个体户按工作区
 */

export const getIndividualWorkListApi = (
  data: IndividualWorkType
): Promise<TableResponse<IndividualWorkType>> => {
  return request.get({ url: '/progressReport/individualGridStatistics', params: data })
}
