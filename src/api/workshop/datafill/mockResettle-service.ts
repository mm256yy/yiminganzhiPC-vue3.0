import request from '@/config/axios'
import { ResettleInfoBody } from './mockResettle-types'

/**
 * 查询安置意愿信息列表
 */

export const saveSimulateDemographicApi = (data: ResettleInfoBody[]) => {
  return request.post({
    url: '/simulateDemographic/save',
    data
  })
}

/**
 * 获取方案
 * @param doorNo 户号
 * @returns 方案列表
 */
export const getBestResettlePlanApi = (doorNo: string) => {
  return request.get({
    url: '/simulateImmigrantSettle/getBest',
    params: {
      doorNo
    }
  })
}

/**
 * 获取生产安置人口
 * @param params
 * @returns 人口列表
 */
export const getSimulateDemographicApi = (params: any) => {
  return request.get({
    url: '/simulateDemographic',
    params: {
      ...params,
      status: 'Implementation'
    }
  })
}

/**
 * 获取生产安置
 */
export const getSimulateImmigrantSettleApi = (doorNo: string) => {
  return request.get({
    url: '/simulateImmigrantSettle/findByDoorNo',
    params: {
      doorNo,
      status: 'Implementation'
    }
  })
}

/**
 * 保存搬迁安置信息
 */
export const saveSimulateImmigrantSettleApi = (data: any) => {
  return request.post({
    url: '/simulateImmigrantSettle/save',
    data
  })
}
