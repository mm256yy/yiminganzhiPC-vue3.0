import request from '@/config/axios'
import { FruitWoodDtoType, summary } from './fruitWood-types'

// 查询零星(林)果木公示列表
export const getFruitWoodListApi = (
  params: Partial<FruitWoodDtoType>
): Promise<TableResponse<FruitWoodDtoType>> => {
  return request.get({
    url: '/resultForms/queryTree',
    params
  })
}

// 查询实物成果汇总表列表
export const getsummaryApi = (params: Partial<summary>): Promise<TableResponse<summary>> => {
  return request.get({
    url: '/resultForms/summary',
    params
  })
}
