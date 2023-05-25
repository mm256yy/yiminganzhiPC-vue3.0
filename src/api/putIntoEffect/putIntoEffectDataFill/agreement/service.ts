import request from '@/config/axios'

/**
 * 协议签订详情
 * @param doorNo
 * @returns
 */
export const getAgreementApi = (doorNo: string) => {
  return request.get({
    url: `/peasantHousehold/signDetails`,
    params: {
      doorNo
    }
  })
}
