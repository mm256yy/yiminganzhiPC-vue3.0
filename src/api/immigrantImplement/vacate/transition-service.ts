import request from '@/config/axios'

// 获取过渡安置信息
export const getTransitionInfoApi = (doorNo: string): Promise<any> => {
  return request.get({
    url: '/immigrantExcess/findByDoorNo',
    params: {
      doorNo
    }
  })
}

// "doorNo": "3306831112100129", //户号
// "isExcess": "1",
// "excessStartDate": "2023-07-28T09:23:27.915Z",
// "excessEndDate": "2023-07-28T09:23:27.915Z",
// "excessAddress": "213"

// 保存过渡安置信息
export const saveTransitionInfoApi = (data: any): Promise<any> => {
  return request.post({
    url: '/immigrantExcess/save',
    data
  })
}
// 更改过渡完成状态
export const completeApi = (doorNo: string): Promise<any> => {
  return request.get({
    url: '/immigrantExcess/complete',
    params: {
      doorNo
    }
  })
}
