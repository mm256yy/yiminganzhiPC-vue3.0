import request from '@/config/axios'
import { ExportType, LandlordDtoType } from './types'

/**
 * 导出
 */

export const getExportApi = (params: ExportType): Promise<any> => {
  return request.get({ url: '/peasantHousehold/export', params, responseType: 'blob' })
}

export const getGridExportApi = (params: LandlordDtoType): Promise<any> => {
  return request.get({ url: '/grid/exportGrid', params, responseType: 'blob' })
}
