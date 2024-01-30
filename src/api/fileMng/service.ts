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

/**
 * 获取档案列表
 */
export const getFileList = (params: any) => {
  return request.get({
    url: '/documentation/findPeasantHouseholdList',
    params
  })
}

/**
 * 获取专业项目档案列表
 * @param params
 * @returns
 */
export const getProfessionalProjectFileList = (params: any) => {
  return request.get({
    url: '/documentation/findProProjectList',
    params
  })
}

/**
 * 获取档案详情列表
 * @param data
 * @returns
 */
export const getFileDetailList = (params: any) => {
  return request.get({
    url: '/documentation',
    params
  })
}

/**
 * 新增档案信息
 * @param data
 * @returns
 */
export const addFileInfo = (data: any) => {
  return request.post({
    url: '/documentation/insert',
    data
  })
}

/**
 * 修改档案信息
 * @param data
 * @returns
 */
export const updateFileInfo = (data: any) => {
  return request.post({
    url: '/documentation/update',
    data
  })
}

/**
 * 查看详情列表
 * @param id
 * @returns
 */
export const checkFileDetailList = (id: any) => {
  return request.get({
    url: `/documentation/${id}`
  })
}

/**
 * 删除档案详情
 * @param id
 * @returns
 */
export const deleteFileDetail = (id: any) => {
  return request.post({
    url: `documentation/delete/${id}`
  })
}

/**
 * 获取报告及批文列表
 * @param id
 * @returns
 */
export const getApprovalList = (params: any) => {
  return request.get({
    url: `documentation/findApprovalList`,
    params
  })
}
