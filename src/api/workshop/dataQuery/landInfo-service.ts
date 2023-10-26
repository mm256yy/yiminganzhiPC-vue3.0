import request from '@/config/axios'
import { LandInfoType } from './landInfo-types'

// 查询土地公示列表
export const getLandInfoApi = (
  params: Partial<LandInfoType>
): Promise<TableResponse<LandInfoType>> => {
  return request.get({
    url: '/resultForms/queryGround',
    params
  })
}
