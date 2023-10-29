// 接口
import request from '@/h5/axios'
//数据大屏
export const getChartScreen = (): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getChartScreen`
  })
}
