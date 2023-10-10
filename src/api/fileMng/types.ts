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
