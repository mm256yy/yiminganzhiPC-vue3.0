import request from '@/config/axios'

//领导端大屏
export const getLeadershipScreen = (params: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getLeadershipScreen`,
    params
  })
}

//信息反馈
export const feedbackList = (params: any): Promise<any> => {
  return request.get({
    url: `feedback`,
    params
  })
}

//进度预警
export const warningList = (params: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/warning`,
    params
  })
}

//行政村完成表
export const villageScheduleList = (query: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/villageSchedule`,
    params: query
  })
}

//新政村下拉
export const getVillageList = (query: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getVillageList`,
    params: query
  })
}

//进度排行榜
export const scheduleRankList = (query: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/scheduleRank`,
    params: query
  })
}

// 图表大屏
export const getChartScreenList = (query: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getChartScreen`,
    params: query
  })
}

//移民村分析
export const getVillageAnalysisList = (query: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getVillageAnalysis`,
    params: query
  })
}

// t土地
export const getLand = (query: any): Promise<any> => {
  return request.get({
    url: `/h5/getLand`,
    params: query
  })
}

export const getLeadershipScreenDetail = (query: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getLeadershipScreenDetail`,
    params: query
  })
}
// api/
//getFundAnalysis
export const getFundAnalysis = (): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getFundAnalysis`
  })
}
// /api/leadershipScreen/getLanAnalysisReport
export const getLanAnalysisReport = (params: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getLanAnalysisReport`,
    params
  })
}

// 获取预警列表
export const getWarningTypeList = (type: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/new/warning/${type}`
  })
}

// 获取预警详情
export const getWarningDetail = (params: any): Promise<any> => {
  return request.get({
    url: `leadershipScreen/new/warning/details`,
    params
  })
}
