import { LandlordType, PrintType, ProjectType } from '@/types/print'
import { logo, imageLoad } from './config'
import {
  getPeopleHouseDefinition,
  getPeopleInfoDefinition,
  getCompanyBaseDefinition,
  getSelfemployedBaseDefinition,
  getSelfemployedEquipmentDefinition,
  getSelfemployedHouseDefinition,
  getSelfemployedInfoDefinition,
  getCollectiveInfoDefinition
} from './templates'

interface PDFItemType {
  name: string
  file: any
}

class PrintCore {
  public pdfMake
  public baseConfig: any
  private option: any

  constructor() {
    this.pdfMake = window.pdfMake
    this.baseConfig = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      defaultStyle: {
        font: 'PingFang',
        fontSize: 8,
        color: 'black',
        alignment: 'center'
      },
      styles: {
        // td垂直居中 22: 7 21 28  18: 5 10 15
        td: {
          margin: [0, 0, 0, 0]
        },
        td_2: {
          margin: [0, 10, 0, 0]
        },
        td_3: {
          margin: [0, 15, 0, 0]
        },
        td_5: {
          margin: [0, 25, 0, 0]
        }
      },
      pageMargins: [20, 60, 20, 50],
      header: function (currentPage: number, pageCount: number) {
        return [
          {
            alignment: 'justify',
            columns: [
              {
                text: `${currentPage}/${pageCount}`,
                margin: [20, 20, 0, 0],
                alignment: 'left'
              },
              {
                image: logo,
                width: 240,
                margin: [0, 10, 10, 0],
                alignment: 'right'
              }
            ]
          }
        ]
      }
    }
    this.option = {}
  }

  public getBase64(definition: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        this.pdfMake
          .createPdf({
            ...this.baseConfig,
            ...definition
          })
          .getDataUrl()
          .then(
            (res: string) => {
              if (res) {
                resolve(res)
              } else {
                reject()
              }
            },
            () => {
              reject()
            }
          )
      } catch (error) {
        reject(error)
      }
    })
  }

  public blobToFile(blob, fileName, mimeType) {
    return new File([blob], fileName, { type: mimeType })
  }

  public getPdfData(definition: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const definitionConfig = {
          ...this.baseConfig,
          ...definition
        }

        const pdfRes = this.pdfMake.createPdf(definitionConfig)
        const returndataType = this.option ? this.option.returndataType : 'base64'
        if (returndataType === 'blob') {
          // 返回的数据类型
          pdfRes.getBlob().then(
            (res: string) => {
              if (res) {
                resolve(res)
              } else {
                reject()
              }
            },
            (err) => {
              console.log('img', err)
              reject()
            }
          )
        } else if (returndataType === 'buffer') {
          pdfRes.getBuffer().then(
            (res: string) => {
              if (res) {
                resolve(res)
              } else {
                reject()
              }
            },
            () => {
              reject()
            }
          )
        } else {
          pdfRes.getBase64().then(
            (res: string) => {
              if (res) {
                resolve(res)
              } else {
                reject()
              }
            },
            () => {
              reject()
            }
          )
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // 创建居民户相关的pdf配置信息
  public createPeople(
    templateIds: number[],
    landlord: LandlordType,
    projectInfo: ProjectType
  ): Promise<PDFItemType[]> {
    /**
     * 两个模版
     * 1.房屋示意图
     * 2.基本信息
     */
    return new Promise(async (resolve, reject) => {
      try {
        if (!templateIds || !templateIds.length) {
          reject('模版信息为空')
          return
        }
        if (!landlord) {
          reject('业主信息为空')
          return
        }
        const stringArray: PDFItemType[] = []
        if (templateIds.includes(1)) {
          const definition = getPeopleInfoDefinition(landlord, projectInfo)
          const dataUrl = await this.getPdfData(definition).catch(() => {
            reject('生成居民户基本信息pdf失败')
            console.error('生成居民户基本信息pdf失败')
            return
          })
          if (dataUrl) {
            stringArray.push({
              file: dataUrl,
              name: '农户信息表打印.pdf'
            })
          }
        }
        if (templateIds.includes(300)) {
          const definition = getCollectiveInfoDefinition(landlord, projectInfo)
          const dataUrl = await this.getPdfData(definition).catch(() => {
            reject('生成村集体信息pdf失败')
            console.error('生成村集体信息pdf失败')
            return
          })
          if (dataUrl) {
            stringArray.push({
              file: dataUrl,
              name: '村集体信息表打印.pdf'
            })
          }
        }
        if (templateIds.includes(2) || templateIds.includes(301)) {
          // 处理图片
          const { images: imgs } = landlord
          const images: any = {}
          if (imgs && imgs.length) {
            imgs.forEach((url, dex) => {
              if (imageLoad(url)) {
                images[`img_${dex}`] = url
              }
            })
          }
          const definition = getPeopleHouseDefinition(landlord, projectInfo)
          const dataUrl = await this.getPdfData({ images, ...definition }).catch(() => {
            reject('生成居民户房屋示意图pdf失败')
            console.error('生成居民户房屋示意图pdf失败')
            return
          })
          if (dataUrl) {
            stringArray.push({
              file: dataUrl,
              name: '房屋示意图信息.pdf'
            })
          }
        }
        if (stringArray.length) {
          resolve(stringArray)
          return
        }
        reject('createPeople失败')
      } catch (err) {
        console.log('err', err)
        reject('createPeople错误')
      }
    })
  }

  // 创建个体户相关的pdf配置信息
  public createSelfemployed(
    templateIds: number[],
    landlord: LandlordType,
    projectInfo: ProjectType
  ): Promise<PDFItemType[]> {
    /**
     * 四个模版
     * 1.基本信息
     * 2.调查信息
     * 3.房屋示意图
     * 4.设施设备
     */
    return new Promise(async (resolve, reject) => {
      try {
        if (!templateIds || !templateIds.length) {
          reject('模版信息为空')
          return
        }
        if (!landlord) {
          reject('业主信息为空')
          return
        }
        const stringArray: PDFItemType[] = []
        if (templateIds.includes(200)) {
          const definition = getSelfemployedBaseDefinition(landlord, projectInfo)
          const dataUrl = await this.getPdfData(definition).catch(() => {
            reject('生成个体户基本信息pdf失败')
            console.error('生成个体户基本信息pdf失败')
            return
          })
          if (dataUrl) {
            stringArray.push({
              file: dataUrl,
              name: '个体户信息打印.pdf'
            })
          }
        }
        if (templateIds.includes(201)) {
          const definition = getSelfemployedInfoDefinition(landlord, projectInfo)
          const dataUrl = await this.getPdfData(definition).catch(() => {
            reject('生成个体户调查信息pdf失败')
            console.error('生成个体户调查信息pdf失败')
            return
          })
          if (dataUrl) {
            stringArray.push({
              file: dataUrl,
              name: '个体户实物调查表.pdf'
            })
          }
        }
        if (templateIds.includes(202)) {
          // 处理图片
          const { images: imgs } = landlord
          const images: any = {}
          if (imgs && imgs.length) {
            imgs.forEach((url, dex) => {
              images[`img_${dex}`] = url
            })
          }
          const definition = getSelfemployedHouseDefinition(landlord, projectInfo)
          const dataUrl = await this.getPdfData({ ...definition, images }).catch(() => {
            reject('生成个体户房屋示意图pdf失败')
            console.error('生成个体户房屋示意图pdf失败')
            return
          })
          if (dataUrl) {
            stringArray.push({
              file: dataUrl,
              name: '个体户房屋示意图打印.pdf'
            })
          }
        }
        if (templateIds.includes(203)) {
          const definition = getSelfemployedEquipmentDefinition(landlord, projectInfo)
          const dataUrl = await this.getPdfData(definition).catch(() => {
            reject('生成个体户设施设备pdf失败')
            console.error('生成个体户设施设备pdf失败')
            return
          })
          if (dataUrl) {
            stringArray.push({
              file: dataUrl,
              name: '个体户设施设备打印.pdf'
            })
          }
        }
        if (stringArray.length) {
          resolve(stringArray)
          return
        }
        reject('createSelfemployed失败')
      } catch (err) {
        console.error('err', err)
        reject('createSelfemployed错误')
      }
    })
  }

  // 创建公司相关的pdf配置信息
  public createCompany(
    templateIds: number[],
    landlord: LandlordType,
    projectInfo: ProjectType
  ): Promise<PDFItemType[]> {
    /**
     * 四个模版
     * 1.基本信息
     * 2.调查信息
     * 3.房屋示意图
     * 4.设施设备
     */
    return new Promise(async (resolve, reject) => {
      try {
        if (!templateIds || !templateIds.length) {
          reject('模版信息为空')
          return
        }
        if (!landlord) {
          reject('业主信息为空')
          return
        }
        const stringArray: PDFItemType[] = []
        if (templateIds.includes(100)) {
          const definition = getCompanyBaseDefinition(landlord, projectInfo)
          const dataUrl = await this.getPdfData(definition).catch(() => {
            reject('生成企业基本信息pdf失败')
            console.error('生成企业基本信息pdf失败')
            return
          })
          if (dataUrl) {
            stringArray.push({
              file: dataUrl,
              name: '企业信息打印.pdf'
            })
          }
        }
        if (templateIds.includes(101)) {
          const definition = getSelfemployedInfoDefinition(landlord, projectInfo)
          const dataUrl = await this.getPdfData(definition).catch(() => {
            reject('生成企业调查信息pdf失败')
            console.error('生成企业调查信息pdf失败')
            return
          })
          if (dataUrl) {
            stringArray.push({
              file: dataUrl,
              name: '企业实物调查表.pdf'
            })
          }
        }
        if (templateIds.includes(102)) {
          // 处理图片
          const { images: imgs } = landlord
          const images: any = {}
          if (imgs && imgs.length) {
            imgs.forEach((url, dex) => {
              images[`img_${dex}`] = url
            })
          }
          const definition = getSelfemployedHouseDefinition(landlord, projectInfo)
          const dataUrl = await this.getPdfData({ ...definition, images }).catch(() => {
            reject('生成企业房屋示意图pdf失败')
            console.error('生成企业房屋示意图pdf失败')
            return
          })
          if (dataUrl) {
            stringArray.push({
              file: dataUrl,
              name: '企业房屋示意图打印.pdf'
            })
          }
        }
        if (templateIds.includes(103)) {
          const definition = getSelfemployedEquipmentDefinition(landlord, projectInfo)
          const dataUrl = await this.getPdfData(definition).catch(() => {
            reject('生成企业设施设备pdf失败')
            console.error('生成企业设施设备pdf失败')
            return
          })
          if (dataUrl) {
            stringArray.push({
              file: dataUrl,
              name: '企业设施设备打印.pdf'
            })
          }
        }
        if (stringArray.length) {
          resolve(stringArray)
          return
        }
        reject('createCompany失败')
      } catch (err) {
        console.error('err', err)
        reject('createCompany错误')
      }
    })
  }

  // 组合生成
  public getPdf = (option: {
    landlords: LandlordType[]
    projectInfo: ProjectType
    templateIds: number[]
    type: PrintType
    returndataType?: string
  }): Promise<Array<PDFItemType[]>> => {
    return new Promise(async (resolve, reject) => {
      try {
        // 拿到业主详情
        // 根据模版id生成对应的pdf 拿到base64
        const { landlords, projectInfo, templateIds, type } = option
        this.option = option
        if (!landlords || !landlords.length) {
          console.log('landlords数据为空')
          reject([])
          return
        }
        if (!templateIds || !templateIds.length) {
          console.log('templateIds数据为空')
          reject([])
          return
        }

        const promiseArray: any[] = []
        landlords.forEach((landlord, landlordIndex) => {
          if (type === 'print') {
            // 一一对应 避免错位
            promiseArray[landlordIndex] = this.createPeople(templateIds, landlord, projectInfo)
          } else if (type === 'printIndividualHousehold') {
            promiseArray[landlordIndex] = this.createSelfemployed(
              templateIds,
              landlord,
              projectInfo
            )
          } else if (type === 'printCompany') {
            promiseArray[landlordIndex] = this.createCompany(templateIds, landlord, projectInfo)
          } else if (type === 'printVillage') {
            promiseArray[landlordIndex] = this.createPeople(templateIds, landlord, projectInfo)
          }
        })
        // 并行生成
        Promise.all(promiseArray)
          .then((result) => {
            // [[{},{}], [{}, {}]] 两个业主返回的数据结构
            // [[{}, {}]] 单个业主 单个模版的数据结构
            console.log(result, '生成结果')
            resolve(result)
          })
          .catch((err) => {
            console.error(err, '-errr')
            reject([])
          })
      } catch (error) {
        console.error(error)
        reject([])
      }
    })
  }
}

export const printPdf = new PrintCore()
