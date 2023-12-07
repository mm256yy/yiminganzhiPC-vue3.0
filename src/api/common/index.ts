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
  id: string | number
  label: string
  children?: TreeNodeType[]
  disabled?: string | Function
  isLeaf?: string | Function
  class?: string | Function
  data?: any
}

// 获取所有字典
export const getDictApi = (): Promise<IResponse> => {
  return request.get({ url: '/dict/list' })
}

// 模拟获取某个字典
export const getDictOneApi = async (): Promise<IResponse> => {
  return request.get({ url: '/dict/one' })
}

// 上传文件
export const uploadFileApi = (file) => {
  return request.post({
    url: '/file',
    data: { file },
    headersType: 'multipart/form-data'
  })
}

// 下载文件
export const downloadFileApi = (fileName: string) => {
  return request.get({ url: `/file/download/${fileName}` })
}

// 获取用户token
export const getTokenApi = () => {
  return request.post({ url: `/leader/getToken` })
}
