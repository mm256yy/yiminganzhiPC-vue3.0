import request from '@/config/axios'

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
 * 检验是否归档
 * @param data
 * @returns
 */
export const documentationCheckApi = (doorNo: string, type: string) => {
  return request.get({ url: '/immigrantDocumentation/check', params: { doorNo, type } })
}
