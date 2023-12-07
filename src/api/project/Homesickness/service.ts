import request from '@/config/axios'
// import { NewsDtoType } from './types'

/**
 * 查询乡愁征文列表
 */
export const getNewsListApi = (query: Partial<any>): Promise<TableResponse<any>> => {
  return request.get({ url: '/homesickness', params: query })
}

/**
 * 新增乡愁征文
 */
export const addNewsApi = (data: any): Promise<any> => {
  return request.post({ url: '/homesickness/create', data })
}

/**
 * 更新乡愁征文
 */
export const updateNewsApi = (data: any): Promise<any> => {
  return request.post({ url: '/homesickness/update', data })
}

/**
 * 删除乡愁征文
 */
export const delNewsByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/homesickness/delete/${id}` })
}

/**
 * 查询乡愁征文
 */
export const getNewsByIdApi = (id: number): Promise<any> => {
  return request.get({ url: `/homesickness/${id}` })
}
