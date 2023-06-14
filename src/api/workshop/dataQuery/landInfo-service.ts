import request from '@/config/axios'
import { LandInfoType } from './landInfo-types'

/**
 * 土地列表
 */

export const getLandInfoApi = (params: LandInfoType) => {
  return request.get({
    url: '/query/queryGround',
    params
  })
}

/**
 * 导出
 */
export const exportLandInfoApi = (params: { villageCode: string; type: string }) => {
  return request.get({ url: '/query/exportGround', params, responseType: 'blob' })
}
