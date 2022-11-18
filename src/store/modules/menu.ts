import { defineStore } from 'pinia'
import { store } from '../index'
import type { MenuDtoType } from '@/api/sys/types'

interface IMenuWithWrap {
  id: number
  name: string
  children: MenuDtoType[]
}

export interface IMenu {
  menuTree: MenuDtoType[]
  menuTreeWithWrap: IMenuWithWrap[]
}

export const useMenuStore = defineStore('menu', {
  state: (): IMenu => ({
    menuTree: [],
    menuTreeWithWrap: [
      {
        id: 0,
        name: '顶层类目',
        children: []
      }
    ]
  }),
  getters: {
    getMenuTree(): MenuDtoType[] {
      return this.menuTree
    },
    getMenuTreeWithWrap(): IMenuWithWrap[] {
      return this.menuTreeWithWrap
    }
  },
  actions: {
    setMenuTree(data: MenuDtoType[]) {
      this.menuTree = data
      this.menuTreeWithWrap = [
        {
          ...this.menuTreeWithWrap[0],
          children: data
        }
      ]
    }
  }
})

export const useMenuStoreWithOut = () => {
  return useMenuStore(store)
}
