import request from '@/config/axios'
import { TownshipFundEntryDtoType } from './common-types'

// 获取资金科目列表
export const getFundSubjectListApi = (params?: any) => {
  return request.get({ url: `/funSubject/list`, params })
}

/**
 * 获取乡镇资金入账列表数据
 */
export const getFunPayTownshipListApi = (params?: TownshipFundEntryDtoType) => {
  return request.get({ url: `/funGrant/funPayTownship`, params })
}
