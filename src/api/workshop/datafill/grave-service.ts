import request from '@/config/axios'
import { GraveDtoType } from './grave-types'

/**
 * 查询坟墓信息列表
 */

export const getGraveListApi = (
  query: Partial<GraveDtoType>
): Promise<TableResponse<GraveDtoType>> => {
  return request.get({ url: '/immigrant_grave', params: query })
}

/**
 * 保存
 */
export const saveGraveListApi = (data: any): Promise<TableResponse<GraveDtoType>> => {
  return request.post({ url: '/immigrant_grave/createAll', data })
}
