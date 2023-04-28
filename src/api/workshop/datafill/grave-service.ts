import request from '@/config/axios'
import { GraveDtoType } from './grave-types'
const id = window.location.href.substring(location.href.lastIndexOf('=') + 1)
/**
 * 查询坟墓信息列表
 */

export const getGraveListApi = (
  query: Partial<GraveDtoType>
): Promise<TableResponse<GraveDtoType>> => {
  return request.get({ url: '/immigrantGrave', params: query })
}

/**
 * 保存
 */
export const saveGraveListApi = (data: any): Promise<TableResponse<GraveDtoType>> => {
  if (id == '2') {
    data.status = 'review'
  }
  return request.post({ url: '/immigrantGrave/createAll', data })
}

// 坟墓模板导出
export const exportGraveTemplate = () => {
  return request.get({
    url: '/peasantHousehold/exportGraveTemplate',
    responseType: 'blob'
  })
}
