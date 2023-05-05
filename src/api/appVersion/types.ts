export interface AppVersionDtoType {
  id: number
  appId: string // 应用id 前端提供
  title: string // 更新标题
  content: Array<string> // 更新内容
  apkUrl: string // apk包的链接
  version: string // 版本  版本不得低于线上版本
  platform: 'android' | 'ios' // 平台
  createTime: any // 包上传时间 系统生成
  publish: boolean // 发布状态
  remark: string // 备注
}
