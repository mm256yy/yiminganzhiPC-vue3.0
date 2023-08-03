import request from '@/config/axios'

// 获取房屋腾空信息
export const getHouseEmptyInfoApi = (doorNo: string): Promise<any> => {
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
export const submitHouseEmptyInfoApi = (data: any): Promise<any> => {
  return request.post({
    url: '/immigrantHouseEmpty/save',
    data
  })
}

// 获取土地腾空信息
export const getLandEmptyInfoApi = (doorNo: string): Promise<any> => {
  return request.get({
    url: '/immigrantLandEmpty/findByDoorNo',
    params: {
      doorNo
    }
  })
}

// 保存土地腾空信息
export const submitLandEmptyInfoApi = (data: any): Promise<any> => {
  return request.post({
    url: '/immigrantLandEmpty/save',
    data
  })
}

// 获取过渡安置信息
export const getExcessInfoApi = (doorNo: string): Promise<any> => {
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
export const submitExcessInfoApi = (data: any): Promise<any> => {
  return request.post({
    url: '/immigrantExcess/save',
    data
  })
}

// 获取归档信息
export const getDocumentApi = (doorNo: string): Promise<any> => {
  return request.get({
    url: '/immigrantDocumentation/findByDoorNo',
    params: {
      doorNo
    }
  })
}

// 保存归档信息
export const saveDocumentApi = (data: any): Promise<any> => {
  return request.post({
    url: '/immigrantDocumentation/save',
    data
  })
}
