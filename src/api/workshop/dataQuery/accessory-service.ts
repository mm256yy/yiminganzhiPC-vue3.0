import request from '@/config/axios'
import { AccessoryDtoType, ExportType } from './accessory-types'

// 查询附属物公示列表
export const getAccessoryListApi = (
  query: Partial<AccessoryDtoType>
): Promise<TableResponse<AccessoryDtoType>> => {
  return request.get({
    url: '/query/queryAppendant',
    params: { ...query }
  })
}

// 导出附属物公示列表
export const exportAccessoryApi = (params: ExportType): Promise<any> => {
  return request.get({ url: '/query/exportAppendant', params, responseType: 'blob' })
}
