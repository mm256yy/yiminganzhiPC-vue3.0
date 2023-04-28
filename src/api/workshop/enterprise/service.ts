import request from '@/config/axios'
import { CompanyDtoType } from './types'
import { globalData } from '@/config/fill'
/**
 * 查询企业信息列表
 */
export const getCompanyListApi = (
  query: Partial<CompanyDtoType>
): Promise<TableResponse<CompanyDtoType>> => {
  return request.get({
    url: '/company',
    params: {
      ...query,
      status: globalData.currentSurveyStatus
    }
  })
}

/**
 * 新增企业信息
 */
export const addCompanyApi = (data: CompanyDtoType): Promise<CompanyDtoType> => {
  return request.post({
    url: '/company/create',
    data: {
      ...data,
      status: globalData.currentSurveyStatus
    }
  })
}

/**
 * 更新企业信息
 */
export const updateCompanyApi = (data: CompanyDtoType): Promise<CompanyDtoType> => {
  return request.post({
    url: '/company/update',
    data: {
      ...data,
      status: globalData.currentSurveyStatus
    }
  })
}

/**
 * 删除企业信息
 */
export const delCompanyByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/company/delete/${id}` })
}

/**
 * 查询单个企业信息
 */
export const getCompanyByIdApi = (id: number): Promise<CompanyDtoType> => {
  return request.get({ url: `/company/${id}` })
}
