// 接口
import request from '@/h5/axios'
import { DeliverDtoType } from './type'

/**
 * 投稿乡愁
 */
export const addHomesicknessApi = (data: any): Promise<TableResponse<DeliverDtoType>> => {
  return request.post({ url: `/h5/addHomesickness`, data })
}
