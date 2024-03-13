import request from '@/config/axios'
// import type { LandlordDtoType } from './gird-type'

/**
 * 查询居民户信息列表
 */
export const getLandlordListApiGird = (query: Partial<any>): Promise<TableResponse<any>> => {
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

export const findLandAppendantList = (query: Partial<any>): Promise<TableResponse<any>> => {
  return request.get({
    url: '/landEstimate/findLandAppendantList',
    params: {
      sort: ['createdDate,desc'],
      ...query
    }
  })
}
