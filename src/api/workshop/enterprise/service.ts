import request from '@/config/axios'
import { DemographicDtoType, DemographicHeadType, ExcelListType } from './types'

/**
 * 查询企业信息列表
 */
export const getDemographicListApi = (
  query: Partial<DemographicDtoType>
): Promise<TableResponse<DemographicDtoType>> => {
  return request.get({ url: '/company', params: query })
}

/**
 * 新增企业信息
 */
export const addDemographicApi = (data: DemographicDtoType): Promise<DemographicDtoType> => {
  return request.post({ url: '/company/create', data })
}

/**
 * 更新企业信息
 */
export const updateDemographicApi = (data: DemographicDtoType): Promise<DemographicDtoType> => {
  return request.post({ url: '/company/update', data })
}

/**
 * 删除企业信息
 */
export const delDemographicByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/demographic/delete/${id}` })
}

/**
 * 查询单个企业信息
 */
export const getDemographicByIdApi = (id: number): Promise<DemographicDtoType> => {
  return request.get({ url: `/demographic/${id}` })
}

/**
 * 查询企业头部信息
 */
export const getDemographicHeadApi = (): Promise<DemographicHeadType> => {
  return request.get({ url: `/demographic/head` })
}

/**
 * excel文件列表
 */
export const getExcelList = (): Promise<TableResponse<ExcelListType>> => {
  return request.get({
    url: '/import_file',
    params: {
      sort: ['id', 'desc']
    }
  })
}
