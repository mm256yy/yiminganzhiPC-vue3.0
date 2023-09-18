import request from '@/config/axios'
import { FunPaymentType } from './fundPayment-types'

// 获取资金付款列表
export const getFunPaymentListApi = (params?: any): Promise<TableResponse<FunPaymentType>> => {
  return request.get({ url: `/funPayment/list`, params })
}

// 新增资金付款
export const addFunPaymentApi = (data: Partial<FunPaymentType>): Promise<any> => {
  return request.post({
    url: '/funPayment/insert',
    data
  })
}

// 更新资金付款
export const updateFunPaymentApi = (data: Partial<FunPaymentType>): Promise<any> => {
  return request.get({
    url: '/funPayment/update',
    params: data
  })
}

// 更新资金付款
export const deleteFunPaymentApi = (id: number): Promise<void> => {
  return request.get({
    url: '/funPayment/delete',
    params: {
      id
    }
  })
}
