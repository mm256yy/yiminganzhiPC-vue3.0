import request from '@/config/axios'
import { GraveDtoType } from './grave-types'
import { globalData } from '@/config/fill'
/**
 * 查询坟墓信息列表
 */

export const getGraveListApi = (
  query: Partial<GraveDtoType>
): Promise<TableResponse<GraveDtoType>> => {
  return request.get({
    url: '/immigrantGrave',
    params: { ...query, status: globalData.currentSurveyStatus }
  })
}

/**
 * 保存
 */
export const saveGraveListApi = (data: any): Promise<TableResponse<GraveDtoType>> => {
  data.immigrantGraveList.map((item) => {
    item.status = globalData.currentSurveyStatus
    return item
  })
  const param = { ...data, peasantHouseholdId: data.peasantHouseholdId }
  return request.post({
    url: '/immigrantGrave/createAll',
    data: param
  })
}

// 坟墓模板导出
export const exportGraveTemplate = (params: any) => {
  return request.get({
    url: '/peasantHousehold/exportGraveTemplate',
    params,
    responseType: 'blob'
  })
}
