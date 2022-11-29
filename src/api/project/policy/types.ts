export interface PolicyUploadFileType {
  name: string
  url: string
}

// Array<PolicyUploadFileType>
export interface PolicyDtoType {
  id: number
  title: string
  docNo: string
  enclosure: string
  projectId: number
  sortNum: number
  type: string
  publicityTime: string
  issuingAgency: string
  keyWord: string
  status: '1' | '0'
  statusText: string
  [key: string]: any
}
