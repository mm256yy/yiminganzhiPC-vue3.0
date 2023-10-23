import request from '@/config/axios'
import { CapitalPoolDtoType } from './capitalPool-types'

/**
 * 获取资金池数据
 * @param params
 * @returns
 */
export const getCapitalPoolApi = (params?: CapitalPoolDtoType) => {
  return request.get({ url: `/funReceiptsRecord/capitalPoolSumAmount`, params })
}

/**
 * 获取资金池列表
 * @returns
 */
export const getCapitalPoolListApi = (params?: any) => {
  return request.get({ url: `/funReceiptsRecord`, params })
}
