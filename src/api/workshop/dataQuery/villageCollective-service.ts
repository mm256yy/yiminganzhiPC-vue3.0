import request from '@/config/axios'
import { VillageCollectiveDtoType } from './villageCollective-types'

// 查询村集体公示列表
export const getVillageCollectiveListApi = (
  params: Partial<VillageCollectiveDtoType>
): Promise<TableResponse<VillageCollectiveDtoType>> => {
  return request.get({
    url: '/resultForms/queryVillage',
    params
  })
}

// 导出报表
export const exportReportApi = (params: any) => {
  return request.get({
    url: `/resultForms/export/queryVillage`,
    params,
    responseType: 'blob'
  })
}
