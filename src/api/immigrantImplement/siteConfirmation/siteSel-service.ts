import request from '@/config/axios'
import { SiteType } from './siteSel-types'

/**
 * 获取选房择址列表
 * @param doorNo
 * @returns
 */
export const getImmigrantChooseHouseApi = (doorNo: string) => {
  return request.get({
    url: `/immigrantChooseHouse`,
    params: {
      doorNo
    }
  })
}

/**
 * 获取幢号、室号选项列表
 * @param doorNo
 * @returns
 */
export const getHouseConfigApi = (
  projectId: string | number,
  level: string | number,
  parentCode?: string | number,
  name?: string
) => {
  return request.get({
    url: `/houseConfig`,
    params: {
      projectId,
      level,
      settleAddress: parentCode,
      name,
      size: 1000
    }
  })
}

/**
 * 档案上传
 * @param data
 * @returns
 */
export const saveDocumentationApi = (data: any): Promise<TableResponse<SiteType>> => {
  return request.post({
    url: '/immigrantChooseHouse/save',
    data
  })
}

/**
 * 保存
 * @param data
 * @returns
 */
export const saveImmigrantChooseHouseApi = (data: any): Promise<TableResponse<SiteType>> => {
  return request.post({
    url: '/immigrantChooseHouse/saveOne',
    data
  })
}

/**
 * 批量档案上传
 * @param data
 * @returns
 */
export const saveBatchDocumentationApi = (data: any): Promise<TableResponse<SiteType>> => {
  return request.post({
    url: '/immigrantChooseHouse/saveOne',
    data
  })
}
