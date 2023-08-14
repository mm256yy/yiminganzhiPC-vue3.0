import request from '@/config/axios'
import { SpecialEquipmentDtoType } from './specialEquipment-types'

/**
 * 获取农村小型专项及农副业设施信息
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getSpecialEquipmentListApi = (
  query: Partial<SpecialEquipmentDtoType>
): Promise<TableResponse<SpecialEquipmentDtoType>> => {
  return request.get({ url: '/immigrantFacilities', params: query })
}

/**
 * 批量保存数据
 * @param data 表单提交数据
 * @returns
 */
export const saveSpecialEquipmentApi = (
  data: any
): Promise<TableResponse<SpecialEquipmentDtoType>> => {
  return request.post({ url: '/immigrantFacilities/createAll', data })
}

/**
 * 删除
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteSpecialEquipmentApi = (
  id: any
): Promise<TableResponse<SpecialEquipmentDtoType>> => {
  return request.post({ url: `/immigrantFacilities/delete/${id}` })
}
