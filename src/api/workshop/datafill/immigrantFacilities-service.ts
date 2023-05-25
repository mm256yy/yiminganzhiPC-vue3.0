import request from '@/config/axios'
import { FacilitiesDtoType, FacilitiesParamsType } from './immigrantFacilities-type'
import { globalData } from '@/config/fill'

export const getFacilitiesListApi = (
  query: Partial<FacilitiesParamsType>
): Promise<TableResponse<FacilitiesDtoType>> => {
  return request.get({
    url: '/immigrantFacilities',
    params: { ...query, status: globalData.currentSurveyStatus }
  })
}

/**
 * 保存
 */
export const addFacilitiesListApi = (data: any): Promise<TableResponse<FacilitiesDtoType>> => {
  return request.post({
    url: '/immigrantFacilities/create',
    data: { ...data, status: globalData.currentSurveyStatus }
  })
}

/**
 * 删除
 */
export const deleteFacilitiesApi = (id: number): Promise<void> => {
  return request.post({ url: `/immigrantFacilities/delete/${id}` })
}

export const updateFacilitiesApi = (data: any): Promise<TableResponse<FacilitiesDtoType>> => {
  return request.post({
    url: '/immigrantFacilities/update',
    data: { ...data, status: globalData.currentSurveyStatus }
  })
}
