import request from '@/config/axios'
import { ProdLandType } from './prodLand-types'

/**
 * 获取生产用地信息
 * @param doorNo
 * @returns
 */
export const getImmigrantLandApi = (doorNo: string) => {
  return request.get({
    url: `/immigrantLand/findByDoorNo`,
    params: {
      doorNo
    }
  })
}

/**
 * 保存
 * @param data
 * @returns
 */
export const saveImmigrantLandApi = (data: ProdLandType) => {
  return request.post({
    url: '/immigrantLand/save',
    data
  })
}
