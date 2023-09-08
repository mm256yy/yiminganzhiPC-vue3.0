import request from '@/config/axios'
import { globalData } from '@/config/fill'
import { DeviceDtoType, DeviceParamsType } from './device-types'

export const getDeviceListApi = (
  query: Partial<DeviceParamsType>
): Promise<TableResponse<DeviceDtoType>> => {
  return request.get({
    url: '/immigrantEquipment',
    params: { ...query, status: globalData.currentSurveyStatus }
  })
}

/**
 * 保存
 */
export const saveDeviceListApi = (data: any): Promise<TableResponse<DeviceDtoType>> => {
  return request.post({
    url: '/immigrantEquipment/createAll',
    data
  })
}

/**
 * 删除
 */
export const deleteDeviceApi = (id: number): Promise<void> => {
  return request.post({ url: `/immigrantEquipment/delete/${id}` })
}
