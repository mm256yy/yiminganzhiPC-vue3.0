export interface FileMngDtoType {
  id?: number
  doorNo?: string
  type: string
  [key: string]: any
}

export interface FileDtoType {
  name: string
  files: string
}

export interface FilesDtoType {
  name: string
  url: string
  uid: string
  status: string
}

export interface DetailQueryType {
  doorNo?: string
  householder?: string
  archiveNo?: number
  fileTitle: string
  filePage: number
  pageLow: number
  depositLocation: string
  keepTerm: string
  pageTop: number
  dutyPerson: string
  personPic: string
  pId: number
  projectId: number
  type: string
  pType: string
  formDate: any
  [key: string]: any
}

export interface DetailUpdateType {
  id?: string
  doorNo?: string
  householder?: string
  archiveNo?: number
  fileTitle: string
  filePage: number
  pageLow: number
  depositLocation: string
  keepTerm: string
  pageTop: number
  dutyPerson: string
  personPic: string
  pId: number
  projectId: number
  type: string
  formDate: any
  pType: string
  [key: string]: any
}
