import request from '@/config/axios'
import { ExportType, LandlordDtoType } from './types'

/**
 * 导出
 */

export const getExportApi = (params: ExportType): Promise<any> => {
  return request.get({ url: '/peasantHousehold/export', params, responseType: 'blob' })
}

//评估类的导出
export const getPgExportApi = (params: ExportType): Promise<any> => {
  return request.get({
    url: '/peasantHousehold/assetEvaluation/export',
    params,
    responseType: 'blob'
  })
}

//打印报告下载
export const getExportReportApi = (params: ExportType): Promise<any> => {
  return request.get({ url: '/exportWord/exportReport', params, responseType: 'blob' })
}

export const getGridExportApi = (params: LandlordDtoType): Promise<any> => {
  return request.get({ url: '/grid/exportGrid', params, responseType: 'blob' })
}
