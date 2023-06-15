import request from '@/config/axios'
import { ExportType } from './common-types'

// 导出公示列表
export const exportPublicityApi = (params: ExportType): Promise<any> => {
  return request.get({ url: '/query/exportPublicity', params, responseType: 'blob' })
}
