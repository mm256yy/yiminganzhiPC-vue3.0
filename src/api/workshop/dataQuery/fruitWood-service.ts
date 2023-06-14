import request from '@/config/axios'
import { FruitWoodDtoType, ExportType } from './fruitWood-types'

// 查询零星(林)果木公示列表
export const getFruitWoodListApi = (
  query: Partial<FruitWoodDtoType>
): Promise<TableResponse<FruitWoodDtoType>> => {
  return request.get({
    url: '/query/queryTree',
    params: { ...query }
  })
}

// 导出零星(林)果木公示列表
export const exportFruitWooddApi = (params: ExportType): Promise<any> => {
  return request.get({ url: '/query/exportTree', params, responseType: 'blob' })
}
