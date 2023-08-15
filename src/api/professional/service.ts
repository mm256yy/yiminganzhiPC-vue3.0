import request from '@/config/axios'
import {
  ProfessionalProjectDtoType,
  ProfessionalScheduleDtoType,
  ProfessionalContractDtoType
} from './types'

/**
 * 获取专业项目列表
 * @param query 查询参数
 * @returns
 */
export const getProfessionalProjectListApi = (
  query: Partial<ProfessionalProjectDtoType>
): Promise<TableResponse<ProfessionalProjectDtoType>> => {
  return request.get({
    url: '/professionalProjects',
    params: query
  })
}

/**
 * 新增/编辑专业项目
 * @param data 表单数据
 * @returns
 */
export const editProfessionalProjectApi = (
  data: ProfessionalProjectDtoType
): Promise<ProfessionalProjectDtoType> => {
  return request.post({
    url: '/professionalProjects/save',
    data
  })
}

/**
 * 删除专业项目
 * @param id 当前行专业项目 ID
 * @returns
 */
export const delProfessionalProjectByIdApi = (id: number): Promise<void> => {
  return request.post({
    url: `/professionalProjects/delete/${id}`
  })
}

/**
 * 获取专业项目详情
 * @param id 当前行专业项目 ID
 * @returns
 */
export const getProfessionalProjectByIdApi = (id: number): Promise<ProfessionalProjectDtoType> => {
  return request.get({ url: `/professionalProjects/${id}` })
}

/**
 * 获取专项项目进度
 * @param id
 * @returns
 */
export const getProfessionalScheduleApi = (
  professionalId: number
): Promise<ProfessionalScheduleDtoType> => {
  return request.get({
    url: `/professionalSchedule/findByProfessionalId`,
    params: {
      professionalId
    }
  })
}

/**
 * 进度管理填写保存
 * @param data 表单数据
 * @returns
 */
export const saveProfessionalScheduleApi = (data: any): Promise<ProfessionalScheduleDtoType> => {
  return request.post({
    url: '/professionalSchedule/save',
    data
  })
}

/**
 * 获取合同列表
 * @param query 查询参数
 * @returns
 */
export const getProfessionalContractApi = (
  query: Partial<ProfessionalContractDtoType>
): Promise<TableResponse<ProfessionalContractDtoType>> => {
  return request.get({
    url: '/professionalContract',
    params: query
  })
}

/**
 * 新增/更新合同
 * @param data 表单数据
 * @returns
 */
export const editProfessionalContractApi = (
  data: ProfessionalContractDtoType
): Promise<ProfessionalContractDtoType> => {
  return request.post({
    url: '/professionalContract/save',
    data
  })
}

/**
 * 删除合同
 * @param id 当前行合同 ID
 * @returns
 */
export const delProfessionalContractByIdApi = (id: number): Promise<void> => {
  return request.post({
    url: `/professionalContract/delete/${id}`
  })
}

/**
 * 查询合同信息
 * @param id 某条专业项目详情 id
 * @returns
 */
export const getProfessionalContractByIdApi = (
  id: number
): Promise<ProfessionalContractDtoType> => {
  return request.get({ url: `/professionalContract/${id}` })
}
