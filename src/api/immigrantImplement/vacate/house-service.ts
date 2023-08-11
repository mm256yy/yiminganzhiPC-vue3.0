import request from '@/config/axios'

// 获取房屋腾空信息
export const getHouseVacateInfoApi = (doorNo: string): Promise<any> => {
  return request.get({
    url: '/immigrantHouseEmpty/findByDoorNo',
    params: {
      doorNo
    }
  })
}

// "doorNo": "3306831112100129", //户号
// "isHouseEmpty": "1", //0 无须办理 1确认办理
// "houseEmptyDate": "2023-07-28T09:23:27.915Z", //时间
// "houseEmptyOpinion": "" //移民户主意见

// 保存房屋腾空信息
export const saveHouseVacateInfoApi = (data: any): Promise<any> => {
  return request.post({
    url: '/immigrantHouseEmpty/save',
    data
  })
}
