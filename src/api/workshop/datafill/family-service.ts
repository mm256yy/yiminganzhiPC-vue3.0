import request from '@/config/axios'
import { FamilyIncomeDtoType } from './family-types'

/**
 * 查询家庭收入信息列表
 */

export const getFamilyIncomeListApi = (
  query: Partial<FamilyIncomeDtoType>
): Promise<TableResponse<FamilyIncomeDtoType>> => {
  return request.get({ url: '/immigrant_income', params: query })
}

/**
 * 保存
 */
export const saveFamilyIncomeListApi = (data: any): Promise<TableResponse<FamilyIncomeDtoType>> => {
  return request.post({ url: '/immigrant_income/createAll', data })
}
