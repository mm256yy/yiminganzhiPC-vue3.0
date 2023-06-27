import request from '@/config/axios'
import { PopulationHousingDtoType } from './populationHousing-types'

// 查询人口房屋公示列表
export const getPopulationHousingListApi = (
  params: Partial<PopulationHousingDtoType>
): Promise<TableResponse<PopulationHousingDtoType>> => {
  return request.get({
    url: '/query/queryHouse',
    params
  })
}
