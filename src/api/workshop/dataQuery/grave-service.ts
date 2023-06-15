import request from '@/config/axios'
import { GraveDtoType } from './grave-types'

// 查询坟墓公示列表
export const getGraveListApi = (
  params: Partial<GraveDtoType>
): Promise<TableResponse<GraveDtoType>> => {
  return request.get({
    url: '/query/queryGrave',
    params
  })
}
