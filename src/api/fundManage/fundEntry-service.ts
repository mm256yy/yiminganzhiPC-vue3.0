import request from '@/config/axios'
import { FundEntryType } from './fundEntry-types'

// 获取资金入账列表
export const getFundEntryListApi = (params?: any): Promise<TableResponse<FundEntryType>> => {
  return request.get({
    url: `/funReceiptsRecord`,
    params: {
      ...params,
      type: '1'
    }
  })
}

// 新增资金入账
export const addFundEntryApi = (data: Partial<FundEntryType>): Promise<any> => {
  return request.post({
    url: '/funReceiptsRecord/create',
    data: {
      ...data,
      type: '1'
    }
  })
}

// 更新资金入账
export const updateFundEntryApi = (data: Partial<FundEntryType>): Promise<any> => {
  return request.post({
    url: '/funReceiptsRecord/update',
    data: {
      ...data,
      type: '1'
    }
  })
}

// 删除资金入账
export const deleteFundEntryApi = (id: number): Promise<void> => {
  return request.post({
    url: `/funReceiptsRecord/delete/${id}`
  })
}

// 查询单个资金入账
export const getFundEntryByIdApi = (id: number): Promise<FundEntryType> => {
  return request.get({
    url: `/funReceiptsRecord/${id}`
  })
}

// 查询资金入账总金额
export const getSumAmountApi = (params?: any) => {
  return request.get({ url: `/funReceiptsRecord/sumAmount`, params })
}

// 法人
// 获取资金入账列表
export const getLegalFundEntryListApi = (params?: any): Promise<TableResponse<FundEntryType>> => {
  return request.get({
    url: `/funIncome`,
    params: {
      ...params
    }
  })
}

// 新增资金入账
export const addLegalFundEntryApi = (data: Partial<FundEntryType>): Promise<any> => {
  return request.post({
    url: '/funIncome/save',
    data: {
      ...data
    }
  })
}

// 更新资金入账
export const updateFundEntryApiLegal = (data: Partial<FundEntryType>): Promise<any> => {
  return request.post({
    url: '/funIncome/update',
    data: {
      ...data
    }
  })
}

// 删除资金入账
export const deleteFundEntryApiLegal = (id: number): Promise<void> => {
  return request.post({
    url: `/funIncome/delete/${id}`
  })
}

// 查询资金入账总金额
export const getFundEntryByIdApiLegal = (params?: any) => {
  return request.get({ url: `/funIncome/getById`, params })
}

// 查询资金入账总金额
export const getSumAmountApiLegal = (params?: any) => {
  return request.get({ url: `/funIncome/sumAmount`, params })
}

// 法人
// 查询资金预拨详情
export const getfunReceiptsRecord = (id: number): Promise<void> => {
  return request.get({
    url: `/funReceiptsRecord/${id}`
  })
}
// 查询资金支付详情
export const getfunPay = (id: number): Promise<void> => {
  return request.get({
    url: `/funPay/${id}`
  })
}
