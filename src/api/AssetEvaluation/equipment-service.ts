import request from '@/config/axios'
import { EquipmentDtoType } from './equipment-types'

/**
 * 获取企业/个体工商户设施设备评估列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getEquipmentListApi = (
  query: Partial<EquipmentDtoType>
): Promise<TableResponse<EquipmentDtoType>> => {
  return request.get({ url: '/immigrantEquipment', params: query })
}

/**
 * 保存多个企业/个体工商户设施设备评估数据
 * @param data 表单提交数据
 * @returns
 */
export const saveEquipmentApi = (data: any): Promise<TableResponse<EquipmentDtoType>> => {
  return request.post({ url: '/immigrantEquipment/createAll', data })
}

/**
 * 删除企业/个体工商户设施设备评估数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteEquipmentApi = (id: any): Promise<TableResponse<EquipmentDtoType>> => {
  return request.post({ url: `/immigrantEquipment/delete/${id}` })
}
