import request from '@/config/axios'
import type { LandlordDtoType } from './gird-type'

/**
 * 查询居民户信息列表
 */
export const getLandlordListApiGird = (
  query: Partial<LandlordDtoType>
): Promise<TableResponse<LandlordDtoType>> => {
  return request.get({
    url: '/grid/getRgridman',
    params: {
      sort: ['createdDate,desc'],
      ...query
    }
  })
}

export const updateLandlordApi = (data: any): Promise<any> => {
  return request.post({
    url: '/grid/update',
    data: {
      ...data
    }
  })
}
