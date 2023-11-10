// 接口
import request from '@/h5/axios'
//进度预警
export const getWarning = (): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/warning`
  })
}
//echart 进度
export const getVillageSchedule = (): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/villageSchedule?type=1`
  })
}
export const getLeadershipScreen = (params: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getLeadershipScreen`,
    params
  })
}
