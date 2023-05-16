import request from '@/config/axios'
import {
  RelocationResettleDtoType,
  ChooseHouseDtoType,
  SiteSelectionDtoType,
  BuildHouseDtoType,
  TombAddressDtoType,
  ProductLandDtoType,
  SocialSecurityDtoType,
  BuildRoomDtoType
} from './relocationResettle-types'

/**
 * 获取动迁安置所有信息
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getRelocationResettleApi = (
  query: Partial<RelocationResettleDtoType>
): Promise<TableResponse<RelocationResettleDtoType>> => {
  return request.get({ url: '/relocationResettle/findByDoorNo', params: query })
}

/**
 * 保存动迁安置信息
 * @param data 表单提交数据
 * @returns
 */
export const saveRelocationResettleApi = (
  data: any
): Promise<TableResponse<RelocationResettleDtoType>> => {
  return request.post({ url: '/relocationResettle/save', data })
}

/**
 * 删除单条 择房确认单/择房交付告知单 -- 择房信息登记数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteChooseHouseApi = (id: any): Promise<TableResponse<ChooseHouseDtoType>> => {
  return request.post({ url: `/rrChooseHouseInfo/delete/${id}` })
}

/**
 * 删除单条 择址确认单 -- 宅基地信息登记数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteSiteSelectionApi = (id: any): Promise<TableResponse<SiteSelectionDtoType>> => {
  return request.post({ url: `/rrHomesteadInfo/delete/${id}` })
}

/**
 * 删除单条 建房告知单 -- 建房信息登记数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteBuildHouseApi = (id: any): Promise<TableResponse<BuildHouseDtoType>> => {
  return request.post({ url: `/rrHouseBuildInfo/delete/${id}` })
}

/**
 * 删除单条 坟墓择址确认单/坟墓迁移告知单 -- 坟墓择址信息登记数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteTombAddressApi = (id: any): Promise<TableResponse<TombAddressDtoType>> => {
  return request.post({ url: `/rrChooseGraveInfo/delete/${id}` })
}

/**
 * 删除单条 生产用地交付告知单 -- 生产用地地块信息登记数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteProductLandApi = (id: any): Promise<TableResponse<ProductLandDtoType>> => {
  return request.post({ url: `/rrLandInfo/delete/${id}` })
}

/**
 * 删除单条 社保缴费确认单 -- 参保人信息登记数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteSocialSecurityApi = (id: any): Promise<TableResponse<SocialSecurityDtoType>> => {
  return request.post({ url: `/rrInsuredInfo/delete/${id}` })
}

/**
 * 删除单条 自建房验收告知单 -- 房屋信息登记数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteBuildRoomApi = (id: any): Promise<TableResponse<BuildRoomDtoType>> => {
  return request.post({ url: `/rrHouseBuildCheck/delete/${id}` })
}
