import request from '@/config/axios'
import { LandlordDtoType, SurveyInfoType } from './landlordCheck-types'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'

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
      status: SurveyStatusEnum.Implementation
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
      status: SurveyStatusEnum.Implementation
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
      status: SurveyStatusEnum.Implementation
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
 * 查询居民户头部信息
 */
export const getLandlordHeadApi = (params: any): Promise<any> => {
  return request.get({
    url: `/peasantHousehold/head`,
    params: {
      ...params,
      status: SurveyStatusEnum.Implementation
    }
  })
}

/**
 * 查看农户概况
 */

export const getLandlordSurveyByIdApi = (id: number | string): Promise<SurveyInfoType> => {
  return request.get({ url: `/peasantHousehold/survey/${id}` })
}
