import request from '@/config/axios'
import type { DocumentationType } from './common-types'

/**
 * 获取择址确认配置信息
 * @param projectId 项目 id
 * @param type 配置类型 1 生产用地地块编号, 2 宅基地地块编号，3 储藏室编号，4 车位编号
 * @param name 选项名
 * @returns
 */
export const getChooseConfigApi = (projectId: number, type: string | number, name?: string) => {
  return request.get({
    url: `/chooseConfig`,
    params: {
      projectId,
      type,
      name,
      size: 1000
    }
  })
}

/**
 * 获取档案数据
 * @param doorNo 户号
 * @returns
 */
export const getDocumentationApi = (doorNo: string) => {
  return request.get({ url: '/immigrantDocumentation/findByDoorNo', params: { doorNo } })
}

/**
 * 档案上传
 * @param data 表单提交数据
 * @returns
 */
export const saveDocumentationApi = (data: any): Promise<DocumentationType> => {
  return request.post({ url: '/immigrantDocumentation/save', data })
}

/**
 * 检验是否归档
 * @param data
 * @returns
 */
export const documentationCheckApi = (doorNo: string, type: string) => {
  return request.get({ url: '/immigrantDocumentation/check', params: { doorNo, type } })
}
