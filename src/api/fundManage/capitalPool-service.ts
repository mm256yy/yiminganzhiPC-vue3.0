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

// 获取 付款审核 概算审核
export const getpayApi = () => {
  return request.get({ url: `/funPaymentRequest/handlerInfo` })
}

/**
 * 获取资金池列表
 * @returns
 */
export const getCapitalPoolListApi = (params?: any) => {
  return request.get({ url: `/funReceiptsRecord`, params })
}

// 法人
// 获取资金池数据 资金记录
export const getpoolSumAmountLegal = (params?: CapitalPoolDtoType) => {
  return request.get({ url: `/funIncome/poolSumAmount`, params })
}
// 获取资金池数据
export const getCapitalPoolApiLegal = (params?: CapitalPoolDtoType) => {
  return request.get({ url: `/funIncome/poolAmount`, params })
}

// 获取资金池列表
export const getCapitalPoolListApiLegal = (params?: any) => {
  return request.get({ url: `/funIncome/findPoolPage`, params })
}
