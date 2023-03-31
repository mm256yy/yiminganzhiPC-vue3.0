import request from '@/config/axios'
import { DemographicDtoType, DemographicHeadType, ExcelListType } from './types'

/**
 * 查询人口信息列表
 */
export const getDemographicListApi = (
  query: Partial<DemographicDtoType>
): Promise<TableResponse<DemographicDtoType>> => {
  return request.get({ url: '/demographic', params: query })
}

/**
 * 新增人口信息
 */
export const addDemographicApi = (data: DemographicDtoType): Promise<DemographicDtoType> => {
  return request.post({ url: '/demographic/create', data })
}

/**
 * 更新人口信息
 */
export const updateDemographicApi = (data: DemographicDtoType): Promise<DemographicDtoType> => {
  return request.post({ url: '/demographic/update', data })
}

/**
 * 删除人口信息
 */
export const delDemographicByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/demographic/delete/${id}` })
}

/**
 * 查询单个人口信息
 */
export const getDemographicByIdApi = (id: number): Promise<DemographicDtoType> => {
  return request.get({ url: `/demographic/${id}` })
}

/**
 * 查询人口头部信息
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

// 获取字典表数据
export const getDictByName = (name: string) => {
  return request.get({
    url: '/dict/tree',
    params: {
      name
    }
  })
}
