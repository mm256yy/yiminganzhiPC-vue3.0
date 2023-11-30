export interface LeaveMessageDtoType {
  id: number
  content: string
  targetType: string
  title: string
  targetId: string
  leaveMessagePeopleName: string
  leaveMessagePeopleId: string
  leaveMessagePeopleVillageName: string
  leaveMessageLocation: string
  createTime: string
  auditStatus: number
  [key: string]: any
}
