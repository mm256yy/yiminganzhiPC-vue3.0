import request from '@/config/axios'
import { FundEntryType } from './fundEntry-types'

// 获取资金入账列表
export const getFundEntryListApi = (params?: any): Promise<TableResponse<FundEntryType>> => {
  return request.get({ url: `/funRrd/list`, params })
}

// 新增资金入账
export const addFundEntryApi = (data: Partial<FundEntryType>): Promise<any> => {
  return request.post({
    url: '/funRrd/insert',
    data
  })
}

// 更新资金入账
export const updateFundEntryApi = (data: Partial<FundEntryType>): Promise<any> => {
  return request.get({
    url: '/funRrd/update',
    params: data
  })
}

// 更新资金入账
export const deleteFundEntryApi = (id: number): Promise<void> => {
  return request.get({
    url: '/funRrd/delete',
    params: {
      id
    }
  })
}
