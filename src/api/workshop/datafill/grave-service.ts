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
export const saveGraveListApi = (data: any[]): Promise<TableResponse<GraveDtoType>> => {
  return request.post({
    url: '/immigrantGrave/createAll',
    data: data.map((item) => {
      item.status = globalData.currentSurveyStatus
      return item
    })
  })
}

// 坟墓模板导出
export const exportGraveTemplate = () => {
  return request.get({
    url: '/peasantHousehold/exportGraveTemplate',
    responseType: 'blob'
  })
}
