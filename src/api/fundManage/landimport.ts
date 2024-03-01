import request from '@/config/axios'
//模板导入
export const getExportData = (params) => {
  return request.get({
    url: `/landEstimate/exportData`,
    params,
    responseType: 'blob'
  })
}
//户名模糊搜索
export const getGetUserMap = (params) => {
  return request.get({
    url: `/landEstimate/getUserMap`,
    params
  })
}
export const postRelateUser = (data) => {
  return request.post({
    url: `/landEstimate/relateUser`,
    data
  })
}
