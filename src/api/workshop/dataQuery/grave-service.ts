import request from '@/config/axios'
import { GraveDtoType } from './grave-types'

// 查询坟墓公示列表
export const getGraveListApi = (
  params: Partial<GraveDtoType>
): Promise<TableResponse<GraveDtoType>> => {
  return request.get({
    url: '/resultForms/queryGrave',
    params
  })
}

// 导出报表
export const exportReportApi = (params: any) => {
  return request.get({
    url: `/resultForms/export/queryGrave`,
    params,
    responseType: 'blob'
  })
}
