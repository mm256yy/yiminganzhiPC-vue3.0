import dayjs from 'dayjs'
import { LandlordType, PrintType, MainType, GraveType } from '@/types/print'
import { useDictStoreWithOut } from '@/store/modules/dict'

// 模版列表
// 0-99居民户相关模版id
// 100-199 企业相关
// 200-299 个体户相关
const templates = [
  {
    uid: 1,
    id: 1,
    templateModule: '实物采集',
    templateName: '农户信息表打印',
    templateType: 'print'
  },
  {
    uid: 2,
    id: 2,
    templateModule: '实物采集',
    templateName: '房屋示意图信息',
    templateType: 'print'
  },
  {
    uid: 100,
    id: 100,
    templateModule: '实物采集',
    templateName: '企业信息打印',
    templateType: 'printCompany'
  },
  {
    uid: 101,
    id: 101,
    templateModule: '实物采集',
    templateName: '企业实物调查表',
    templateType: 'printCompany'
  },
  {
    uid: 102,
    id: 102,
    templateModule: '实物采集',
    templateName: '企业房屋示意图打印',
    templateType: 'printCompany'
  },
  {
    uid: 103,
    id: 103,
    templateModule: '实物采集',
    templateName: '企业设施设备打印',
    templateType: 'printCompany'
  },

  {
    uid: 200,
    id: 200,
    templateModule: '实物采集',
    templateName: '个体户信息打印',
    templateType: 'printIndividualHousehold'
  },
  {
    uid: 201,
    id: 201,
    templateModule: '实物采集',
    templateName: '个体户实物调查表',
    templateType: 'printIndividualHousehold'
  },
  {
    uid: 202,
    id: 202,
    templateModule: '实物采集',
    templateName: '个体户房屋示意图打印',
    templateType: 'printIndividualHousehold'
  },
  {
    uid: 203,
    id: 203,
    templateModule: '实物采集',
    templateName: '个体户设施设备打印',
    templateType: 'printIndividualHousehold'
  }
]

// 获取打印模版
export const getTemplate = (type: PrintType) => {
  return templates.filter((item) => item.templateType === type)
}

/**
 * 字典回显处理
 * 1、字典的 value 不为空或存在时，取字典表中对应的 text
 * 2、字典的 value 值为控或不存在时，显示 '-'
 * @param(Object) value 字典 value
 * @param(Object) id 对应字典的 id
 */
const dictStore = useDictStoreWithOut()
const dict = dictStore.getDictObj
const formatDict = (value: any, id: number) => {
  let str = ''
  // 获取数据字典
  if (value) {
    const arr: any = dict[id]
    const arrItem = arr.find((item: any) => String(item.value) === String(value))
    str = arrItem ? arrItem.label : ''
    return str
  } else {
    return ''
  }
}

// 处理调查对象数据
export const handleLandlordWithPrint = (landlords: LandlordType[], graveList: GraveType[]) => {
  if (!landlords || !landlords.length) {
    return []
  }

  const realLandlordArr: LandlordType[] = []
  landlords.forEach((landlord) => {
    if (landlord.company && landlord.company.id) {
      landlord.company.industryTypeText = formatDict(landlord.company.industryType, 215)
      landlord.company.registerTypeText = formatDict(landlord.company.registerType, 219)
      landlord.company.licenceTypeText = formatDict(landlord.company.licenceType, 217)
      landlord.company.treatmentSchemeText = formatDict(landlord.company.treatmentScheme, 210)
      landlord.company.informationInvolvedText = formatDict(
        landlord.company.informationInvolved,
        209
      )
      landlord.company.managementStatusText = formatDict(landlord.company.managementStatus, 213)
      landlord.company.establishDateText = landlord.company.establishDate
        ? dayjs(landlord.company.establishDate).format('YYYY-MM-DD')
        : ''
      landlord.company.companyTypeText = formatDict(landlord.company.companyType, 216)
      landlord.company.taxPeriodValidity
        ? dayjs(landlord.company.taxPeriodValidity)
        : landlord.company.taxPeriodValidity
    }
    if (landlord.demographicList && landlord.demographicList.length) {
      landlord.demographicList.forEach((item) => {
        item.relationText = formatDict(item.relation, 307)
        item.sexText = formatDict(item.sex, 292)
        item.nationText = formatDict(item.nation, 278)
        item.maritalText = formatDict(item.marital, 260)
        item.populationTypeText = formatDict(item.populationType, 244)
      })
    }
    // 处理坟墓
    if (graveList && graveList.length) {
      if (landlord.type === MainType.PeasantHousehold) {
        landlord.immigrantGraveList = graveList.filter((grave) => {
          return grave.registrantDoorNo === landlord.doorNo
        })
      } else if (landlord.type === MainType.Village) {
        landlord.immigrantGraveList = graveList.filter((grave) => {
          return grave.villageDoorNo === landlord.doorNo
        })
      }
    }

    if (landlord.immigrantGraveList && landlord.immigrantGraveList.length) {
      landlord.immigrantGraveList.forEach((item) => {
        item.graveTypeText = formatDict(item.graveType, 345)
        item.materialsText = formatDict(item.materials, 295)
      })
    }
    const images: string[] = []
    if (landlord.immigrantHouseList && landlord.immigrantHouseList.length) {
      landlord.immigrantHouseList.forEach((item) => {
        item.houseTypeText = formatDict(item.houseType, 266)
        item.usageTypeText = formatDict(item.usageType, 265)
        item.constructionTypeText = formatDict(item.constructionType, 252)
        item.completedTimeText = item.completedTime
          ? dayjs(item.completedTime).format('YYYY-MM')
          : ''

        if (item.housePic) {
          // 处理房屋图片相关
          const houseImgs = JSON.parse(item.housePic)
          if (houseImgs && houseImgs.length) {
            houseImgs.forEach((item) => {
              if (/\.(jpg|jpeg|png|JPG|PNG)/.test(item.url)) {
                images.push(
                  // 处理图片链接
                  item.url.replace(
                    'https://zdwp.oss-cn-hangzhou.aliyuncs.com/',
                    'https://oss.zdwp.tech/'
                  )
                )
              }
            })
          }
        }
      })
    }

    if (landlord.immigrantTreeList && landlord.immigrantTreeList.length) {
      landlord.immigrantTreeList.forEach((item) => {
        item.usageTypeText = formatDict(item.usageType, 325)
        item.sizeText = formatDict(item.size, 269)
        item.unitText = formatDict(item.unit, 264)
      })
    }

    if (landlord.immigrantEquipmentList && landlord.immigrantEquipmentList.length) {
      landlord.immigrantEquipmentList.forEach((item) => {
        item.yearText = item.year ? dayjs(item.year).format('YYYY年') : ''
        item.moveTypeText = formatDict(item.moveType, 221)
      })
    }

    landlord.locationTypeText = formatDict(landlord.locationType, 326)
    // 调查时间
    landlord.reportDateText = landlord.reportDate
      ? dayjs(landlord.reportDate).format('YYYY-MM-DD')
      : ''

    landlord.images = images
    realLandlordArr.push(landlord)
  })

  return realLandlordArr
}
