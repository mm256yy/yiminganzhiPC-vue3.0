import request from '@/config/axios'
import { AgreeInfoType } from './types'

/**
 * 新增填写协议
 * @param data
 * @returns
 */
export const addAgreeInfoApi = (data: AgreeInfoType) => {
  return request.post({
    url: '/immigrantSign/create',
    data
  })
}

/**
 * 更新填写协议
 * @param data
 * @returns
 */
export const updateAgreeInfoApi = (data: AgreeInfoType) => {
  return request.post({
    url: '/immigrantSign/update',
    data
  })
}

/**
 * 查询填写协议
 * @param id
 * @returns
 */
export const getAgreeInfoApi = (doorNo: string) => {
  return request.get({
    url: '/immigrantSign/findByDoorNo',
    params: {
      doorNo
    }
  })
}

/**
 * 行政下拉
 * @param id
 * @returns
 */
export const getDistrictApi = (name: string | null = null) => {
  return request.get({
    url: '/district',
    params: {
      districtType: 'Village',
      name,
      size: 999
    }
  })
}
