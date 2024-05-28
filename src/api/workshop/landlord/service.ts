import request from '@/config/axios'
import { LandlordDtoType, TemplateParamsType, SurveyInfoType } from './types'
import { GraveType, LandlordType } from '@/types/print'
import { globalData } from '@/config/fill'

/**
 * 查询居民户信息列表
 */
export const getLandlordListApi = (
  query: Partial<LandlordDtoType>
): Promise<TableResponse<LandlordDtoType>> => {
  if (!query.code) {
    delete query.areaCode
    delete query.townCode
    delete query.villageCode
    delete query.virutalVillageCode
  }

  return request.get({
    url: '/peasantHousehold',
    params: {
      sort: ['createdDate,desc'],
      ...query,
      villageCode: query.villageCodes,
      status: globalData.currentSurveyStatus
    }
  })
}

/**
 * 新增居民户信息
 */
export const addLandlordApi = (data: LandlordDtoType): Promise<LandlordDtoType> => {
  return request.post({
    url: '/peasantHousehold/create',
    data: {
      ...data,
      status: globalData.currentSurveyStatus
    }
  })
}

/**
 * 更新居民户信息
 */
export const updateLandlordApi = (data: LandlordDtoType): Promise<LandlordDtoType> => {
  return request.post({
    url: '/peasantHousehold/update',
    data: {
      ...data,
      status: globalData.currentSurveyStatus
    }
  })
}

export const immigrantGravecreate = (data: any): Promise<any> => {
  return request.post({
    url: '/immigrantGrave/create',
    data: {
      ...data,
      status: globalData.currentSurveyStatus
    }
  })
}

export const immigrantGraveupdate = (data: any): Promise<any> => {
  return request.post({
    url: '/immigrantGrave/update',
    data: {
      ...data,
      status: globalData.currentSurveyStatus
    }
  })
}

/**
 * 删除居民户信息
 */
export const delLandlordByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/peasantHousehold/delete/${id}` })
}

/**
 * 删除坟墓信息
 * @param id 当前行ID
 * @returns
 */
export const immigrantGraveDelete = (id: number): Promise<void> => {
  return request.post({ url: `/immigrantGrave/delete/${id}` })
}

/**
 * 查询单个居民户信息
 */
export const getLandlordByIdApi = (id: number | string): Promise<LandlordDtoType> => {
  return request.get({ url: `/peasantHousehold/${id}` })
}
export const getupdateLog = (params: any): Promise<LandlordDtoType> => {
  return request.get({
    url: `/updateLog`,
    params
  })
}

/**
 * 查询多个调查对象信息
 * 打印使用
 */
interface LandlordPrintResType {
  peasantHouseholdPushDtoList: LandlordType[]
  immigrantGraveList: GraveType[]
}

export const getLandlordBatchApi = (ids: number[] | string[]): Promise<LandlordPrintResType> => {
  return request.get({
    url: `/pad/printDetails`,
    params: {
      ids
    }
  })
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
  return request.get({
    url: `/peasantHousehold/head`,
    params: {
      ...params,
      status: globalData.currentSurveyStatus
    }
  })
}

/**
 * 填报居民户信息
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

/**
 * 批量打印
 */
export const batchPrintApi = (data: any): Promise<any> => {
  return request.post({
    url: `/peasantHousehold/mergePdf`,
    data,
    headersType: 'multipart/form-data'
  })
}

/**
 * 打印表pdf下载
 */
export const downloadPrintPdfApi = (data: any[]): Promise<any> => {
  return request.post({
    url: `/peasantHousehold/packagingZip`,
    data
  })
}

/**
 * 报表签字
 */
export const signLandlordApi = (id: number): Promise<any> => {
  return request.post({
    url: `/peasantHousehold/sginComplete/${id}`
  })
}

/**
 *
 * @param ids
 * @returns
 */
export const batchDeleteApi = (data: any): Promise<any> => {
  return request.post({
    url: `/peasantHousehold/batchelete`,
    data
  })
}
//获取删除信息
export const getPeasantHouseHoldInfo = (params: any): Promise<any> => {
  return request.get({
    url: `/peasantHousehold/getPeasantHouseHoldInfo`,
    params
  })
}
//批量删除
export const batchDelete = (data: any): Promise<void> => {
  return request.post({ url: `/peasantHousehold/batchDelete`, data })
}
