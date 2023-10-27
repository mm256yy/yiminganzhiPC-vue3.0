// 接口
import request from '@/config/axios'
//数据大屏
export const getChartScreen = (): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getChartScreen`
  })
}
