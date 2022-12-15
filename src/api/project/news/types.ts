export interface NewsDtoType {
  id: number
  title: string
  content: string
  author: string
  coverPic: string
  releaseTime: string
  type: string
  enclosure: string
  hasShow: boolean
  hasTop: boolean
  [key: string]: any
}
