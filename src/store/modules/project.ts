import { defineStore } from 'pinia'
import { store } from '../index'

interface ILabelValue {
  label: string
  value: any
}

export interface IProject {
  projects: ILabelValue[]
}

export const useProjectStore = defineStore('project', {
  state: (): IProject => ({
    projects: []
  }),
  getters: {
    getProjects(): ILabelValue[] {
      return this.projects
    }
  },
  actions: {
    setProjects(data: ILabelValue[]) {
      this.projects = data
    }
  }
})

export const useProjectStoreWithOut = () => {
  return useProjectStore(store)
}
