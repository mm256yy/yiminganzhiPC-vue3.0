import request from '@/config/axios'
import {
  FundDetailReportType,
  HouseholdReportType,
  EnterpriseReportType,
  IndividualBReportType,
  VillageReportType
} from './types'

/**
 * 查询资金详情列表
 */
export const getFundDetailReportListApi = (
  query: Partial<FundDetailReportType>
): Promise<FundDetailReportType[]> => {
  return request.get({ url: '/fundsForms/fundDetail', params: query })
}

/**
 * 导出资金详情
 * @param params
 * @returns
 */
export const exportFundDetailApi = (params: any) => {
  return request.get({ url: '/fundsForms/fundDetailDownload', params, responseType: 'blob' })
}

/**
 * 查询居民户资金报表
 */

export const getHouseholdReportListApi = (query: any) => {
  return request.get({ url: '/fundsForms/peasantHouseholdCard', params: query })
}

/**
 * 查询居名户资金使用详情
 * @param query
 * @returns
 */
export const getHouseholdDetail = (query: any) => {
  return request.get({ url: '/fundsForms/peasantHouseholdCardDetail', params: query })
}

/**
 * 导出居民户资金使用情况
 * @param params
 * @returns
 */
export const exportFundHouseholdApi = (params: any) => {
  return request.get({
    url: '/fundsForms/cardDownload',
    params,
    responseType: 'blob'
  })
}

/**
 * 查询企业资金报表
 * 暂无
 */
export const getEnterpriseReportListApi = (
  query: Partial<EnterpriseReportType>
): Promise<TableResponse<EnterpriseReportType>> => {
  return request.get({ url: '/news', params: query })
}

/**
 * 查询个体户资金报表
 * 暂无
 */
export const getIndividualBReportListApi = (
  query: Partial<IndividualBReportType>
): Promise<TableResponse<IndividualBReportType>> => {
  return request.get({ url: '/news', params: query })
}

/**
 * 查询村集体资金报表
 * 暂无
 */
export const getVillageReportListApi = (
  query: Partial<VillageReportType>
): Promise<TableResponse<VillageReportType>> => {
  return request.get({ url: '/news', params: query })
}

// 资金管理报告
export const getCardReportApi = (params: any) => {
  return request.get({ url: `/immigrantCompensationCardReport/feeStatistics`, params })
}

/**
 * 导出个体户资金使用情况
 * @param params
 * @returns
 */
export const exportFundIndividualApi = (params: any) => {
  return request.get({
    url: '/fundsForms/cardDownload',
    params,
    responseType: 'blob'
  })
}

/**
 * 获取个体户资金详情
 */
export const getFundIndividualDetailApi = (params: any) => {
  return request.get({
    url: '/immigrantCompensationCardReport/feeStatisticDetail',
    params
  })
}
