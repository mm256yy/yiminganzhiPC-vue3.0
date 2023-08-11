import request from '@/config/axios'
import { DelHouseDtoType } from './types'

/**
 * 删除
 * @param data
 * @returns
 */
export const delHouseConfirmationApi = (data: DelHouseDtoType) => {
  return request.post({
    url: '/immigrant_house/delete/implementationDelete',
    data
  })
}
