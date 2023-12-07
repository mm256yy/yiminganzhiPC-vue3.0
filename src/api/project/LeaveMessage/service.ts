import request from '@/config/axios'
import { LeaveMessageDtoType } from './types'

/**
 * 查询留言列表
 */
export const getMessageApi = (
  query: Partial<LeaveMessageDtoType>
): Promise<TableResponse<LeaveMessageDtoType>> => {
  return request.get({ url: '/message', params: query })
}

/**
 * 留言审核通过
 */
export const passMessageApi = (id: number): Promise<void> => {
  return request.post({ url: `/message/pass/${id}` })
}

/**
 * 留言审核驳回
 */
export const notMessageApi = (id: number): Promise<void> => {
  return request.post({ url: `/message/notPass/${id}` })
}

/**
 * 删除留言
 */
export const delMessageByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/message/delete/${id}` })
}
