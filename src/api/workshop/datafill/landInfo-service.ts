import request from '@/config/axios'
import { LandInfoDetailType, LandInfoListType } from './landInfo-types'

/**
 * 查询安置意愿信息列表
 */

export const getLandInfoDetailtApi = (params: LandInfoDetailType) => {
  return request.get({
    url: '/immigrantGround/findByDoorNoAndStatus',
    params
  })
}

/**
 * 保存
 */
export const saveLandInfoListApi = (data: LandInfoListType[]) => {
  return request.post({
    url: '/immigrantGround/createAll',
    data
  })
}
