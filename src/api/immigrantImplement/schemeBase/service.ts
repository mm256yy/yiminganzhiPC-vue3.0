import request from '@/config/axios'
import { SchemeBaseType } from './types'

/**
 * 新增方案比选
 * @param data
 * @returns
 */
export const addSchemeBaseApi = (data: SchemeBaseType) => {
  return request.post({
    url: '/immigrantScheme/create',
    data
  })
}

/**
 * 删除方案比选
 * @param id
 * @returns
 */
export const delSchemeBaseApi = (id: number) => {
  return request.post({
    url: `/immigrantScheme/delete/${id}`
  })
}

/**
 * 详情方案比选
 * @param doorNo
 * @returns
 */
export const getSchemeBaseDetailApi = (doorNo: string) => {
  return request.get({
    url: `/immigrantScheme/findByDoorNo`,
    params: {
      doorNo
    }
  })
}

/**
 * 方案比选获取基础信息
 * @param doorNo
 * @returns
 */
export const getSchemeBaseInfoApi = (doorNo: string) => {
  return request.get({
    url: `/immigrantScheme/findSchemeHouseByDoorNo`,
    params: {
      doorNo
    }
  })
}
