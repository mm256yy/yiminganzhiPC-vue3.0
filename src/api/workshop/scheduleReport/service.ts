import request from '@/config/axios'

/**
 * 查询居民户按区域报表
 */
export const getResidentRegionListApi = (params: {
  page: string
  size: string
  sort?: string[]
}) => {
  return request.get({
    url: '/progressReport/peasantAreaStatistics',
    params
  })
}
/**
 * 查询居民户按工作组报表
 */
export const getResidentWorkListApi = (params: { page: string; size: string; sort?: string[] }) => {
  return request.get({
    url: '/progressReport/peasantGridStatistics',
    params
  })
}

/**
 * 查询居民户进度报表
 * @param params
 * @returns
 */
export const getResidentProgressListApi = (params: {
  page: string
  size: string
  sort?: string[]
}) => {
  return request.get({
    url: '/progressReport/peasantFillingStatistics',
    params
  })
}

// 进度明细（导出）
export const exportProgressDetailApi = (params: any) => {
  return request.get({
    url: `/progressReport/exportFilling`,
    params,
    responseType: 'blob'
  })
}

// 区域统计（导出）
export const exportRegionalStatisticsApi = (params: any) => {
  return request.get({
    url: `/progressReport/exportFillingByArea`,
    params,
    responseType: 'blob'
  })
}

// 工作组统计（导出）
export const exportWorkGroupApi = (params: any) => {
  return request.get({
    url: `/progressReport/exportFillingByGrid`,
    params,
    responseType: 'blob'
  })
}

// 只征地不搬迁详情列表
export const getLandNoMoveProgressDetailListApi = (params: any) => {
  return request.get({
    url: '/progressReport/landnomoveStatistics',
    params
  })
}

// 导出只征地不搬迁详情列表
export const exportLandNoMoveProgressDetailListApi = (params: any) => {
  return request.get({
    url: '/progressReport/exportFilling',
    params,
    responseType: 'blob'
  })
}

// 只征地不搬迁区域统计列表
export const getLandNoMoveRegionalStatisiListApi = (params: any) => {
  return request.get({
    url: '/progressReport/landnomoveAreaStatistics',
    params
  })
}

// 导出只征地不搬迁区域统计详情列表
export const exportLandNoMoveRegionalStatisiListApi = (params: any) => {
  return request.get({
    url: '/progressReport/exportFillingByArea',
    params,
    responseType: 'blob'
  })
}
// 只征地不搬迁工作组统计列表
export const getLandNoMoveWorkGroupStatisiListApi = (params: any) => {
  return request.get({
    url: '/progressReport/landNoMoveGridStatistics',
    params
  })
}

// 导出只征地不搬迁工作组统计详情列表
export const exportLandNoMoveWorkGroupStatisiListApi = (params: any) => {
  return request.get({
    url: '/progressReport/exportFillingByGrid',
    params,
    responseType: 'blob'
  })
}
