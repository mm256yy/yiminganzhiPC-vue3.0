import request from '@/config/axios'
import { FruitWoodDtoType } from './fruitWood-types'

// 查询零星(林)果木公示列表
export const getFruitWoodListApi = (
  params: Partial<FruitWoodDtoType>
): Promise<TableResponse<FruitWoodDtoType>> => {
  return request.get({
    url: '/query/queryTree',
    params
  })
}
