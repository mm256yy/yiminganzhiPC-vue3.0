import request from '@/config/axios'
// import { LandInfoType } from './landInfo-types'

// 查询土地公示列表
export const getLandInfoApi = (params: Partial<any>): Promise<TableResponse<any>> => {
  return request.get({
    url: '/landSurvey',
    params
  })
}

// 导出报表(区域)
export const exportReportApi = (params: any) => {
  return request.get({
    url: `/landSurvey/export`,
    params,
    responseType: 'blob'
  })
}
