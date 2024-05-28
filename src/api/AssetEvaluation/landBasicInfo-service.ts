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
  return request.get({ url: '/landEstimate', params: query })
}

/**
 * 保存多个土地基本情况评估数据
 * @param data 表单提交数据
 * @returns
 */
export const saveLandBasicInfoApi = (data: any): Promise<TableResponse<LandBasicInfoDtoType>> => {
  return request.post({ url: '/landEstimate/createAll', data })
}

/**
 * 删除单条土地基本情况评估数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteLandBasicInfoApi = (id: any): Promise<TableResponse<LandBasicInfoDtoType>> => {
  return request.post({ url: `/landEstimate/delete/${id}` })
}

/**
 * 获取公寓房选房列表数据
 * @param params 传参
 */
export const getApartmentSelectionListApi = (params: any) => {
  return request.get({ url: `/immigrantChooseHouse/findPeasantFlatList`, params })
}

/**
 * 获取宅基地择址列表数据
 * @param params
 * @returns
 */
export const getHomesteadLandSiteListApi = (params: any) => {
  return request.get({ url: `/immigrantChooseHouse/findPeasantHomesteadList`, params })
}

/**
 * 获取生产用地择址列表数据
 * @param params
 * @returns
 */
export const getProductionLandSiteListApi = (params: any) => {
  return request.get({ url: `/immigrantLand/findPeasantLandList`, params })
}

/**
 * 获取坟墓择址列表数据
 * @param params 传参
 */
export const getTombSiteListApi = (params: any) => {
  return request.get({ url: `/immigrantGrave/findPeasantGraveList`, params })
}

/**
 * 批量存储档案
 * @param data
 * @returns
 */
export const saveBatchFileApi = (data: any): Promise<TableResponse<LandBasicInfoDtoType>> => {
  return request.post({ url: '/immigrantChooseHouse/updateOrder', data })
}

/**
 * 生产用地批量存储档案
 * @param data
 * @returns
 */
export const saveBatchProductionLandFileApi = (
  data: any
): Promise<TableResponse<LandBasicInfoDtoType>> => {
  return request.post({ url: '/immigrantLand/updateAddress', data })
}

/**
 * 坟墓批量存储档案
 * @param data
 * @returns
 */
export const saveBatchTombFileApi = (data: any): Promise<TableResponse<LandBasicInfoDtoType>> => {
  return request.post({ url: '/immigrantGrave/updateAddress', data })
}
/**
 * 获取坟墓择址列表数据(纯集体)
 * @param params 传参
 */
export const immigrantGraveApi = (params: any) => {
  return request.get({ url: `/immigrantGrave`, params })
}
