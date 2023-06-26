import request from '@/config/axios'
import { HouseDtoType } from './house-types'
import { globalData } from '@/config/fill'
/**
 * 查询房屋信息列表
 */

export const getHouseListApi = (
  query: Partial<HouseDtoType>
): Promise<TableResponse<HouseDtoType>> => {
  return request.get({
    url: '/immigrant_house',
    params: { status: globalData.currentSurveyStatus, ...query }
  })
}

/**
 * 新增房屋信息
 */
export const addHouseApi = (data: HouseDtoType): Promise<HouseDtoType> => {
  return request.post({
    url: '/immigrant_house/create',
    data: { ...data, status: globalData.currentSurveyStatus }
  })
}

/**
 * 新增房屋信息(房屋确权)
 */
export const addFwHouseApi = (data: HouseDtoType): Promise<HouseDtoType> => {
  return request.post({
    url: '/immigrant_house/create',
    data: { ...data }
  })
}

/**
 * 更新房屋信息
 */
export const updateHouseApi = (data: HouseDtoType): Promise<HouseDtoType> => {
  return request.post({
    url: '/immigrant_house/update',
    data: { ...data, status: globalData.currentSurveyStatus }
  })
}

/**
 * 更新房屋信息
 */
export const updateFwHouseApi = (data: HouseDtoType): Promise<HouseDtoType> => {
  return request.post({
    url: '/immigrant_house/update',
    data: { ...data }
  })
}

/**
 * 删除房屋信息
 */
export const delHouseByIdApi = (id: number, reason?: string): Promise<void> => {
  return request.post({
    url: `/immigrant_house/delete/${id}`,
    data: {
      reason
    }
  })
}

/**
 * 查询单个房屋信息
 */
export const getHouseByIdApi = (id: number): Promise<HouseDtoType> => {
  return request.get({ url: `/immigrant_house/${id}` })
}

/**
 * 模版下载
 */
export const downHouseTemplateApi = (name: string): Promise<any> => {
  return request.get({ url: `/import_template/${name}` })
}
