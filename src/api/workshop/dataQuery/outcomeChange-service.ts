import request from '@/config/axios'
// import { OutcomeChangeDtoType } from './outcomeChange-types'

// 查询实物变动基础列表
export const getPhysicalChangesBaseListApi = () => {
  return request.get({ url: `/resultForms/summary` })
}

// 查询实物变动列表
export const getPhysicalChangesListApi = (data: any) => {
  return request.post({ url: `/physical/changes/other/physicalChanges`, data })
}

// 获取变更导出
export const getChangeExport = (data: any) => {
  return request.post({ url: `/physical/changes/export`, data, responseType: 'blob' })
}

// 小型专项及农副业设施列表
export const getFacilitiesListApi = (params: any) => {
  return request.get({ url: `/resultForms/immigrant/facilities/report`, params })
}

// 导出小型专项及农副业设施统计表
export const exportFacilitiesApi = (params: any) => {
  return request.get({
    url: `/resultForms/export/immigrant/facilities/report`,
    params,
    responseType: 'blob'
  })
}
