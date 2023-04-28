import request from '@/config/axios'
import { FamilyIncomeDtoType, FamilyIncomeOptionType } from './family-types'
import { globalData } from '@/config/fill'
/**
 * 查询家庭收入信息列表
 */

export const getFamilyIncomeListApi = (
  query: Partial<FamilyIncomeDtoType>
): Promise<TableResponse<FamilyIncomeDtoType>> => {
  return request.get({
    url: '/immigrant_income',
    params: { ...query, status: globalData.currentSurveyStatus }
  })
}

export const getImmigrantManagement = (
  query: Partial<FamilyIncomeDtoType>
): Promise<TableResponse<FamilyIncomeDtoType>> => {
  return request.get({
    url: '/immigrantManagement',
    params: { ...query, status: globalData.currentSurveyStatus }
  })
}

/**
 * 保存
 */
export const saveFamilyIncomeListApi = (
  data: any[]
): Promise<TableResponse<FamilyIncomeDtoType>> => {
  return request.post({
    url: '/immigrant_income/createAll',
    data: data.map((item) => {
      item.status = globalData.currentSurveyStatus
      return item
    })
  })
}

export const saveImmigrantManagement = (
  data: any[]
): Promise<TableResponse<FamilyIncomeDtoType>> => {
  return request.post({
    url: '/immigrantManagement/createAll',
    data: data.map((item) => {
      item.status = globalData.currentSurveyStatus
      return item
    })
  })
}
/**
 * 获取家庭收入配置
 */
export const getFamilyIncomeOptionApi = (
  params
): Promise<TableResponse<FamilyIncomeOptionType>> => {
  return request.get({ url: '/immigrant_income_config', params })
}
