import dayjs from 'dayjs'
import { LandlordType, PrintType } from '@/types/print'
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
    str = arrItem ? arrItem.text : ''
    return str
  } else {
    return ''
  }
}

// 处理调查对象数据
export const handleLandlordWithPrint = (landlords: LandlordType[]) => {
  if (!landlords || !landlords.length) {
    return []
  }

  const realLandlordArr: LandlordType[] = []
  const images: string[] = []
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
    if (landlord.immigrantGraveList && landlord.immigrantGraveList.length) {
      landlord.immigrantGraveList.forEach((item) => {
        item.graveTypeText = formatDict(item.graveType, 345)
        item.materialsText = formatDict(item.materials, 295)
      })
    }
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
              images.push(
                // 处理图片链接
                item.url.replace(
                  'https://zdwp.oss-cn-hangzhou.aliyuncs.com/',
                  'https://oss.zdwp.tech/'
                )
              )
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

    // const districtMap = getStorage(StorageKey.DISTRICTMAP) || {}
    // // 拿到上级行政区划
    // landlord.virutalVillageCodeText = districtMap[landlord.virutalVillageCode]
    // landlord.villageCodeText = districtMap[landlord.villageCode]
    // landlord.townCodeText = districtMap[landlord.townCode]
    // landlord.areaCodeText = districtMap[landlord.areaCode]
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

// 测试数据
export const landlordTestData: any[] = [
  {
    createdBy: 'yc',
    createdDate: '2023-03-16T06:07:18.426547Z',
    lastModifiedBy: 'yc',
    lastModifiedDate: '2023-03-16T06:07:18.426547Z',
    id: 9754,
    name: 'xx',
    sex: null,
    card: null,
    doorNo: '3307830030010910',
    townCode: '330783003',
    villageCode: '330783003001',
    virutalVillageCode: '3307830030010001',
    address: '',
    projectId: 36,
    longitude: '',
    latitude: '',
    phone: '',
    locationType: null,
    cityCode: null,
    areaCode: '330783',
    reportStatus: 'UnReport',
    hasPropertyAccount: true,
    householdNumber: 'xxxdddd',
    reportDate: null,
    reportUser: null,
    uid: '6b15a7c8-fc2c-4ac2-ab98-159d4c4eca52',
    fillingUpdateDate: '2023-04-10T05:58:05.000+00:00',
    type: 'PeasantHousehold',
    inundationRange: '',
    altitude: null,
    initialVillageCode: '330783003001',
    status: 'survey',
    demographicList: [
      {
        createdBy: 'yc',
        createdDate: '2023-03-16T06:07:18.436571Z',
        lastModifiedBy: 'yc',
        lastModifiedDate: '2023-03-16T06:07:18.436571Z',
        id: 18975,
        householdId: 0,
        name: 'xx',
        sex: null,
        card: null,
        relation: '1',
        doorNo: '3307830030010910',
        townCode: '330783003',
        villageCode: '330783003001',
        virutalVillageCode: '3307830030010001',
        address: '',
        birthday: '',
        nation: null,
        censusRegister: null,
        education: null,
        marital: null,
        censusType: null,
        populationType: null,
        occupation: null,
        company: null,
        comeTime: null,
        comeCause: null,
        comeAddressTime: null,
        comeAddressCause: null,
        fromTown: null,
        fromAddress: null,
        projectId: 36,
        cityCode: '',
        areaCode: '330783',
        phone: '',
        populationSort: null,
        insuranceType: null,
        cardPic:
          '[{"padPath":"_doc/uniapp_save/16789466809559.jpg","name":"16789466809559.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/16789466809559.jpg"},{"padPath":"_doc/uniapp_save/167894668095510.jpg","name":"167894668095510.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894668095510.jpg"}]',
        householdPic:
          '[{"padPath":"_doc/uniapp_save/167894668956311.jpg","name":"167894668956311.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894668956311.jpg"}]',
        remark: null,
        householdNumber: null,
        otherPic:
          '[{"padPath":"_doc/uniapp_save/167894669488612.jpg","name":"167894669488612.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894669488612.jpg"}]',
        uid: 'd4cbdabd-3bb7-4a9f-9848-0cef90919e32',
        status: 'survey'
      }
    ],
    immigrantAppendantList: [],
    immigrantTreeList: [],
    immigrantGraveList: [],
    immigrantHouseList: [
      {
        createdBy: 'yc',
        createdDate: '2023-03-16T06:07:18.443625Z',
        lastModifiedBy: 'yc',
        lastModifiedDate: '2023-03-16T06:07:18.443625Z',
        id: 105,
        doorNo: '3307830030010910',
        householdId: 9754,
        houseNo: 'eee',
        propertyType: '',
        usageType: '3',
        houseType: '3',
        constructionType: '',
        storeyNumber: null,
        completedTime: null,
        propertyNo: '',
        landNo: '',
        landType: '',
        landArea: null,
        storeyHeight: null,
        houseHeight: null,
        outerWallType: '',
        interiorWallType: '',
        groundType: '',
        roofType: '',
        roofMaterialsType: '',
        doorsWindowsType: '',
        waterElectricityType: '',
        formula: '',
        longitude: '',
        latitude: '',
        housePic:
          '[{"padPath":"_doc/uniapp_save/167894673458513.jpg","name":"167894673458513.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894673458513.jpg"}]',
        remark: '',
        otherPic:
          '[{"padPath":"_doc/uniapp_save/167894676409917.jpg","name":"167894676409917.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894676409917.jpg"},{"padPath":"_doc/uniapp_save/167894676410118.jpg","name":"167894676410118.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894676410118.jpg"}]',
        uid: '948bb9a2-7913-4fdf-8f4b-5acc17288a36',
        homePic:
          '[{"padPath":"_doc/uniapp_save/167894677035819.jpg","name":"167894677035819.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894677035819.jpg"},{"padPath":"_doc/uniapp_save/167894677035820.jpg","name":"167894677035820.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894677035820.jpg"}]',
        inundationRange: null,
        altitude: null,
        locationType: null,
        landPic:
          '[{"padPath":"_doc/uniapp_save/167894674270014.jpg","name":"167894674270014.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894674270014.jpg"},{"padPath":"_doc/uniapp_save/167894674845315.jpg","name":"167894674845315.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894674845315.jpg"},{"padPath":"_doc/uniapp_save/167894675869716.jpg","name":"167894675869716.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894675869716.jpg"}]',
        houseCadPic: null,
        projectId: 36,
        status: 'survey'
      }
    ],
    immigrantWill: {
      id: null,
      uid: null,
      projectId: null,
      doorNo: null,
      householdId: null,
      familyNum: null,
      countryNum: null,
      unCountryNum: null,
      opinion: null,
      productionType: null,
      removalType: null,
      status: null,
      immigrantWillProductionList: null
    },
    immigrantIncomeList: [],
    immigrantFile: {
      createdBy: 'yc',
      createdDate: '2023-03-16T06:07:18.483561Z',
      lastModifiedBy: 'yc',
      lastModifiedDate: '2023-03-16T06:07:18.483561Z',
      id: 44,
      doorNo: '3307830030010910',
      householdId: 9754,
      personPic: null,
      housePic: null,
      otherPic:
        '[{"padPath":"_doc/uniapp_save/167894682118321.jpg","name":"167894682118321.jpg","url":"https://zdwp.oss-cn-hangzhou.aliyuncs.com/migrate/files/image/167894682118321.jpg"}]',
      uid: 'd85f1604-b524-4e09-b8da-15ab99bad6db',
      projectId: 36,
      status: 'survey'
    },
    company: {
      createdBy: null,
      createdDate: '2023-04-11T11:19:40.493443Z',
      lastModifiedBy: null,
      lastModifiedDate: '2023-04-11T11:19:40.493443Z',
      id: null,
      doorNo: null,
      householdId: null,
      uid: null,
      legalPersonName: null,
      legalPersonCard: null,
      legalPersonPhone: null,
      companyType: null,
      companyAddress: null,
      licenceType: null,
      periodValidity: null,
      licenceNo: null,
      taxPeriodValidity: null,
      taxLicenceNo: null,
      taxLicenceCompany: null,
      ohterLicence: null,
      registerType: null,
      establishDate: null,
      natureBusiness: null,
      industryType: null,
      economicNature: null,
      registeredAmount: null,
      fixedAssetsOriginalValue: null,
      fixedAssetsNetValue: null,
      regularWorkerNum: null,
      temporaryWorkerNum: null,
      annualPayroll: null,
      averageAnnualOutputValue: null,
      averageAnnualProfit: null,
      averageAnnualTaxPaid: null,
      managementType: null,
      productCategory: null,
      managementStatus: null,
      informationInvolved: null,
      treatmentScheme: null,
      sellOwnershipArea: null,
      sellOccupiedArea: null,
      sellRemark: null,
      transferOwnershipArea: null,
      transferOccupiedArea: null,
      transferRemark: null,
      rentOwnershipArea: null,
      rentOccupiedArea: null,
      rentRemark: null,
      otherOwnershipArea: null,
      otherOccupiedArea: null,
      otherRemark: null,
      totalOwnershipArea: null,
      totalOccupiedArea: null,
      remark: null,
      licensePic: null,
      otherPic: null,
      issuingCompany: null,
      projectId: null,
      status: null
    },
    immigrantManagementList: [],
    immigrantEquipmentList: [],
    immigrantFacilitiesList: [],
    villageCodeText: '接官亭社区',
    townCodeText: '白云街道',
    areaCodeText: '东阳市'
  }
]
