import request from '@/config/axios'
import { AccessoryDtoType } from './accessory-types'
const id = window.location.href.substring(location.href.lastIndexOf('=') + 1)
/**
 * 查询附属物信息列表
 */

export const getAccessoryListApi = (
  query: Partial<AccessoryDtoType>
): Promise<TableResponse<AccessoryDtoType>> => {
  return request.get({ url: '/immigrant_appendant', params: query })
}

/**
 * 保存
 */
export const saveAccessoryListApi = (data: any): Promise<TableResponse<AccessoryDtoType>> => {
  if (id == '2') {
    data.status = 'review'
  }
  return request.post({ url: '/immigrant_appendant/createAll', data })
}

/**
 * 配置信息
 */

export const getAppendantOptionApi = (name?: string): Promise<TableResponse<AccessoryDtoType>> => {
  return request.get({ url: '/immigrant_appendant_option', params: { size: 1000, name } })
}
