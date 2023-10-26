import request from '@/config/axios'

/**
 * 查询生产安置意愿报表
 */
export const getProHouseReportListApi = (params: {
  page: string
  size: string
  sort?: string[]
}) => {
  return request.get({
    url: '/immigrantWillReport/productWillStatistics',
    params
  })
}
/**
 * 查询搬迁安置意愿报表
 */
export const getMoveHouseReportListApi = (params: {
  page: string
  size: string
  sort?: string[]
}) => {
  return request.get({
    url: '/immigrantWillReport/removalWillStatistics',
    params
  })
}
