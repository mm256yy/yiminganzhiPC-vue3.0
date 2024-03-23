import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, UserLayout } from '@/utils/routerHelper'

export const baseConstantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

// 后台管理固定路由
export const adminConstantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/home',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/home',
    name: 'Dashboard',
    meta: { title: '管理首页' },
    children: [
      {
        path: 'home',
        name: 'DashboardHome',
        component: () => import('@/views/Dashboard/Home.vue'),
        meta: {
          title: '管理首页',
          icon: 'ant-design:home-outlined'
        }
      }
    ]
  }
]

// 工作平台固定路由
export const workshopConstantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/workshop/home',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/workshop',
    component: UserLayout,
    name: 'RootWorkshop',
    meta: {
      title: '用户首页'
    },
    children: [
      {
        path: 'home',
        name: 'WorkshopHome',
        component: () => import('@/views/Workshop/Home/Home.vue'),
        meta: {
          title: '首页',
          icon: 'ant-design:home-outlined'
        }
      },
      {
        path: 'SmartReport',
        name: 'SmartReport',
        component: () => import('@/views/Workshop/SmartReport/index.vue'),
        meta: {
          title: '领导工作台',
          icon: 'ant-design:home-outlined',
          hidden: true
        },
        children: [
          {
            path: 'FundEnterprise',
            name: 'FundEnterprise',
            component: () => import('@/views/Workshop/FundReport/Enterprise.vue'),
            meta: {
              title: '资金管理-企业报表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'FundIndividualB',
            name: 'FundIndividualB',
            component: () => import('@/views/Workshop/FundReport/IndividualB.vue'),
            meta: {
              title: '资金管理-个体户报表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'FundVillage',
            name: 'FundVillage',
            component: () => import('@/views/Workshop/FundReport/Village.vue'),
            meta: {
              title: '资金管理-村集体报表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'FundHydropower',
            name: 'FundHydropower',
            component: () => import('@/views/Workshop/FundReport/Hydropower.vue'),
            meta: {
              title: '资金管理-水电站报表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'FundUseDetail',
            name: 'FundUseDetail',
            component: () => import('@/views/Workshop/FundReport/FundDetail.vue'),
            meta: {
              title: '资金管理-资金使用情况报表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'HouseholdFundDetail',
            name: 'HouseholdFundDetail',
            component: () => import('@/views/Workshop/FundReport/HouseholdFundDetail.vue'),
            meta: {
              title: '资金管理-居名户资金发放明细',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'VillageHouseholdFundDetail',
            name: 'VillageHouseholdFundDetail',
            component: () => import('@/views/Workshop/FundReport/HouseholdFundDetail.vue'),
            meta: {
              title: '资金管理-村集体资金发放明细',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'IndividualFundDetail',
            name: 'IndividualFundDetail',
            component: () => import('@/views/Workshop/FundReport/IndividualFundDetail.vue'),
            meta: {
              title: '资金管理-个体户资金发放明细',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'EnterpriseFundDetail',
            name: 'EnterpriseFundDetail',
            component: () => import('@/views/Workshop/FundReport/EnterpriseFundDetail.vue'),
            meta: {
              title: '资金管理-企(事)业单位资金发放明细',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'FundLandNoMove',
            name: 'FundLandNoMove',
            component: () => import('@/views/Workshop/FundReport/FundLandNoMove.vue'),
            meta: {
              title: '资金管理-只征地不搬迁',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'HydropowerFundDetail',
            name: 'HydropowerFundDetail',
            component: () => import('@/views/Workshop/FundReport/HydropowerFundDetail.vue'),
            meta: {
              title: '资金管理-水电站资金发放明细',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'ProfessionFundDetail',
            name: 'ProfessionFundDetail',
            component: () => import('@/views/Workshop/FundReport/ProfessionFundDetail.vue'),
            meta: {
              title: '资金管理-专业项目资金发放明细',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'FundPeople',
            name: 'FundPeople',
            component: () => import('@/views/Workshop/FundReport/PeasantHousehold.vue'),
            meta: {
              title: '资金管理-居民户报表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'proHouseReport',
            name: 'proHouseReport',
            component: () => import('@/views/Workshop/PlacementReport/proHouseReport.vue'),
            meta: {
              title: '安置意愿-生产安置意愿报表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'moveHouseReport',
            name: 'moveHouseReport',
            component: () => import('@/views/Workshop/PlacementReport/MoveHouseReport.vue'),
            meta: {
              title: '资金管理-搬迁安置意愿报表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'hydrographicStation',
            name: 'hydrographicStation',
            component: () => import('@/views/Workshop/AchievementsReport/HydrographicStation.vue'),
            meta: {
              title: '实物成果-水文站房屋及附属物设备汇总表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'explorationRight',
            name: 'explorationRight',
            component: () => import('@/views/Workshop/AchievementsReport/ExplorationRight.vue'),
            meta: {
              title: '实物成果-探矿权',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'ironFacilities',
            name: 'ironFacilities',
            component: () => import('@/views/Workshop/AchievementsReport/IronFacilities.vue'),
            meta: {
              title: '实物成果-铁塔工程设施',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'culturalRelic',
            name: 'culturalRelic',
            component: () => import('@/views/Workshop/AchievementsReport/CulturalRelic.vue'),
            meta: {
              title: '实物成果-文物古迹',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'MobileProject',
            name: 'MobileProject',
            component: () => import('@/views/Workshop/AchievementsReport/MobileProject.vue'),
            meta: {
              title: '实物成果-移动工程',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'transportationFacilities',
            name: 'transportationFacilities',
            component: () =>
              import('@/views/Workshop/AchievementsReport/TransportationFacilities.vue'),
            meta: {
              title: '实物成果-专业项目（交通工程设施）公示表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'transmissionFacilities',
            name: 'transmissionFacilities',
            component: () =>
              import('@/views/Workshop/AchievementsReport/TransmissionFacilities.vue'),
            meta: {
              title: '实物成果-专业项目(输变电工程设施) 公示表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'ReligiousProject',
            name: 'ReligiousProject',
            component: () => import('@/views/Workshop/AchievementsReport/ReligiousProject.vue'),
            meta: {
              title: '实物成果-宗教',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'telecomProject',
            name: 'telecomProject',
            component: () => import('@/views/Workshop/AchievementsReport/TelecomProject.vue'),
            meta: {
              title: '实物成果-电信工程',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'RadioTelevisionProject',
            name: 'RadioTelevisionProject',
            component: () =>
              import('@/views/Workshop/AchievementsReport/RadioTelevisionProject.vue'),
            meta: {
              title: '实物成果-广播电视工程',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'UnicomProject',
            name: 'UnicomProject',
            component: () => import('@/views/Workshop/AchievementsReport/UnicomProject.vue'),
            meta: {
              title: '实物成果-联通工程',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'waterbasicreport',
            name: 'waterbasicreport',
            component: () => import('@/views/Workshop/AchievementsReport/WaterBasicReport.vue'),
            meta: {
              title: '实物成果-水电站-基本情况',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'waterhousereport',
            name: 'waterhousereport',
            component: () => import('@/views/Workshop/AchievementsReport/WaterHouseReport.vue'),
            meta: {
              title: '实物成果-水电站-房屋汇总表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'waterappendreport',
            name: 'waterappendreport',
            component: () => import('@/views/Workshop/AchievementsReport/WaterAppendReport.vue'),
            meta: {
              title: '实物成果-水电站-房屋汇总表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'residentProgressDetails',
            name: 'residentProgressDetails',
            component: () =>
              import('@/views/Workshop/ScheduleReport/PeasantHousehold/ProgressDetails.vue'),
            meta: {
              title: '进度管理-居民户进度明细',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'residentRegion',
            name: 'residentRegion',
            component: () =>
              import('@/views/Workshop/ScheduleReport/PeasantHousehold/RegionalStatistics.vue'),
            meta: {
              title: '进度管理-居民户按区域',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'residentWork',
            name: 'residentWork',
            component: () =>
              import('@/views/Workshop/ScheduleReport/PeasantHousehold/WorkgroupStatistics.vue'),
            meta: {
              title: '进度管理-居民户按工作分组',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'enterpriseProgressDetails',
            name: 'enterpriseProgressDetails',
            component: () =>
              import('@/views/Workshop/ScheduleReport/Enterprise/ProgressDetails.vue'),
            meta: {
              title: '进度管理-企业进度明细',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'enterpriseRegionalStatistics',
            name: 'enterpriseRegionalStatistics',
            component: () =>
              import('@/views/Workshop/ScheduleReport/Enterprise/RegionalStatistics.vue'),
            meta: {
              title: '进度管理-企业按区域',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'enterpriseWorkgroupStatistics',
            name: 'enterpriseWorkgroupStatistics',
            component: () =>
              import('@/views/Workshop/ScheduleReport/Enterprise/WorkgroupStatistics.vue'),
            meta: {
              title: '进度管理-企业工作组',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'individualProgressDetails',
            name: 'individualProgressDetails',
            component: () =>
              import('@/views/Workshop/ScheduleReport/Individual/ProgressDetails.vue'),
            meta: {
              title: '进度管理-个体户进度明细',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'individualRegionalStatistics',
            name: 'individualRegionalStatistics',
            component: () =>
              import('@/views/Workshop/ScheduleReport/Individual/RegionalStatistics.vue'),
            meta: {
              title: '进度管理-个体户按区域',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'individualWorkgroupStatistics',
            name: 'individualWorkgroupStatistics',
            component: () =>
              import('@/views/Workshop/ScheduleReport/Individual/WorkgroupStatistics.vue'),
            meta: {
              title: '进度管理-个体户工作组',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'professionProgressDetails',
            name: 'professionProgressDetails',
            component: () =>
              import('@/views/Workshop/ScheduleReport/ProfessionProject/ProgressDetails.vue'),
            meta: {
              title: '进度管理-专业项目进度明细',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'hydrology',
            name: 'hydrology',
            component: () => import('@/views/Workshop/ProfessionalProjectsExcel/hydrology.vue'),
            meta: {
              title: '水文站',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'Irontower',
            name: 'Irontower',
            component: () => import('@/views/Workshop/ProfessionalProjectsExcel/Irontower.vue'),
            meta: {
              title: '铁塔工程',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'radioExcel',
            name: 'radioExcel',
            component: () => import('@/views/Workshop/ProfessionalProjectsExcel/radioExcel.vue'),
            meta: {
              title: '广播电视工程表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'religion',
            name: 'religion',
            component: () => import('@/views/Workshop/ProfessionalProjectsExcel/religion.vue'),
            meta: {
              title: '宗教表格',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'moveExcel',
            name: 'moveExcel',
            component: () => import('@/views/Workshop/ProfessionalProjectsExcel/moveExcel.vue'),
            meta: {
              title: '移动表格',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'telecommunication',
            name: 'telecommunication',
            component: () =>
              import('@/views/Workshop/ProfessionalProjectsExcel/telecommunication.vue'),
            meta: {
              title: '电信表格',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'unicom',
            name: 'unicom',
            component: () => import('@/views/Workshop/ProfessionalProjectsExcel/unicom.vue'),
            meta: {
              title: '联通',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'PopulationHousing',
            name: 'PopulationHousing',
            component: () =>
              import('@/views/Workshop/DataQuery/SmartReport/PopulationHousing/Index.vue'),
            meta: {
              title: '人口房屋',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'Accessory',
            name: 'Accessory',
            component: () => import('@/views/Workshop/DataQuery/SmartReport/Accessory/Index.vue'),
            meta: {
              title: '附属物',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'FruitWood',
            name: 'FruitWood',
            component: () => import('@/views/Workshop/DataQuery/SmartReport/FruitWood/Index.vue'),
            meta: {
              title: '零星林(果)木',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'Achievements',
            name: 'Achievements',
            component: () =>
              import('@/views/Workshop/DataQuery/SmartReport/Achievements/Index.vue'),
            meta: {
              title: '实物成果汇总',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'OutcomeChange',
            name: 'OutcomeChange',
            component: () =>
              import('@/views/Workshop/DataQuery/SmartReport/OutcomeChange/Index.vue'),
            meta: {
              title: '实物成果变更',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'VillageCollective',
            name: 'VillageCollective',
            component: () =>
              import('@/views/Workshop/DataQuery/SmartReport/VillageCollective/Index.vue'),
            meta: {
              title: '房屋/附属物/零星林(果)木',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'Land',
            name: 'Land',
            component: () => import('@/views/Workshop/DataQuery/SmartReport/Land/Index.vue'),
            meta: {
              title: '土地',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'Ownership',
            name: 'Ownership',
            component: () => import('@/views/Workshop/DataQuery/SmartReport/Ownership/Index.vue'),
            meta: {
              title: '权属明细',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'Grave',
            name: 'Grave',
            component: () => import('@/views/Workshop/DataQuery/SmartReport/Grave/Index.vue'),
            meta: {
              title: '坟墓',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'SmallSpecial',
            name: 'SmallSpecial',
            component: () =>
              import('@/views/Workshop/DataQuery/SmartReport/SmallSpecial/Index.vue'),
            meta: {
              title: '小型专项及农副业设施',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'physicalResults',
            name: 'physicalResults',
            component: () =>
              import('@/views/Workshop/FundManage/PhysicalResults/IndividualBase.vue'),
            meta: {
              title: '个体户基本信息',
              hidden: false
            }
          },
          {
            path: 'enterprisePhysicalResults',
            name: 'enterprisePhysicalResults',
            component: () => import('@/views/Workshop/FundManage/PhysicalResults/Index.vue'),
            meta: {
              title: '企业基本信息',
              hidden: false
            }
          },
          {
            path: 'IndividualHouseAccessory',
            name: 'IndividualHouseAccessory',
            component: () =>
              import('@/views/Workshop/FundManage/PhysicalResults/IndividualHouseAccessory.vue'),
            meta: {
              title: '个体户房屋附属物',
              hidden: false
            }
          }
        ]
      },
      {
        path: 'adminSecondHome',
        name: 'adminSecondHome',
        component: () => import('@/views/Workshop/Home/AdminSecondIndex.vue'),
        meta: {
          title: '工作台', // 领导端二级 大数据分析
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'adminhomefund',
        name: 'adminhomefund',
        component: () => import('@/views/Workshop/Home/AdminHomeFund.vue'),
        meta: {
          title: '工作台', // 领导端二级 资金管理
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'adminhomeprogress',
        name: 'adminhomeprogress',
        component: () => import('@/views/Workshop/Home/AdminHomeProgress.vue'),
        meta: {
          title: '工作台', // 领导端二级  进度管理
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'Feedback',
        name: 'Feedback',
        component: () => import('@/views/Workshop/Feedback/Index.vue'),
        meta: {
          title: '工作台', // 反馈
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'Project',
        name: 'Project',
        component: () => import('@/views/Project/News/Index.vue'),
        meta: {
          title: '工作台', // 新闻法规
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'adminThirdHome',
        name: 'adminThirdHome',
        component: () => import('@/views/Workshop/Home/AdminThirdIndex.vue'),
        meta: {
          title: '工作台', // 领导端三级首页
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'fileManagerHome',
        name: 'fileManagerHome',
        component: () => import('@/views/Workshop/FileMng/NewFileSeries/Index.vue'),
        meta: {
          title: '档案管理员工作台', // 档案管理员工作台首页
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'newDetail',
        name: 'newDetail',
        component: () => import('@/views/Workshop/Home/components/newDetail.vue'),
        meta: {
          title: '文章详情',
          hidden: true
        }
      },
      {
        path: 'report',
        name: 'workshopReport',
        component: () => import('@/views/Workshop/Home/Report/Index.vue'),
        meta: {
          title: '通用报告上传',
          hidden: true
        }
      },
      {
        path: 'changeReport',
        name: 'workshopChangeReport',
        component: () => import('@/views/Workshop/Home/ChangeReport/Index.vue'),
        meta: {
          title: '设计变更报告上传',
          hidden: true
        }
      },
      {
        path: 'UploadsReport',
        name: 'workshopUploadsReport',
        component: () => import('@/views/Workshop/Home/UploadsReport/Index.vue'),
        meta: {
          title: '监评单位上传文档',
          hidden: true
        }
      },
      {
        path: 'UpReport',
        name: 'workshopUpReport',
        component: () => import('@/views/Workshop/Home/UpReport/Index.vue'),
        meta: {
          title: '监评单位子类上传文档',
          hidden: true
        }
      },
      {
        path: 'professionalReport',
        name: 'workshopProfessionalReport',
        component: () => import('@/views/Workshop/Home/ProfessionalReport/Index.vue'),
        meta: {
          title: '专业项目/库底清理报告上传',
          hidden: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: baseConstantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
