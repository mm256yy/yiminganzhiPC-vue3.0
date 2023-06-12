import request from '@/config/axios'
// import { ResettlementDtoType } from './resettlement-types'
import { globalData } from '@/config/fill'

/**
 * 查询安置意愿信息列表
 */

export const getResettlementListApi = (data: any) => {
  return request.post({
    url: '/immigrant_will',
    data
  })
}

/**
 * 保存
 */
export const saveResettlementListApi = (data: any) => {
  return request.post({
    url: '/immigrant_will/save',
    data: { ...data, status: globalData.currentSurveyStatus }
  })
}
