import request from '@/config/axios'
import { HouseholdType } from './types'

/**
 * 保存居民户信息
 * @returns
 */
export const updateHouseholdInfo = (data: HouseholdType) => {
  return request.post({
    url: '/peasantHousehold/update',
    data
  })
}
