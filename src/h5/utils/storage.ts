/**
 * 所有本地存储定义
 * 要求：
 * 1.不要在代码中直接调用 window.localStorage.setItem 等 api，写多了无法维护存储
 * 2.存储一个定义一个 StorageKey
 */

export enum StorageKey {
  TOKEN = 'Authorization',
  USERINFO = 'UserInfo'
}

export const getStorage = (key: StorageKey): any => {
  try {
    const value = window.localStorage.getItem(key)
    if (value) {
      return value
    }
    return null
  } catch (e) {
    return null
  }
}

export const setStorage = (key: StorageKey, val: any) => {
  try {
    window.localStorage.setItem(key, val)
  } catch (e) {
    // error
  }
}

export const removeStorage = (key: StorageKey) => {
  try {
    window.localStorage.removeItem(key)
  } catch (e) {
    // error
  }
}
