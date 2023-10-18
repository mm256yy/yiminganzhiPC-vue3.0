import request from '@/config/axios'
import { FunPayType } from './fundPayment-types'

// 获取资金支付列表
export const getFunPayListApi = (params?: any): Promise<TableResponse<FunPayType>> => {
  return request.get({ url: `/funPay/list`, params })
}

// 新增资金支付
export const addFunPayApi = (data: Partial<FunPayType>): Promise<any> => {
  return request.post({
    url: '/funPay/insert',
    data
  })
}

// 更新资金支付
export const updateFunPayApi = (data: Partial<FunPayType>): Promise<any> => {
  return request.post({
    url: '/funPay/update',
    data
  })
}

// 更新资金支付
export const deleteFunPayApi = (id: number): Promise<void> => {
  return request.get({
    url: '/funPay/delete',
    params: {
      id
    }
  })
}

// 资金支付详情
export const getFunPayByIdApi = (id: number): Promise<FunPayType> => {
  return request.get({
    url: `/funPay/${id}`
  })
}

// 法人列表
export const getLpListApi = (): Promise<void> => {
  return request.get({
    url: '/funPay/lpList'
  })
}

// 资金支付总额
export const getFunPaySumAmountApi = (): Promise<void> => {
  return request.get({
    url: '/funPay/sumAmount'
  })
}
