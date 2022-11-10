import request from '@/config/axios'

/**
 * 分页基类型
 */
export type PagedQueryType = {
  page: number
  size: number
  sort?: string
}

/**
 * 树结构类型
 */
export type TreeNodeType = {
  id: string
  label: string
  children?: TreeNodeType[]
  disabled?: string | Function
  isLeaf?: string | Function
  class?: string | Function
}

// 获取所有字典
export const getDictApi = (): Promise<IResponse> => {
  return request.get({ url: '/dict/list' })
}

// 模拟获取某个字典
export const getDictOneApi = async (): Promise<IResponse> => {
  return request.get({ url: '/dict/one' })
}
