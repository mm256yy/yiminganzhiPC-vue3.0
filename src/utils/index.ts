import type { Plugin } from 'vue'

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

// 校验身份证
export const cardReg =
  /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/

export function validateIdNo(rule, value, callback) {
  console.log(rule)

  const reg = cardReg
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

/**
 * 字符通过某个符号进行拆分为一个新的数组
 * @param str
 * @param separateChar
 * @returns
 */
export const splitStr = (str: string, separateChar: any) => {
  let arr: any = []
  if (str) {
    arr = str.split(separateChar)
    return arr
  } else {
    return '-'
  }
}

/**
 * 超出长度的字符串进行隐藏
 * @param{Object} str 字符串
 * @param{Object} num 截取字符串的位数
 */
export const hideStr = (str: string, num: number) => {
  if (str) {
    if (str.length > num) {
      str = str.substring(0, num) + '...'
    }
  }
  return str
}

/**
 * 字符串处理
 * 1、带单位的字符串进行拼接后显示，不带单位的直接显示
 * 2、字符串为空或不存在的，显示 '-'
 * @param(Object) str 字符串
 * @param(Object) unit 单位
 */
export const fmtStr = (str: any, unit?: string) => {
  if (str) {
    if (unit) {
      return str + unit
    } else {
      return str
    }
  } else {
    return '-'
  }
}

/**
 * 将数组中拥有相同值的部分放在一起重新排序
 * @param arr 原数组
 * @param key 相同值的 key
 * @returns newArr 返回新数组
 */
export const sortSameArr = (arr: any, key: any) => {
  // sameArr 数组中的每一个值是一个数组，数组中的每一个元素是数组中相同 doorNo 的下标
  // 如：[[0, 1, 2, 3, 4], [5, 7], [6, 8]]
  const indexArr: any = []

  // obj 存储的是键值为 doorNo 在 sameArr 数组中的下标 index，如：{ 张三: 0 }
  const obj: any = {}

  arr.map((item: any, index: number) => {
    const doorNo = item[key]
    const sIndex = obj[doorNo]
    if (sIndex !== undefined) {
      indexArr[sIndex].push(index)
    } else {
      obj[doorNo] = indexArr.length
      indexArr.push([index])
    }
  })

  // newArr 是排序后最终返回的新数组
  const newArr: any = []
  indexArr.map((item: any) => {
    item.map((index: number) => {
      newArr.push(arr[index])
    })
  })
  return newArr
}

export const urlReg =
  /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*/

export const versionReg = /^[1-9]\.(\d{1,2})\.(\d{1,2})$/

// 户号后四位之前的显示
export const filterViewDoorNoWithBefore = (doorNo: string) => {
  if (!doorNo) {
    return ''
  }
  return `${doorNo[5]}${doorNo[7]}${doorNo[8]}`
}

// 显示doorNo
export const filterViewDoorNo = (data: any): string => {
  const { showDoorNo, type } = data || {}
  if (!showDoorNo) {
    return ''
  }
  // 6、8、9、11、12、13、14、15、16
  if (type && type === 'PeasantHousehold' && showDoorNo.length === 16) {
    const before = filterViewDoorNoWithBefore(showDoorNo)
    const lastSix = showDoorNo.slice(
      showDoorNo.length - 6 < 0 ? 0 : showDoorNo.length - 6,
      showDoorNo.length
    )
    return `${before}${lastSix}`
  }
  return showDoorNo
}
// 显示showdoorNo
export const filterViewDoorNos = (data: any): string => {
  const { showDoorNo, type } = data || {}
  if (!showDoorNo) {
    return ''
  }
  // 6、8、9、11、12、13、14、15、16
  if (type && type === 'PeasantHousehold' && showDoorNo.length === 16) {
    const before = filterViewDoorNoWithBefore(showDoorNo)
    const lastSix = showDoorNo.slice(
      showDoorNo.length - 6 < 0 ? 0 : showDoorNo.length - 6,
      showDoorNo.length
    )
    return `${before}${lastSix}`
  }
  return showDoorNo
}
/**
 * 获取字典对应的 label
 * @param arr  字典数据
 * @param data 传入的值
 * @returns
 */
export const fmtDict = (arr: any[], data) => {
  if (arr && arr.length) {
    const newArr: any = arr.filter((item: any) => item.value === data)
    if (newArr && newArr.length) {
      return newArr[0].label
    }
  } else {
    return ''
  }
}

/**
 * 深拷贝
 * @param {object} target - 需要被深拷贝的对象
 * @param {object} map - 注入到已有对象，选填
 * @return {object} 结果对象
 */
export function deepClone(target: any, map?: any) {
  let cloneTarget: any
  if (!map) {
    map = new WeakMap()
  }
  if (target !== null && (typeof target === 'object' || Array.isArray(target))) {
    cloneTarget = Array.isArray(target) ? [] : {}
    const keys = Object.keys(target)
    if (map.has(target)) {
      return map.get(target)
    }
    for (const key of keys) {
      cloneTarget[key] = deepClone(target[key], map) // eslint-disable-line
    }
    map.set(target, cloneTarget)
  } else {
    cloneTarget = target
  }

  return cloneTarget
}
//防抖函数,默认100ms
export const debounce = (() => {
  let timer
  return (callback: any, ms: any = 100) => {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
