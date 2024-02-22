import request from '@/config/axios'
import { ConfigDtoType } from './common-types'

/**
 * 获取择址确认配置信息
 * @param projectId 项目 id
 * @param type 配置类型 1 生产用地地块编号, 2 宅基地地块编号，3 储藏室编号，4 车位编号
 * @param name 选项名
 * @returns
 */
export const getChooseConfigApi = (data: ConfigDtoType): Promise<TableResponse<ConfigDtoType>> => {
  return request.get({
    url: `/chooseConfig`,
    params: {
      ...data,
      size: 1000
    }
  })
}

/**
 * 检验是否归档
 * @param data
 * @returns
 */
export const documentationCheckApi = (doorNo: string, type: string) => {
  return request.get({ url: '/immigrantDocumentation/check', params: { doorNo, type } })
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
 * 择房查看
 * @param id
 * @returns
 */
export const getChooseHouseApi = (id: any) => {
  return request.get({ url: `/immigrantChooseHouse/getById?id=${id}` })
}

/**
 * 生产用地查看
 * @param id
 * @returns
 */
export const getImmigrantLandApi = (id: any) => {
  return request.get({ url: `/immigrantLand/getById?id=${id}` })
}
