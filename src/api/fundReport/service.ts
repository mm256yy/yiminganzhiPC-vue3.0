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
): Promise<TableResponse<FundDetailReportType>> => {
  return request.get({ url: '/fundsForms/fundDetail', params: query })
}

/**
 * 查询居民户资金报表
 */

// fundsForms/peasantHouseholdCard

export const getHouseholdReportListApi = (
  query: Partial<HouseholdReportType>
): Promise<TableResponse<HouseholdReportType>> => {
  return request.get({ url: '/fundsForms/peasantHouseholdCard', params: query })
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
