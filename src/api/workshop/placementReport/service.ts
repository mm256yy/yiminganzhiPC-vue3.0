import request from '@/config/axios'

/**
 * 查询安置确认生产安置意愿报表
 */
export const getProHouseReportListApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/productWillStatistics',
    params
  })
}

// 导出安置确认生产安置意愿报表
export const exportProHouseReportApi = (params: any) => {
  return request.get({
    url: `/immigrantWillReport/productWillExport`,
    params,
    responseType: 'blob'
  })
}

/**
 * 查询模拟安置生产安置意愿报表
 */
export const getProHouseSimulateReportListApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/productWillSimulateStatistics',
    params
  })
}

// 导出模拟安置生产安置意愿报表
export const exportProHouseSimulateReportApi = (params: any) => {
  return request.get({
    url: `/immigrantWillReport/productWillSimulateExport`,
    params,
    responseType: 'blob'
  })
}
/**
 * 查询安置确认-搬迁安置意愿报表
 */
export const getMoveHouseReportListApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/removalWillStatistics',
    params
  })
}
/**
 * 查询模拟安置-搬迁安置意愿报表
 */
export const getSimulateMoveHouseReportListApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/removalSimulateStatistics',
    params
  })
}
/**
 * 查询安置确认搬迁安置意愿报表总计 计算统计
 */
export const getRemovalWillTotalStatisticsApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/removalWillTotalStatistics',
    params
  })
}
/**
 * 查询模拟安置-搬迁安置意愿报表总计 计算统计
 */
export const getSimulateRemovalWillTotalStatisticsApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/removalSimulateTotalStatistics',
    params
  })
}
/**
 * 查询安置确认搬迁安置意愿报表-标题（动态）
 */
export const getMoveHouseReportListTitleApi = () => {
  return request.get({
    url: '/immigrantWillReport/findRemovalWillStatisticsTitle'
  })
}

/**
 * 查询选房择址宅基地表
 */
export const getSiteHomesteadStatisticsListApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/siteHomesteadStatistics',
    params
  })
}

// 导出选房择址宅基地表
export const exportSiteHomesteadStatisticsApi = (params: any) => {
  return request.get({
    url: `/immigrantWillReport/siteHomesteadExport`,
    params,
    responseType: 'blob'
  })
}
/**
 * 查询选房择址公寓房表
 */
export const getSiteHouseStatisticsApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/siteHouseStatistics',
    params
  })
}

// 导出选房择址公寓房表
export const exportSiteHouseStatisticsApi = (params: any) => {
  return request.get({
    url: `/immigrantWillReport/siteHouseExport`,
    params,
    responseType: 'blob'
  })
}
/**
 * 查询选房择址生产用地表
 */
export const getProductLandStatisticsApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/productLandStatistics',
    params
  })
}

// 导出选房择址生产用地表
export const exportProductLandExportApi = (params: any) => {
  return request.get({
    url: `/immigrantWillReport/productLandExport`,
    params,
    responseType: 'blob'
  })
}
/**
 * 查询选房择址坟墓表
 */
export const getImmigrantGraveStatisticsApi = (params: any) => {
  return request.get({
    url: '/immigrantWillReport/immigrantGraveStatistics',
    params
  })
}

// 导出选房择址坟墓表
export const exportImmigrantGraveSiteExportApi = (params: any) => {
  return request.get({
    url: `/immigrantWillReport/immigrantGraveSiteExport`,
    params,
    responseType: 'blob'
  })
}

// 导出安置确认坟墓安置
export const exportProHouseGraveReportApi = (params: any) => {
  return request.get({
    url: `/immigrantWillReport/immigrantGraveExport`,
    params,
    responseType: 'blob'
  })
}

// 导出安置确认-搬迁安置意愿报表
export const exportMoveHouseReportApi = (params: any) => {
  return request.get({
    url: `/immigrantWillReport/removalWillExport`,
    params,
    responseType: 'blob'
  })
}
// 导出模拟安置搬迁安置意愿报表
export const exporSimulatetMoveHouseReportApi = (params: any) => {
  return request.get({
    url: `/immigrantWillReport/removalWillSimulateExport`,
    params,
    responseType: 'blob'
  })
}
