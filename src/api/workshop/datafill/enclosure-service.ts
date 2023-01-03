import request from '@/config/axios'
import { EnclosureDtoType } from './enclosure-types'

/**
 * 查询附件信息列表
 */

export const getEnclosureListApi = (
  query: Partial<EnclosureDtoType>
): Promise<TableResponse<EnclosureDtoType>> => {
  return request.get({ url: '/immigrant_enclosure', params: query })
}

/**
 * 保存
 */
export const saveEnclosureListApi = (data: any): Promise<TableResponse<EnclosureDtoType>> => {
  return request.post({ url: '/immigrant_enclosure/createAll', data })
}
