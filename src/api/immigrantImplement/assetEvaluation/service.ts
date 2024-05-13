import request from '@/config/axios'

/**
 * 获取档案数据
 * @param doorNo 户号
 * @returns
 */
export const getDocumentationApi = (doorNo: string) => {
  return request.get({ url: '/immigrantDocumentation/findByDoorNo', params: { doorNo } })
}
// 生成pdf /api/exportWord/exportReportPdf
export const getexportReportPdfApi = (params) => {
  return request.get({ url: '/exportWord/exportReportPdf', params, responseType: 'blob' })
}
