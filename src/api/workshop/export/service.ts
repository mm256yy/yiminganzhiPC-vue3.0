import request from '@/config/axios'
import { ExportType } from './types'

/**
 * 导出
 */

export const getExportApi = (params: ExportType): Promise<any> => {
  return request.get({ url: '/peasantHousehold/export', params, responseType: 'blob' })
}
