// import type { Plugin } from 'vue'

/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * 格式化时间为标准 yyyy-MM-dd 日期格式
 */
export function formatDate(time: Date | number | string) {
  return formatTime(time, 'yyyy-MM-dd')
}

/**
 * 格式化时间为标准 yyyy-MM-dd HH:mm:ss 日期时间格式
 */
export function formatDateTime(time: Date | number | string) {
  return formatTime(time, 'yyyy-MM-dd HH:mm:ss')
}

export function standardFormatDate(time: Date | number | string) {
  if (!time) {
    return time
  }
  const date = new Date(time)
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}

/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt?: string) {
  if (!time) {
    return undefined
  } else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    fmt = fmt || 'yyyy-MM-dd'
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}

/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

// 根据身份证计算年龄
export function analyzeIDCard(identityCard) {
  const len = (identityCard + '').length
  if (len == 0) {
    return null
  } else {
    if (len != 15 && len != 18) {
      //身份证号码只能为15位或18位其它不合法
      return null
    }
  }
  let strBirthday
  if (len == 18) {
    //处理18位的身份证号码从号码中得到生日和性别代码
    strBirthday =
      identityCard.substr(6, 4) +
      '/' +
      identityCard.substr(10, 2) +
      '/' +
      identityCard.substr(12, 2)
  }
  if (len == 15) {
    strBirthday =
      '19' +
      identityCard.substr(6, 2) +
      '/' +
      identityCard.substr(8, 2) +
      '/' +
      identityCard.substr(10, 2)
  }
  //时间字符串里，必须是“/”
  const birthDate = new Date(strBirthday)
  const nowDateTime = new Date()
  let age = nowDateTime.getFullYear() - birthDate.getFullYear()
  //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if (
    nowDateTime.getMonth() < birthDate.getMonth() ||
    (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())
  ) {
    age--
  }
  return age
}

export function validateIdNo(rule, value, callback) {
  console.log(rule)

  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的公民身份号码'))
    } else {
      callback()
    }
  }
}

export function checkTel(rule, value, callback) {
  console.log(rule)
  const regTel1 = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value) //带区号的固定电话
  const regTel2 = /^(\d{7,8})(-(\d{3,}))?$/.test(value) //不带区号的固定电话
  const regTel3 = /^1[3,4,5,6,7,8,9][0-9]{9}$/.test(value)

  if (value != '') {
    if (!regTel1 && !regTel2 && !regTel3) {
      callback(new Error('电话号码输入有误！'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
