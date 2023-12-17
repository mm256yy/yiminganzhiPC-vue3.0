<!--
 * @Author: baike
 * @LastEditors: baike
-->
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
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElTable, ElTableColumn } from 'element-plus'
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
          },
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
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(1).png', import.meta.url).href,
        name: '村集体',
        list: [
          {
            text: '房屋'
          },
          {
            text: '附属物'
          },
          {
            text: '零星林(果)木'
          },
          {
            text: '坟墓'
          },
          {
            text: '小型专项及农副业设施'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(2).png', import.meta.url).href,
        name: '企(事)业单位',
        list: [
          {
            text: '企业'
          },
          {
            text: '个体户'
          },
          {
            text: '水电站'
          },
          {
            text: '探矿权'
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
            value: 'telecommunication',
            text: '电信工程'
          },
          {
            value: 'moveExcel',
            text: '移动工程'
          },
          {
            value: 'unicom',
            text: '联通工程'
          },
          {
            value: 'Irontower',
            text: '铁塔工程'
          },
          {
            value: 'radioExcel',
            text: '广播电视工程'
          },
          {
            value: 'hydrology',
            text: '水文站'
          },
          {
            value: 'religion',
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
            text: '土地信息'
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
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(1).png', import.meta.url).href,
        name: '居民户',
        list: [
          {
            value: 'FundPeople',
            text: '居民户'
          },
          {
            value: 'FundUseDetail',
            text: '资金使用详细'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(2).png', import.meta.url).href,
        name: '村集体',
        list: [
          {
            value: 'FundVillage',
            text: '村集体'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(3).png', import.meta.url).href,
        name: '企(事)业单位',
        list: [
          {
            value: 'FundEnterprise',
            text: '企业'
          },
          {
            value: 'FundIndividualB',
            text: '个体户'
          },
          {
            value: 'FundHydropower',
            text: '水电站'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(4).png', import.meta.url).href,
        name: '专业项目',
        list: [
          {
            value: 'telecommunication',
            text: '电信工程'
          },
          {
            value: 'moveExcel',
            text: '移动工程'
          },
          {
            value: 'unicom',
            text: '联通工程'
          },
          {
            value: 'Irontower',
            text: '铁塔工程'
          },
          {
            value: 'radioExcel',
            text: '广播电视工程'
          },
          {
            value: 'hydrology',
            text: '水文站'
          },
          {
            value: 'religion',
            text: '宗教'
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
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports.png', import.meta.url).href,
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
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports.png', import.meta.url).href,
        name: '居民户',
        list: [
          {
            value: 'residentRegion',
            text: '居民户按区域组'
          },
          {
            value: 'residentWork',
            text: '居民户按工作组'
          }
        ]
      },

      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(1).png', import.meta.url).href,
        name: '企(事)业单位',
        list: [
          {
            value: 'enterprisereport',
            text: '企业'
          },
          {
            value: 'individualregionreport',
            text: '个体户按区域'
          },
          {
            value: 'individualworkreport',
            text: '个体户按工作区'
          }
        ]
      },
      {
        url: new URL('../../../assets/imgs/smarts/icon_SmartReports(2).png', import.meta.url).href,
        name: '专业项目',
        list: [
          {
            text: '交通/电力/移动联通铁塔电信/文物/寺庙/水文站'
          }
        ]
      }
    ]
  }
])

const handleClick = (item: any) => {
  goLink(item.value, {})
}

const onBack = () => {
  back()
}

const goLink = (routerName: string, query: any) => {
  if (!routerName) return

  // const linkObj = router.resolve({
  //   name: routerName,
  //   query: query
  // })
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
    background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    border: 1px solid #3e73ec;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    color: #3e73ec;
    text-align: center;
    cursor: pointer;
    line-height: 32px;
  }
  .conatiner {
    display: flex;
    flex-wrap: wrap;
    .smart_border {
      width: 936px;
      height: 443px;
      background: #ffffff;
      box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
      border-radius: 8px 8px 8px 8px;
      opacity: 1;
      border: 2px solid rgba(62, 115, 236, 0.7);
      margin-top: 16px;
      .xm_img {
        width: 74px;
        height: 15px;
        margin-top: 1px;
      }
      .con_list {
        padding: 0px 28px;
        .list_li {
          display: flex;
          width: 100%;
          border-bottom: 1px solid #ebebeb;
          padding: 18px 0 12px 0;
          .img_icon {
            width: 24px;
            height: 24px;
            margin-right: 10px;
          }
          .list_name {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #131313;
            width: 118px;
            cursor: pointer;
            line-height: 24px;
          }
          .list_value {
            display: flex;
            flex-wrap: wrap;
            width: 744px;
            .value {
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              cursor: pointer;
              font-weight: 500;
              color: #131313;
              line-height: 24px;
              margin-right: 48px;
              margin-bottom: 6px;
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
      margin-right: 16px;
    }
  }
}
</style>
