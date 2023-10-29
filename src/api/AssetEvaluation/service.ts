import request from '@/config/axios'
import type { FillTypes, LandlordDtoType, DocumentationType } from './types'

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
      ...query
    }
  })
}

/**
 * 填报完成
 * @param data 表单提交数据
 * @returns
 */
export const saveImmigrantFillingApi = (data: any): Promise<TableResponse<FillTypes>> => {
  return request.post({ url: '/immigrantFilling/save', data })
}

/**
 * 查询居民户头部信息
 */
export const getLandlordHeadApi = (params: any): Promise<any> => {
  return request.get({
    url: `/peasantHousehold/head`,
    params
  })
}

/**
 * 获取档案数据
 * @param doorNo 户号
 * @returns
 */
export const getDocumentationApi = (doorNo: string) => {
  return request.get({ url: '/immigrantDocumentation/findByDoorNo', params: { doorNo } })
}

/**
 * 档案上传
 * @param data 表单提交数据
 * @returns
 */
export const saveDocumentationApi = (data: any): Promise<DocumentationType> => {
  return request.post({ url: '/immigrantDocumentation/save', data })
}
