import request from '@/config/axios'
import { AccessoryDtoType } from './accessory-types'

// 查询附属物公示列表
export const getAccessoryListApi = (
  params: Partial<AccessoryDtoType>
): Promise<TableResponse<AccessoryDtoType>> => {
  return request.get({
    url: '/resultForms/queryAppendant',
    params
  })
}

// 导出报表(按户)
export const exportAccessoryReportApi = (params: any) => {
  return request.get({
    url: `/resultForms/export/queryDistrictTree`,
    params,
    responseType: 'blob'
  })
}

// 查询附属物区域列表
export const getAccessoryRegionListApi = (
  params: any
): Promise<TableResponse<AccessoryDtoType>> => {
  return request.get({
    url: '/resultForms/queryDistrictAppendant',
    params
  })
}

// 导出报表(区域)
export const exportReportApi = (params: any) => {
  return request.get({
    url: `/resultForms/export/queryDistrictAppendant`,
    params,
    responseType: 'blob'
  })
}
