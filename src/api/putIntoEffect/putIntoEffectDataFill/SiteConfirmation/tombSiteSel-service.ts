import request from '@/config/axios'
import { GraveType } from './tombSiteSel-types'

/**
 * 获取坟墓择址列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getGraveListApi = (doorNo: string) => {
  return request.get({ url: '/immigrantGrave', params: { doorNo } })
}

/**
 * 保存多个坟墓择址数据
 * @param data 表单提交数据
 * @returns
 */
export const saveGraveApi = (data: any): Promise<TableResponse<GraveType>> => {
  return request.post({ url: '/immigrantGrave/createAll', data })
}

/**
 * 获取坟墓择址档案数据
 * @param doorNo 户号
 * @returns
 */
export const getGraveDocumentationApi = (doorNo: string) => {
  return request.get({ url: '/immigrantDocumentation/findByDoorNo', params: { doorNo } })
}

/**
 * 档案上传
 * @param data 表单提交数据
 * @returns
 */
export const saveGraveDocumentationApi = (data: any): Promise<TableResponse<GraveType>> => {
  return request.post({ url: '/immigrantDocumentation/save', data })
}
