import request from '@/config/axios'
import { FamilyIncomeDtoType, FamilyIncomeOptionType } from './family-types'

/**
 * 查询家庭收入信息列表
 */

export const getFamilyIncomeListApi = (
  query: Partial<FamilyIncomeDtoType>
): Promise<TableResponse<FamilyIncomeDtoType>> => {
  return request.get({ url: '/immigrant_income', params: query })
}

export const getImmigrantManagement = (
  query: Partial<FamilyIncomeDtoType>
): Promise<TableResponse<FamilyIncomeDtoType>> => {
  return request.get({ url: '/immigrantManagement', params: query })
}

/**
 * 保存
 */
export const saveFamilyIncomeListApi = (data: any): Promise<TableResponse<FamilyIncomeDtoType>> => {
  return request.post({ url: '/immigrant_income/createAll', data })
}

export const saveImmigrantManagement = (data: any): Promise<TableResponse<FamilyIncomeDtoType>> => {
  return request.post({ url: '/immigrantManagement/createAll', data })
}
/**
 * 获取家庭收入配置
 */
export const getFamilyIncomeOptionApi = (
  params
): Promise<TableResponse<FamilyIncomeOptionType>> => {
  return request.get({ url: '/immigrant_income_config', params })
}
