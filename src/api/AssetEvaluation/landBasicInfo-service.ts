import request from '@/config/axios'
import { LandBasicInfoDtoType } from './landBasicInfo-types'

/**
 * 获取土地基本情况评估列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getLandBasicInfoListApi = (
  query: Partial<LandBasicInfoDtoType>
): Promise<TableResponse<LandBasicInfoDtoType>> => {
  return request.get({ url: '/assetLand', params: query })
}

/**
 * 保存多个土地基本情况评估数据
 * @param data 表单提交数据
 * @returns
 */
export const saveLandBasicInfoApi = (data: any): Promise<TableResponse<LandBasicInfoDtoType>> => {
  return request.post({ url: '/assetLand/createAll', data })
}

/**
 * 删除单条土地基本情况评估数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteLandBasicInfoApi = (id: any): Promise<TableResponse<LandBasicInfoDtoType>> => {
  return request.post({ url: `/assetLand/delete/${id}` })
}
