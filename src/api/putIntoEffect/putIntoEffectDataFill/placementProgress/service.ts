import request from '@/config/axios'
import { PlacementProgressType } from './types'

/**
 * 安置进度详情
 * @param doorNo
 * @returns
 */
export const getPlacementProgressApi = (doorNo: string) => {
  return request.get({
    url: `/immigrantProgress/findByDoorNo`,
    params: {
      doorNo
    }
  })
}

/**
 * 安置进度新增
 * @returns
 */
export const addPlacementProgressApi = (data: PlacementProgressType) => {
  return request.post({
    url: '/immigrantProgress/create',
    data
  })
}

/**
 * 安置进度更新
 * @returns
 */
export const editPlacementProgressApi = (data: PlacementProgressType) => {
  return request.post({
    url: '/immigrantProgress/update',
    data
  })
}
