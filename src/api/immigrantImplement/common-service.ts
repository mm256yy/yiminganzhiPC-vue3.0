import request from '@/config/axios'
import type { LandlordDtoType, DocumentationType, FillingType } from './common-types'

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
 * 查询居民户头部信息
 */
export const getLandlordHeadApi = (params: any): Promise<any> => {
  return request.get({
    url: `/peasantHousehold/head`,
    params
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
      status: 'implementation'
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
      status: 'implementation'
    }
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

/**
 * 填报完成
 * @param data 表单提交数据
 * @returns
 */
export const saveFillingCompleteApi = (data: any): Promise<FillingType> => {
  return request.post({ url: '/immigrantFilling/save', data })
}

/**
 * 获取填报状态
 * @param doorNo 户号
 * @returns
 */
export const getFillingStatusApi = (doorNo: string) => {
  return request.get({ url: '/immigrantFilling/findByDoorNo', params: { doorNo } })
}
