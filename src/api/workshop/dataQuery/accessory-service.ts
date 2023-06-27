import request from '@/config/axios'
import { AccessoryDtoType } from './accessory-types'

// 查询附属物公示列表
export const getAccessoryListApi = (
  params: Partial<AccessoryDtoType>
): Promise<TableResponse<AccessoryDtoType>> => {
  return request.get({
    url: '/query/queryAppendant',
    params
  })
}
