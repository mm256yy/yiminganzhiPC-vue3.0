import request from '@/config/axios'
// import { ComprehensiveReportType } from './types'

/**
 * 报表列表公共api
 * type 区分不同类型页面
 */
export const getCommonReportApi = (type: any): Promise<any> => {
  return request.get({ url: `/physical/changes/report/${type}` })
}

/**
 * 实物成果通用导出
 * type 区分不同类型页面
 */
export const exportPhysicalApi = (type: any) => {
  return request.get({
    url: `/physical/changes/export/report/${type}`,
    responseType: 'blob'
  })
}
