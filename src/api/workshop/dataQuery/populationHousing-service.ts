import request from '@/config/axios'
import { PopulationHousingDtoType, ExportType } from './populationHousing-types'

// 查询人口房屋公示列表
export const getPopulationHousingListApi = (
  query: Partial<PopulationHousingDtoType>
): Promise<TableResponse<PopulationHousingDtoType>> => {
  return request.get({
    url: '/query/queryHouse',
    params: { ...query }
  })
}

// 导出人口房屋公示列表
export const exportHouseApi = (params: ExportType): Promise<any> => {
  return request.get({ url: '/query/exportHouse', params, responseType: 'blob' })
}
