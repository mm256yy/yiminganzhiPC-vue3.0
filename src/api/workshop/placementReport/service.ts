import request from '@/config/axios'

/**
 * 查询生产安置意愿报表
 */
export const getProHouseReportListApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/productWillStatistics',
    params
  })
}

// 导出生产安置意愿报表
export const exportProHouseReportApi = (params: any) => {
  return request.get({
    url: `/immigrantWillReport/productWillExport`,
    params,
    responseType: 'blob'
  })
}

/**
 * 查询搬迁安置意愿报表
 */
export const getMoveHouseReportListApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/removalWillStatistics',
    params
  })
}

/**
 * 查询搬迁安置意愿报表-标题（动态）
 */
export const getMoveHouseReportListTitleApi = () => {
  return request.get({
    url: '/immigrantWillReport/findRemovalWillStatisticsTitle'
  })
}

// 导出搬迁安置意愿报表
export const exportMoveHouseReportApi = (params: any) => {
  return request.get({
    url: `/immigrantWillReport/removalWillExport`,
    params,
    responseType: 'blob'
  })
}
