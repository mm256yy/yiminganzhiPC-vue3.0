<!--智慧报表-->
<template>
  <div id="LeaderSide_work_home_rem" class="smart_report">
    <ElButton @click="onBack" :icon="BackIcon" class="goBack"> 返回 </ElButton>
    <div class="conatiner">
      <div v-for="item in listArray" :key="item.id" class="smart_border">
        <Label height="50px">
          <template #title>
            <img class="xm_img" :src="item.icon" alt="" />
          </template>
        </Label>

        <div class="con_list">
          <div v-for="i in item.conArray" :key="i.url" class="list_li">
            <img class="img_icon" :src="i.url" alt="" />
            <div class="list_name">{{ i.name }} </div>
            <div class="list_value">
              <div v-for="ite in i.list" @click="handleClick(ite)" :key="ite.text" class="value">
                {{ ite.text }}</div
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { changeScale, init } from '../ExternalLink/rem'
import Label from '../ExternalLink/components/label.vue'
import Footer from '../ExternalLink/components/footer.vue'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'

const router = useRouter()
const { back } = useRouter()

const BackIcon = useIcon({ icon: 'iconoir:undo' })

const listArray = ref([
  {
    id: '1',
    icon: new URL('../../../assets/imgs/smarts/a.png', import.meta.url).href,
    conArray: [
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports.png', import.meta.url).href,
        name: '实物成果',
        list: [
          {
            value: 'Achievements',
            text: '实物成果汇总'
          },
          {
            value: 'OutcomeChange',
            text: '实物成果变更'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports.png', import.meta.url).href,
        name: '居民户',
        list: [
          {
            text: '人口房屋',
            value: 'PopulationHousing'
          },
          {
            value: 'Accessory',
            text: '附属物'
          },
          {
            value: 'FruitWood',
            text: '零星林(果)木'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(1).png', import.meta.url).href,
        name: '村集体',
        list: [
          {
            text: '房屋',
            value: 'VillageCollective',
            params: {
              pageType: '1'
            }
          },
          {
            text: '附属物',
            value: 'VillageCollective',
            params: {
              pageType: '2'
            }
          },
          {
            text: '零星林(果)木',
            value: 'VillageCollective',
            params: {
              pageType: '3'
            }
          },
          {
            text: '坟墓',
            value: 'Grave'
          },
          {
            text: '小型专项及农副业设施',
            value: 'SmallSpecial'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(1).png', import.meta.url).href,
        name: '个体户',
        list: [
          {
            text: '基本信息',
            value: 'physicalResults'
          },
          {
            text: '房屋及附属物',
            value: 'IndividualHouseAccessory'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(2).png', import.meta.url).href,
        name: '企(事)业单位',
        list: [
          {
            text: '企业',
            value: 'physicalResults'
          },
          {
            text: '水电站',
            value: 'waterbasicreport'
          },
          {
            text: '探矿权',
            value: 'explorationRight'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(3).png', import.meta.url).href,
        name: '专业项目',
        list: [
          {
            value: 'transportationFacilities',
            text: '交通工程设施'
          },
          {
            value: 'transmissionFacilities',
            text: '输变电工程设施'
          },
          {
            value: 'culturalRelic',
            text: '文物古迹'
          },
          {
            value: 'telecomProject',
            text: '电信工程'
          },
          {
            value: 'MobileProject',
            text: '移动工程'
          },
          {
            value: 'UnicomProject',
            text: '联通工程'
          },
          {
            value: 'ironFacilities',
            text: '铁塔工程'
          },
          {
            value: 'RadioTelevisionProject',
            text: '广播电视工程'
          },
          {
            value: 'hydrographicStation',
            text: '水文站'
          },
          {
            value: 'ReligiousProject',
            text: '宗教'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(4).png', import.meta.url).href,
        name: '土地',
        list: [
          {
            value: 'Land',
            text: '土地报批'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    icon: new URL('../../../assets/imgs/smarts/b.png', import.meta.url).href,
    conArray: [
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(5).png', import.meta.url).href,
        name: '概算资金',
        list: [
          {
            value: 'FundUseDetail',
            text: '资金使用报表'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(5).png', import.meta.url).href,
        name: '居民户',
        list: [
          {
            value: 'HouseholdFundDetail',
            text: '资金发放明细'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(6).png', import.meta.url).href,
        name: '村集体',
        list: [
          {
            value: 'VillageHouseholdFundDetail',
            text: '资金发放明细'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(6).png', import.meta.url).href,
        name: '个体户',
        list: [
          {
            value: 'IndividualFundDetail',
            text: '资金发放明细'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(7).png', import.meta.url).href,
        name: '企(事)业单位',
        list: [
          {
            value: 'EnterpriseFundDetail',
            text: '企业资金发放明细'
          },
          {
            value: 'HydropowerFundDetail',
            text: '水电站资金发放明细'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(8).png', import.meta.url).href,
        name: '专业项目',
        list: [
          {
            value: 'ProfessionFundDetail',
            text: '资金发放明细'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    icon: new URL('../../../assets/imgs/smarts/c.png', import.meta.url).href,
    conArray: [
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(9).png', import.meta.url).href,
        name: '安置意愿',
        list: [
          {
            value: 'proHouseReport',
            text: '生产安置意愿'
          },
          {
            value: 'moveHouseReport',
            text: '搬迁安置意愿'
          }
        ]
      }
    ]
  },
  {
    id: '4',
    icon: new URL('../../../assets/imgs/smarts/d.png', import.meta.url).href,
    conArray: [
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(10).png', import.meta.url).href,
        name: '居民户',
        list: [
          {
            value: 'residentProgressDetails',
            text: '进度明细'
          },
          {
            value: 'residentRegion',
            text: '区域统计'
          },
          {
            value: 'residentWork',
            text: '工作组统计'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(10).png', import.meta.url).href,
        name: '个体户',
        list: [
          {
            value: 'individualProgressDetails',
            text: '进度明细'
          },
          {
            value: 'individualRegionalStatistics',
            text: '区域统计'
          },
          {
            value: 'individualWorkgroupStatistics',
            text: '工作组统计'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(11).png', import.meta.url).href,
        name: '企(事)业单位',
        list: [
          {
            value: 'enterpriseProgressDetails',
            text: '进度明细'
          },
          {
            value: 'enterpriseRegionalStatistics',
            text: '区域统计'
          },
          {
            value: 'enterpriseWorkgroupStatistics',
            text: '工作组统计'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(12).png', import.meta.url).href,
        name: '专业项目',
        list: [
          {
            value: 'professionProgressDetails',
            text: '进度明细'
          }
        ]
      }
    ]
  }
])

const handleClick = (item: any) => {
  goLink(item.value, item.params)
}

const onBack = () => {
  back()
}

const goLink = (routerName: string, query: any) => {
  if (!routerName) return

  // 修改跳转方式为本页跳转
  router.push({
    name: routerName,
    query: query
  })

  //window.open(linkObj.href, '_blank')
}

onMounted(() => {
  changeScale()
  window.addEventListener('resize', changeScale)
})

onBeforeUnmount(() => {
  init()
  window.removeEventListener('resize', changeScale)
})
</script>

<style lang="less" scoped>
.smart_report {
  padding-top: 10px;

  .goBack {
    width: 72px;
    height: 32px;
    font-size: 14px;
    font-weight: 500;
    line-height: 32px;
    color: #3e73ec;
    text-align: center;
    cursor: pointer;
    background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
    border: 1px solid #3e73ec;
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
  }

  .conatiner {
    display: flex;
    flex-wrap: wrap;

    .smart_border {
      width: 936px;
      height: 480px;
      margin-top: 16px;
      background: #ffffff;
      border: 2px solid rgba(62, 115, 236, 0.7);
      border-radius: 8px 8px 8px 8px;
      opacity: 1;
      box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);

      .xm_img {
        height: 16px;
      }

      .con_list {
        padding: 0px 28px;

        .list_li {
          display: flex;
          width: 100%;
          padding: 10px 0 12px 0;
          border-bottom: 1px solid #ebebeb;

          .img_icon {
            width: 24px;
            height: 24px;
            margin-right: 10px;
          }

          .list_name {
            width: 118px;
            font-size: 14px;

            font-weight: 400;
            line-height: 24px;
            color: #131313;
            cursor: pointer;
          }

          .list_value {
            display: flex;
            flex-wrap: wrap;
            width: 744px;

            .value {
              margin-right: 48px;
              margin-bottom: 6px;
              font-size: 14px;
              font-weight: 500;
              line-height: 26px;
              color: #131313;
              cursor: pointer;
            }
          }
        }

        .list_li:last-child {
          border: none !important;
        }
      }
    }

    .smart_border:nth-child(1) {
      margin-right: 16px;
    }

    .smart_border:nth-child(3) {
      height: 380px;
      margin-right: 16px;
    }

    .smart_border:nth-child(4) {
      height: 380px;
    }
  }
}
</style>
