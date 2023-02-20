import request from '@/config/axios'
import { LandlordDtoType, TemplateParamsType, SurveyInfoType } from './types'

/**
 * 查询居民户信息列表
 */
export const getLandlordListApi = (
  query: Partial<LandlordDtoType>
): Promise<TableResponse<LandlordDtoType>> => {
  return request.get({ url: '/peasantHousehold', params: { sort: ['createdDate,desc'], ...query } })
}

/**
 * 新增居民户信息
 */
export const addLandlordApi = (data: LandlordDtoType): Promise<LandlordDtoType> => {
  return request.post({ url: '/peasantHousehold/create', data })
}

/**
 * 更新居民户信息
 */
export const updateLandlordApi = (data: LandlordDtoType): Promise<LandlordDtoType> => {
  return request.post({ url: '/peasantHousehold/update', data })
}

/**
 * 删除居民户信息
 */
export const delLandlordByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/peasantHousehold/delete/${id}` })
}

/**
 * 查询单个居民户信息
 */
export const getLandlordByIdApi = (id: number | string): Promise<LandlordDtoType> => {
  return request.get({ url: `/peasantHousehold/${id}` })
}

/**
 * 模版下载
 */
export const downLandlordTemplateApi = (name: string): Promise<any> => {
  return request.get({ url: `/import_template/${name}` })
}

/**
 * 导出模版列表
 */

export const getPrintTemplateListApi = (params: Partial<TemplateParamsType>): Promise<any> => {
  return request.get({ url: `/import_template`, params })
}

/**
 * 查询居民户头部信息
 */
export const getLandlordHeadApi = (params: any): Promise<any> => {
  return request.get({ url: `/peasantHousehold/head?type=${params.type}` })
}

/**
 * 上报居民户信息
 */
export const reportLandlordApi = (id: number, isCheck: boolean, type: string) => {
  return request.post({
    url: `/peasantHousehold/report/${id}`,
    headersType: 'multipart/form-data',
    data: {
      isCheck,
      type
    }
  })
}

/**
 * 打印/下载
 */
export const printLandlordApi = (
  templateIds: Array<number | string>,
  peasantHouseholdIds: number[]
): Promise<any> => {
  return request.post({
    url: `/peasantHousehold/print`,
    headersType: 'multipart/form-data',
    data: {
      templateIds: templateIds.join(','),
      peasantHouseholdIds: peasantHouseholdIds.join(',')
    }
  })
}

/**
 * 查看农户概况
 */

export const getLandlordSurveyByIdApi = (id: number | string): Promise<SurveyInfoType> => {
  return request.get({ url: `/peasantHousehold/survey/${id}` })
}
