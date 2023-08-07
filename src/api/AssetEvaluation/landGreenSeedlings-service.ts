import request from '@/config/axios'
import { LandGreenSeedlingsDtoType } from './landGreenSeedlings-types'

/**
 * 获取土地青苗及附着物评估列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getLandGreenSeedlingsListApi = (
  query: Partial<LandGreenSeedlingsDtoType>
): Promise<TableResponse<LandGreenSeedlingsDtoType>> => {
  return request.get({ url: '/assetAppendant', params: query })
}

/**
 * 保存多个土地青苗及附着物评估数据
 * @param data 表单提交数据
 * @returns
 */
export const saveLandGreenSeedlingsApi = (
  data: any
): Promise<TableResponse<LandGreenSeedlingsDtoType>> => {
  return request.post({ url: '/assetAppendant/createAll', data })
}

/**
 * 删除单条土地青苗及附着物评估数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteLandGreenSeedlingsApi = (
  id: any
): Promise<TableResponse<LandGreenSeedlingsDtoType>> => {
  return request.post({ url: `/assetAppendant/delete/${id}` })
}
