import request from '@/config/axios'
import { FileMngDtoType } from './types'

/**
 * 查询档案管理列表
 */

export const getFileMangeList = (params: FileMngDtoType) => {
  return request.get({
    url: '/filesManage/getFilesManage',
    params
  })
}
