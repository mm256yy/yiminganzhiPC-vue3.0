import request from '@/config/axios'
import {
  ResettlementDtoType,
  ResettlementParamsType,
  ResettlementConfigType,
  ResettlementConfigParamsType
} from './resettlement-types'

/**
 * 查询安置意愿信息列表
 */

export const getResettlementListApi = (
  query: ResettlementParamsType
): Promise<TableResponse<ResettlementDtoType>> => {
  return request.get({ url: '/immigrant_will', params: query })
}

/**
 * 保存
 */
export const saveResettlementListApi = (
  data: ResettlementDtoType
): Promise<TableResponse<ResettlementDtoType>> => {
  return request.post({ url: data.id ? '/immigrant_will/update' : '/immigrant_will/create', data })
}

/**
 * 配置信息
 */

export const getResettlementConfigApi = (
  query: Partial<ResettlementConfigParamsType>
): Promise<TableResponse<ResettlementConfigType>> => {
  return request.get({ url: '/immigrant_will_config', params: query })
}
