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
          title: '实施人员首页',
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
            path: 'moveAppendage',
            name: 'moveAppendage',
            component: () => import('@/views/Workshop/AchievementsReport/MoveAppendage.vue'),
            meta: {
              title: '实物成果-移动工程附属物设备汇总',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'moveFacilities',
            name: 'moveFacilities',
            component: () => import('@/views/Workshop/AchievementsReport/MoveFacilities.vue'),
            meta: {
              title: '实物成果-移动工程设施汇总',
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
            path: 'religiousInformation',
            name: 'religiousInformation',
            component: () => import('@/views/Workshop/AchievementsReport/ReligiousInformation.vue'),
            meta: {
              title: '实物成果-宗教基本信息',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'religiousAppendage',
            name: 'religiousAppendage',
            component: () => import('@/views/Workshop/AchievementsReport/ReligiousAppendage.vue'),
            meta: {
              title: '实物成果-宗教设施房屋及其附属建筑物',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'residentRegion',
            name: 'residentRegion',
            component: () => import('@/views/Workshop/ScheduleReport/ResidentRegion.vue'),
            meta: {
              title: '进度管理-居民户按区域',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'residentWork',
            name: 'residentWork',
            component: () => import('@/views/Workshop/ScheduleReport/ResidentWork.vue'),
            meta: {
              title: '进度管理-居民户按工作分组',
              icon: 'ant-design:home-outlined'
            }
          },
          // {
          //   path: 'fundPeople',
          //   name: 'fundPeople',
          //   component: () => import('@/views/Workshop/FundReport/PeasantHousehold.vue'),
          //   meta: {
          //     title: '资金管理-居民户报表',
          //     icon: 'ant-design:home-outlined'
          //   }
          // }
          {
            path: 'telecomhousereport',
            name: 'telecomhousereport',
            component: () => import('@/views/Workshop/AchievementsReport/TelecomHouseReport.vue'),
            meta: {
              title: '实物成果-电信工程-房屋及其附属物设备汇总表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'telecomfacilitreport',
            name: 'telecomfacilitreport',
            component: () => import('@/views/Workshop/AchievementsReport/TelecomFacilitReport.vue'),
            meta: {
              title: '实物成果-电信工程-设施汇总表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'broadappendreport',
            name: 'broadappendreport',
            component: () => import('@/views/Workshop/AchievementsReport/BroadAppendReport.vue'),
            meta: {
              title: '实物成果-广播电视工程-房屋及其附属物设备汇总表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'broadeacilityreport',
            name: 'broadeacilityreport',
            component: () => import('@/views/Workshop/AchievementsReport/BroadFacilityReport.vue'),
            meta: {
              title: '实物成果-广播电视工程-设施汇总表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'uniconfacilityreport',
            name: 'uniconfacilityreport',
            component: () => import('@/views/Workshop/AchievementsReport/UniconFacilityReport.vue'),
            meta: {
              title: '实物成果-联通工程-设施汇总表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'unicomappendreport',
            name: 'unicomappendreport',
            component: () => import('@/views/Workshop/AchievementsReport/UnicomAppendReport.vue'),
            meta: {
              title: '实物成果-联通工程-附属物设备汇总表',
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
            path: 'enterprisereport',
            name: 'enterprisereport',
            component: () => import('@/views/Workshop/ScheduleReport/EnterpriseReport.vue'),
            meta: {
              title: '进度管理-企业报表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'individualregionreport',
            name: 'individualregionreport',
            component: () => import('@/views/Workshop/ScheduleReport/IndividualRegionReport.vue'),
            meta: {
              title: '进度管理-个体户按区域',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'individualworkreport',
            name: 'individualworkreport',
            component: () => import('@/views/Workshop/ScheduleReport/IndividualWorkReport.vue'),
            meta: {
              title: '进度管理-个体户按区域',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'comprehensivereport',
            name: 'comprehensivereport',
            component: () => import('@/views/Workshop/ScheduleReport/ComprehensiveReport.vue'),
            meta: {
              title: '进度管理-个体户按区域',
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
              import(
                '@/views/Workshop/DataQuery/DataCollectionPublicity/PopulationHousing/Index.vue'
              ),
            meta: {
              title: '人口房屋',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'Accessory',
            name: 'Accessory',
            component: () =>
              import('@/views/Workshop/DataQuery/DataCollectionPublicity/Accessory/Index.vue'),
            meta: {
              title: '附属物',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'FruitWood',
            name: 'FruitWood',
            component: () =>
              import('@/views/Workshop/DataQuery/DataCollectionPublicity/FruitWood/Index.vue'),
            meta: {
              title: '零星林(果)木',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'Achievements',
            name: 'Achievements',
            component: () =>
              import('@/views/Workshop/DataQuery/DataCollectionPublicity/Achievements/Index.vue'),
            meta: {
              title: '实物成果汇总',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'VillageCollective',
            name: 'VillageCollective',
            component: () =>
              import(
                '@/views/Workshop/DataQuery/DataCollectionPublicity/VillageCollective/Index.vue'
              ),
            meta: {
              title: '房屋/附属物/零星林(果)木',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'Land',
            name: 'Land',
            component: () =>
              import('@/views/Workshop/DataQuery/DataCollectionPublicity/Land/Index.vue'),
            meta: {
              title: '土地',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'Grave',
            name: 'Grave',
            component: () =>
              import('@/views/Workshop/DataQuery/DataCollectionPublicity/Grave/Index.vue'),
            meta: {
              title: '坟墓',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'physicalResults',
            name: 'physicalResults',
            component: () => import('@/views/Workshop/FundManage/PhysicalResults/Index.vue'),
            meta: {
              title: '企业报表',
              hidden: false
            }
          },
          {
            path: 'PhysicaFrom',
            name: 'PhysicaFrom',
            component: () => import('@/views/Workshop/FundManage/PhysicalResults/PhysicaFrom.vue'),
            meta: {
              title: '个体报表',
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
