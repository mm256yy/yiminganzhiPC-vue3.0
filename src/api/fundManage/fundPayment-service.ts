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

// 法人列表
export const getLpList = (): Promise<void> => {
  return request.get({
    url: '/funPay/lpList'
  })
}

// 资金支付总额
export const getFunPaySumAmount = (): Promise<void> => {
  return request.get({
    url: '/funPay/sumAmount'
  })
}
