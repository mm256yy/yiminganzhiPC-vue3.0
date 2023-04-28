import request from '@/config/axios'
import {
  ResettlementDtoType,
  ResettlementParamsType,
  ResettlementConfigType,
  ResettlementConfigParamsType
} from './resettlement-types'
import { globalData } from '@/config/fill'

/**
 * 查询安置意愿信息列表
 */

export const getResettlementListApi = (
  query: ResettlementParamsType
): Promise<TableResponse<ResettlementDtoType>> => {
  return request.get({
    url: '/immigrant_will',
    params: { ...query, status: globalData.currentSurveyStatus }
  })
}

/**
 * 保存
 */
export const saveResettlementListApi = (
  data: ResettlementDtoType
): Promise<TableResponse<ResettlementDtoType>> => {
  return request.post({
    url: '/immigrant_will/save',
    data: { ...data, status: globalData.currentSurveyStatus }
  })
}

/**
 * 配置信息
 */

export const getResettlementConfigApi = (
  query: Partial<ResettlementConfigParamsType>
): Promise<TableResponse<ResettlementConfigType>> => {
  return request.get({ url: '/immigrant_will_config', params: query })
}
