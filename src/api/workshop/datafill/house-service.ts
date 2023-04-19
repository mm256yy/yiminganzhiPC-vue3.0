import request from '@/config/axios'
import { HouseDtoType } from './house-types'
const id = window.location.href.substring(location.href.lastIndexOf('=') + 1)
/**
 * 查询房屋信息列表
 */

export const getHouseListApi = (
  query: Partial<HouseDtoType>
): Promise<TableResponse<HouseDtoType>> => {
  return request.get({ url: '/immigrant_house', params: query })
}

/**
 * 新增房屋信息
 */
export const addHouseApi = (data: HouseDtoType): Promise<HouseDtoType> => {
  if (id == '2') {
    data.status = 'review'
  }
  return request.post({ url: '/immigrant_house/create', data })
}

/**
 * 更新房屋信息
 */
export const updateHouseApi = (data: HouseDtoType): Promise<HouseDtoType> => {
  return request.post({ url: '/immigrant_house/update', data })
}

/**
 * 删除房屋信息
 */
export const delHouseByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/immigrant_house/delete/${id}` })
}

/**
 * 查询单个房屋信息
 */
export const getHouseByIdApi = (id: number): Promise<HouseDtoType> => {
  return request.get({ url: `/immigrant_house/${id}` })
}

/**
 * 模版下载
 */
export const downHouseTemplateApi = (name: string): Promise<any> => {
  return request.get({ url: `/import_template/${name}` })
}

/**
 * 查询房屋头部信息
 */
export const getHouseHeadApi = (): Promise<any> => {
  return request.get({ url: `/immigrant_house/head` })
}
