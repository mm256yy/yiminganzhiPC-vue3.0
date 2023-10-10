import request from '@/config/axios'

// 相关手续保存
export const saveProceduresApi = (data: any): Promise<any> => {
  return request.post({ url: '/immigrantProcedures/save', data })
}

// 相关手续查询
export const getProceduresApi = (doorNo: any): Promise<any> => {
  return request.get({
    url: '/immigrantProcedures/findByDoorNo',
    params: {
      doorNo
    }
  })
}
