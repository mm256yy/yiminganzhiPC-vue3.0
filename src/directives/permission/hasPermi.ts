import type { App, Directive, DirectiveBinding } from 'vue'
import { intersection } from 'lodash-es'
import { isArray } from '@/utils/is'
import { useAppStoreWithOut } from '@/store/modules/app'

const appStore = useAppStoreWithOut()

const hasPermission = (value: string | string[]): boolean => {
  if (appStore.getIsSysAdmin) {
    // 系统管理员有所有权限
    return true
  }
  const permissions = appStore.getPermissions
  if (!value) {
    throw new Error('请设置操作权限')
  }
  if (!isArray(value)) {
    return permissions.includes(value as string)
  }
  return (intersection(value, permissions) as string[]).length > 0
}

function hasPermi(el: Element, binding: DirectiveBinding) {
  const value = binding.value

  const flag = hasPermission(value)
  if (!flag) {
    el.parentNode?.removeChild(el)
  }
}
const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  hasPermi(el, binding)
}

const permiDirective: Directive = {
  mounted
}

export const setupPermissionDirective = (app: App<Element>) => {
  app.directive('hasPermi', permiDirective)
}

export default permiDirective
