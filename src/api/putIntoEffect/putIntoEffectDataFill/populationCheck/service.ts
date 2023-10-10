import request from '@/config/axios'
import { DelDemographicDtoType } from './types'

/**
 * 删除
 * @param data
 * @returns
 */
export const delDemographicApi = (data: DelDemographicDtoType) => {
  return request.post({
    url: '/demographic/delete/implementationDelete',
    data
  })
}
