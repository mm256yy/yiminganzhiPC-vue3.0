import request from '@/config/axios'
import { NewsDtoType } from './types'

/**
 * 查询文章信息列表
 */
export const getNewsListApi = (
  query: Partial<NewsDtoType>
): Promise<TableResponse<NewsDtoType>> => {
  return request.get({ url: '/news', params: query })
}

/**
 * 新增文章信息
 */
export const addNewsApi = (data: NewsDtoType): Promise<NewsDtoType> => {
  return request.post({ url: '/news/create', data })
}

/**
 * 更新文章信息
 */
export const updateNewsApi = (data: NewsDtoType): Promise<NewsDtoType> => {
  return request.post({ url: '/news/update', data })
}

/**
 * 删除文章信息
 */
export const delNewsByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/news/delete/${id}` })
}

/**
 * 查询单个文章信息
 */
export const getNewsByIdApi = (id: number): Promise<NewsDtoType> => {
  return request.get({ url: `/news/${id}` })
}
