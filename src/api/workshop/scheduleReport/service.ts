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
    url: '/progressReport/peasantFillingStatistics',
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
