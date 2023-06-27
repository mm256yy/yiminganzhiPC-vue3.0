import request from '@/config/axios'
import { VillageCollectiveDtoType } from './villageCollective-types'

// 查询村集体公示列表
export const getVillageCollectiveListApi = (
  params: Partial<VillageCollectiveDtoType>
): Promise<TableResponse<VillageCollectiveDtoType>> => {
  return request.get({
    url: '/query/queryVillage',
    params
  })
}
