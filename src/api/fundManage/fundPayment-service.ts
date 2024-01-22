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
//查询资金发放
export const getFunAmountGrant = (params?: any): Promise<TableResponse<FunPayType>> => {
  return request.get({
    url: '/funAmountGrant',
    params
  })
}
//企业基本情况 /api
export const getEnterprise = (params?: any): Promise<TableResponse<FunPayType>> => {
  return request.get({
    url: '/resultForms/enterprise',
    params
  })
}
//资金发放情况
export const getDetailsList = (params?: any): Promise<TableResponse<FunPayType>> => {
  return request.get({
    url: '/funAmountGrant/detailsList',
    params
  })
}
//资金发放情况 查看
export const getFindByDoorNo = (params?: any): Promise<TableResponse<FunPayType>> => {
  return request.get({
    url: '/funAmountGrant/findByDoorNo',
    params
  })
}
//企业房屋
export const getEnterpriseAppendant = (params?: any): Promise<TableResponse<FunPayType>> => {
  return request.get({
    url: '/resultForms/enterpriseAppendant',
    params
  })
}
// 企业果树
export const getEnterpriseTree = (params?: any): Promise<TableResponse<FunPayType>> => {
  return request.get({
    url: '/resultForms/enterpriseTree',
    params
  })
}
// 资金发放金额
export const getSumAmount = (params?: any): Promise<TableResponse<FunPayType>> => {
  return request.get({
    url: 'funAmountGrant/sumAmount',
    params
  })
}
//资金发放 funAmountGrant/grant
export const postGrant = (data: Partial<FunPayType>): Promise<any> => {
  return request.post({
    url: '/funAmountGrant/grant',
    data
  })
}
//个人房屋 /api/
export const getIndividualHouseholdAppendant = (
  params?: any
): Promise<TableResponse<FunPayType>> => {
  return request.get({
    url: '/resultForms/individualHouseholdAppendant',
    params
  })
}
// 个人果树
export const getIndividualHouseholdTree = (params?: any): Promise<TableResponse<FunPayType>> => {
  return request.get({
    url: '/resultForms/individualHouseholdTree',
    params
  })
}
//分户列表
export const getSeparateList = (params?: any): Promise<any> => {
  return request.get({
    url: '/peasantHousehold/separateList',
    params
  })
}
//分户提交
export const postSeparate = (data: Partial<FunPayType>): Promise<any> => {
  return request.post({
    url: '/peasantHousehold/separate',
    data
  })
}
// 合户
export const postMerge = (data: any): Promise<any> => {
  return request.post({
    url: '/peasantHousehold/merge',
    data
  })
}

// 导出报表
export const exportReportApi = (params: any) => {
  return request.get({
    url: `/resultForms/export/enterprise`,
    params,
    responseType: 'blob'
  })
}

/**
 * 个体户房屋及附属物
 */
export const requestIndividualHouseholdTree = (params: any) => {
  return request.get({
    url: `/resultForms/new/individualHouseholdTree`,
    params
  })
}

/**
 * 个体户房屋及附属物（导出）
 * @returns
 */
export const exportIndividualHouseholdTree = (params: any) => {
  return request.get({
    url: `/resultForms/export/new/individualHouseholdTree`,
    params,
    responseType: 'blob'
  })
}

export const getfindByDoorNoAndType = (data: any): Promise<any> => {
  return request.get({
    url: '/funAmountGrant/findByDoorNoAndType',
    data
  })
}
