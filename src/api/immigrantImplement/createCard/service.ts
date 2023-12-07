import request from '@/config/axios'
import { PeasantHouseholdType, CreateCardType } from './types'

/**
 * 保存居民户账户信息
 * @returns
 */
export const updatePeasantHouseholdInfo = (data: PeasantHouseholdType) => {
  return request.post({
    url: '/peasantHousehold/update',
    data
  })
}

/**
 * 获取费用补偿情况列表数据
 * @param doorNo 户号
 * @returns
 */
export const getCompensationCardList = (doorNo: string) => {
  return request.get({
    url: '/immigrantCompensationCard/findByDoorNo',
    params: { doorNo }
  })
}

/**
 * 保存/确认奖励费
 * @param data
 * @returns
 */
export const saveRewardFee = (data: CreateCardType) => {
  return request.post({
    url: '/immigrantCompensationCard/save',
    data
  })
}
export const getcompanyList = (params) => {
  return request.get({
    url: `/company`,
    params
  })
}
