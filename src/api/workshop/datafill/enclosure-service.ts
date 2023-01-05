import request from '@/config/axios'
import { EnclosureDtoType } from './enclosure-types'

/**
 * 查询附件信息列表
 */

export const getEnclosureListApi = (
  query: Partial<EnclosureDtoType>
): Promise<TableResponse<EnclosureDtoType>> => {
  return request.get({ url: '/immigrant_file', params: query })
}

/**
 * 新增
 */
export const addEnclosureListApi = (data: EnclosureDtoType): Promise<any> => {
  return request.post({ url: '/immigrant_file/create', data })
}

/**
 * 更新
 */
export const updateEnclosureListApi = (
  data: EnclosureDtoType
): Promise<TableResponse<EnclosureDtoType>> => {
  return request.post({ url: '/immigrant_file/update', data })
}
