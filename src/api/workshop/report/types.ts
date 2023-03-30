export interface ReportQueryType {
  name?: string
  type: string
  content?: string
  projectId?: number
  fileType?: string
  projectType?: string
  changeId?: string
  fileUrl?: string
  changeType?: string
  changeDate?: string
  [key: string]: any
}

export interface ReportUpdateType {
  id?: string
  name: string
  type: string
  content: string
  projectId: number
  fileType: string
  projectType: string
  fileUrl: string
  changeType: string
  changeDate: string
  changeId: string
  [key: string]: any
}
