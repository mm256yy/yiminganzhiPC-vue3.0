import request from '@/config/axios'
//模板导入
export const getExportData = (params) => {
  return request.get({
    url: `/landEstimate/exportData`,
    params,
    responseType: 'blob'
  })
}
