import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosError
} from 'axios'
import qs from 'qs'
import { config } from './config'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/store/modules/app'

const { result_code, base_url } = config
export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH]
const appStore = useAppStore()

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL, // api 的 base_url
  timeout: config.request_timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (
      config.method === 'post' &&
      (config.headers as AxiosRequestHeaders)['Content-Type'] == 'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }
    // 添加统一的项目id请求头
    ;(config.headers as AxiosRequestConfig)['Project-Id'] = appStore.getCurrentProjectId
    ;(config.headers as AxiosRequestConfig)['Project-Status'] = appStore.getProjectStatus
    // 添加 token
    const token = appStore.getToken
    if (token) {
      ;(config.headers as AxiosRequestHeaders)['Authorization'] = token
    }
    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url as string
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.config.responseType === 'blob') {
      // 如果是文件流，直接过
      return response
    } else if (response.data && response.data.code === result_code) {
      return response.data.data
    } else if (!response.data) {
      return response
    } else {
      ElMessage.error(response.data.message)
    }
  },
  (error: AxiosError) => {
    console.log('err', error) // for debug
    const res = error.response
    const data = res?.data as any
    if (data && (data.code === 401 || data.status === 401)) {
      // 清除用户信息
      appStore.setUserJwtInfo(null)
      // token 无效，跳转到登录
      window.location.href = '/#/login'
    }
    let message = data.message || error.message || '发生错误'
    if (data && data.code === 400 && data.data && data.data.length > 0) {
      message = `<h3>${data.message}</h3>`
      message += '<ol style="margin: 0; padding-left: 20px;">'
      message += data.data.map((x) => `<li>${x.field} - ${x.message}</li>`).join('')
      message += '</ol>'
      ElMessage({
        type: 'error',
        dangerouslyUseHTMLString: true,
        message
      })
      return Promise.reject(error)
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export { service }
