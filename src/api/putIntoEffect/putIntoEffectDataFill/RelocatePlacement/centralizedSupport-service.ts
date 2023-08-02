import request from '@/config/axios'
import { DemographicDtoType } from './centralizedSupport-types'

/**
 * 查询集中供养人口信息列表
 */
export const getDemographicListApi = (
  query: Partial<DemographicDtoType>
): Promise<TableResponse<DemographicDtoType>> => {
  return request.get({
    url: '/demographic',
    params: {
      status: 'implementation',
      ...query
    }
  })
}
