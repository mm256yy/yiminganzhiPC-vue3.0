import request from '@/config/axios'
import { PopulationHousingDtoType } from './populationHousing-types'

// 查询人口房屋公示列表
export const getPopulationHousingListApi = (
  params: Partial<PopulationHousingDtoType>
): Promise<TableResponse<PopulationHousingDtoType>> => {
  return request.get({
    url: '/resultForms/queryHouse',
    params
  })
}

// 资金报表
export const getProfessionalProjectsPageApi = (
  params: Partial<PopulationHousingDtoType>
): Promise<TableResponse<PopulationHousingDtoType>> => {
  return request.get({
    url: '/fundsForms/getProfessionalProjectsPage',
    params
  })
}

// 区域报表
export const getAreaHouseReportApi = (params: any): Promise<void> => {
  return request.get({
    url: '/resultForms/queryAreaHouse',
    params
  })
}

// 导出报表
export const exportReportApi = (data: any) => {
  return request.get({ url: `/resultForms/export/queryAreaHouse`, data, responseType: 'blob' })
}
