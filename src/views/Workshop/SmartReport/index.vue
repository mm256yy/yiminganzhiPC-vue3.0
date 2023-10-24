<template>
  <div style="margin-bottom: 30px">
    <div class="smart_report">
      <div class="card" v-for="(item, index) of navList" :key="index">
        <div class="header">
          <div class="left"></div>
          <b class="label">{{ item.header }}</b>
        </div>
        <div class="children">
          <div class="item" v-for="(twoItem, twoIndex) of item.body" :key="twoIndex">
            <div class="left" v-if="twoItem.label !== 'project'"> {{ twoItem.label }}:</div>
            <div class="left" v-else></div>
            <div class="right">
              <div class="right_top">
                <div
                  :class="{
                    right_item: true,
                    right_tabs: twoItem.tabs,
                    tabs_click: threeItem.active && twoItem.tabs,
                    active: threeItem.active && !twoItem.tabs
                  }"
                  v-for="(threeItem, threeIndex) of twoItem.children"
                  :key="threeIndex"
                  @click="chooseItem(threeItem, twoItem)"
                >
                  <span>{{ threeItem.label }}</span>
                  <template v-if="twoItem.tabs">
                    <Icon icon="formkit:up" width="16" height="16" v-if="threeItem.active" />
                    <Icon icon="formkit:down" width="16" height="16" v-else />
                  </template>
                </div>
              </div>
              <div class="right_bottom" v-show="twoItem.openTabs">
                <div
                  :class="{
                    right_item: true,
                    active: deepItem.active
                  }"
                  v-for="(deepItem, deepIndex) of deepChildren"
                  :key="deepIndex"
                  @click="deepChooseItem(deepItem)"
                >
                  <span>{{ deepItem.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

const router = useRouter()
const deepChildren = ref<any[]>([])

/**
 * 以下为路由配置
 * value 即为路由名
 * 所有路由都为管理系统配置产生
 * 此处的路由名 对应 配置的路由名
 */
let navList = reactive<any>([
  {
    header: '实物成果',
    body: [
      {
        label: '居民户',
        children: [
          {
            label: '人口房屋',
            value: '',
            active: false
          },
          {
            label: '附属物',
            value: '',
            active: false
          },
          {
            label: '零星林(果)木',
            value: '',
            active: false
          },
          {
            label: '实物成果汇总',
            value: '',
            active: false
          }
        ]
      },
      {
        label: '村集体',
        children: [
          {
            label: '房屋/附属物/零星林(果)木',
            value: '',
            active: false
          },
          {
            label: '土地',
            value: '',
            active: false
          },
          {
            label: '坟墓',
            value: '',
            active: false
          }
        ]
      },
      {
        label: '企(事)业单位',
        openTabs: false,
        tabs: true,
        children: [
          {
            label: '企业',
            active: false,
            openTabs: false,
            children: [
              {
                label: '基本情况',
                value: '',
                active: false
              },
              {
                label: '房屋及其附属物',
                value: '',
                active: false
              },
              {
                label: '零星林(果)木',
                value: '',
                active: false
              }
            ]
          },
          {
            label: '个体户',
            active: false,
            openTabs: false,
            children: [
              {
                label: '基本情况',
                value: '',
                active: false
              },
              {
                label: '附属物',
                value: '',
                active: false
              }
            ]
          },
          {
            label: '水电站',
            active: false,
            openTabs: false,
            children: [
              {
                label: '基本情况',
                value: 'waterbasicreport',
                active: false
              },
              {
                label: '房屋',
                value: 'waterhousereport',
                active: false
              },
              {
                label: '附属物',
                value: 'waterappendreport',
                active: false
              }
            ]
          },
          {
            label: '探矿权',
            active: false,
            openTabs: false,
            children: [
              {
                label: '探矿权汇总表',
                value: '',
                active: false
              }
            ]
          }
        ]
      },
      {
        label: '专业项目',
        children: [
          {
            label: '交通工程设施',
            value: '',
            active: false
          },
          {
            label: '输变电工程设施',
            value: '',
            active: false
          },
          {
            label: '文物古迹',
            value: '',
            active: false
          }
        ]
      },
      {
        label: 'project',
        openTabs: false,
        tabs: true,
        children: [
          {
            label: '电信工程',
            openTabs: false,
            children: [
              {
                label: '设施汇总',
                value: 'telecomfacilitreport',
                active: false
              },
              {
                label: '房屋及其附属物设备汇总',
                value: 'telecomhousereport',
                active: false
              }
            ]
          },
          {
            label: '移动工程',
            openTabs: false,
            children: [
              {
                label: '设施汇总',
                value: '',
                active: false
              },
              {
                label: '房屋及其附属物设备汇总',
                value: '',
                active: false
              }
            ]
          },
          {
            label: '联通工程',
            openTabs: false,
            children: [
              {
                label: '设施汇总',
                value: 'uniconfacilityreport',
                active: false
              },
              {
                label: '房屋及其附属物设备汇总',
                value: 'unicomappendreport',
                active: false
              }
            ]
          },
          {
            label: '铁塔工程',
            openTabs: false,
            children: [
              {
                label: '设施汇总',
                value: '',
                active: false
              }
            ]
          },
          {
            label: '广播电视工程',
            openTabs: false,
            children: [
              {
                label: '设施汇总',
                value: 'broadeacilityreport',
                active: false
              },
              {
                label: '房屋及其附属物设备汇总',
                value: 'broadappendreport',
                active: false
              }
            ]
          },
          {
            label: '水文站',
            openTabs: false,
            children: [
              {
                label: '房屋及其附属物设备汇总',
                value: '',
                active: false
              }
            ]
          },
          {
            label: '宗教',
            openTabs: false,
            children: [
              {
                label: '基本情况',
                value: '',
                active: false
              },
              {
                label: '房屋及其附属物设备汇总',
                value: '',
                active: false
              }
            ]
          }
        ]
      }
    ]
  },
  {
    header: '资金管理',
    body: [
      {
        label: '居民户',
        children: [
          {
            label: '居民户',
            value: 'FundPeople',
            active: false
          },
          {
            label: '资金使用详细',
            value: 'FundUseDetail',
            active: false
          }
        ]
      },
      {
        label: '村集体',
        children: [
          {
            label: '村集体',
            value: 'FundVillage',
            active: false
          }
        ]
      },
      {
        label: '企(事)业单位',
        children: [
          {
            label: '企业',
            value: 'FundEnterprise',
            active: false
          },
          {
            label: '个体户',
            value: 'FundIndividualB',
            active: false
          },
          {
            label: '水电站',
            value: 'FundHydropower',
            active: false
          }
        ]
      },
      {
        label: '专业项目',
        children: [
          {
            label: '电信工程',
            value: '',
            active: false
          },
          {
            label: '移动工程',
            value: '',
            active: false
          },
          {
            label: '联通工程',
            value: '',
            active: false
          },
          {
            label: '铁打工程',
            value: '',
            active: false
          },
          {
            label: '广播电视工程',
            value: '',
            active: false
          },
          {
            label: '水文站',
            value: '',
            active: false
          },
          {
            label: '宗教',
            value: '',
            active: false
          }
        ]
      }
    ]
  },
  {
    header: '安置意愿',
    body: [
      {
        label: '安置意愿',
        children: [
          {
            label: '生产安置意愿',
            value: '',
            active: false
          },
          {
            label: '搬迁安置意愿',
            value: '',
            active: false
          }
        ]
      }
    ]
  },
  {
    header: '进度管理',
    body: [
      {
        label: '居民户',
        children: [
          {
            label: '居民户按区域',
            value: '',
            active: false
          },
          {
            label: '资金使用详细',
            value: '',
            active: false
          }
        ]
      },
      {
        label: '企(事)业单位',
        children: [
          {
            label: '企业',
            value: 'enterprisereport',
            active: false
          },
          {
            label: '个体户按区域',
            value: 'individualregionreport',
            active: false
          },
          {
            label: '个体户按工作区',
            value: 'individualworkreport',
            active: false
          }
        ]
      },
      {
        label: '专业项目',
        children: [
          {
            label: '交通/电力/移动联通铁塔电信/文物',
            value: 'comprehensivereport',
            active: false
          },
          {
            label: '寺庙/水文站',
            value: '',
            active: false
          }
        ]
      }
    ]
  }
])

function chooseItem(item: any, x: any) {
  // 重置
  for (let a of navList) {
    for (let b of a.body) {
      b.openTabs = false
      for (let c of b.children) {
        c.openTabs = false
        c.active = false
        if (c.children) {
          for (let d of c.children) {
            d.active = false
          }
        }
      }
    }
  }
  // 高亮
  item.active = true
  // 有子项
  if (x.tabs) {
    if (!x.openTabs) {
      x.openTabs = true
    }
    // 三级赋值
    deepChildren.value = item.children || []
  } else {
    // 路由跳转

    goLink(item.value)
  }
}

const deepChooseItem = (item) => {
  for (let a of navList) {
    for (let b of a.body) {
      for (let c of b.children) {
        if (c.children) {
          for (let d of c.children) {
            d.active = false
          }
        }
      }
    }
  }
  item.active = true
  // 路由跳转

  goLink(item.value)
}

const goLink = (routerName: string) => {
  console.log('路由名称:', routerName)
  if (!routerName) return
  // router.push({
  //   name: routerName
  // })

  const linkObj = router.resolve({
    name: routerName
  })
  window.open(linkObj.href, '_blank')
}
</script>

<style lang="less" scoped>
.smart_report {
  padding: 16px;
  background-color: white;
  border-radius: 4px;

  .card {
    margin-bottom: 16px;
    border: 1px solid #ebebeb;
    border-radius: 4px;

    .header {
      display: flex;
      height: 32px;
      background-color: #f6f6f6;
      border-bottom: 1px solid #ebebeb;
      align-items: center;

      .left {
        width: 4px;
        height: 16px;
        margin-right: 8px;
        margin-left: 16px;
        background: linear-gradient(90deg, #3e73ec 0%, #ffffff 100%);
        border-radius: 3px 3px 3px 3px;
      }

      .label {
        font-size: 14px;
        color: #131313;
      }
    }

    .children {
      padding: 0 16px;

      .item {
        display: flex;
        padding: 16px 0;
        font-size: 14px;
        color: #131313;
        border-bottom: 1px dashed #ebebeb;

        .left {
          width: 94px;
          line-height: 29px;
          text-align: right;
        }

        .right {
          padding-left: 6px;
          flex: 1;

          .right_top {
            display: flex;
          }

          .right_bottom {
            display: flex;
            padding: 16px;
            border: 1px solid #ebebeb;
            border-radius: 0px 4px 4px 4px;
          }

          .right_item {
            padding: 4px 16px;
            margin-right: 16px;
            cursor: pointer;
          }

          .right_item:last-child {
            margin-right: 0;
          }
        }
      }

      .item:last-child {
        border-bottom: none;
      }
    }
  }

  .card:last-child {
    margin-bottom: 0;
  }
}

.active {
  color: #3e73ec;
  background-color: #f2f6ff;
  border-radius: 4px;
}

.tabs_click {
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

.right_tabs {
  display: flex;
  align-items: center;

  span {
    margin-right: 4px;
  }
}
</style>
