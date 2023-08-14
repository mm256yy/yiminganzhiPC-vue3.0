import request from '@/config/axios'
import type { LandlordDtoType, FillTypes } from './types'

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
      sort: ['lastModifiedDate,id,desc'],
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
