import request from '@/config/axios'
import { PopulationHousingDtoType } from './populationHousing-types'

// 查询房屋人口公示列表
export const getPopulationHousingListApi = (
  query: Partial<PopulationHousingDtoType>
): Promise<TableResponse<PopulationHousingDtoType>> => {
  return request.get({
    url: '/query/queryHouse',
    params: { ...query }
  })
}
