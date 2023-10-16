<template>
  <div style="margin-bottom: 30px">
    <!-- 企业基本情况 -->
    <ElTable :data="tableData1" style="width: 100%" :span-method="objectSpanMethod1">
      <ElTableColumn prop="test" label="序号" />
      <ElTableColumn prop="test" label="行政村" />
      <ElTableColumn prop="test" label="名称" />
      <ElTableColumn prop="test" label="法人代表" />
      <ElTableColumn prop="test" label="工商证" />
      <ElTableColumn prop="test" label="用地性质" />
      <ElTableColumn prop="test" label="所属行业" />
      <ElTableColumn prop="test" label="主要产品" />
      <ElTableColumn prop="test" label="年产值（万元）" />
      <ElTableColumn prop="test" label="年利润（万元）" />
      <ElTableColumn prop="test" label="从业人员（人）" />
    </ElTable>
    <!-- 企业房屋及其附属物 -->
    <ElTable :data="tableData2" style="width: 100%" :span-method="objectSpanMethod2" show-summary>
      <ElTableColumn prop="test" label="行政村" />
      <ElTableColumn prop="test" label="名称" />
      <ElTableColumn prop="test" label="房屋面积">
        <ElTableColumn prop="test" label="砖混" />
        <ElTableColumn prop="test" label="砖木" />
        <ElTableColumn prop="test" label="简易" />
        <ElTableColumn prop="test" label="小计" />
      </ElTableColumn>
      <ElTableColumn prop="test" label="附属物">
        <ElTableColumn prop="test" label="有线电视（处）" />
        <ElTableColumn prop="test" label="网络宽带（处）" />
        <ElTableColumn prop="test" label="空调（处）" />
        <ElTableColumn prop="test" label="动力电表（只）" />
        <ElTableColumn prop="test" label="太阳能热水器（只）" />
        <ElTableColumn prop="test" label="台阶（㎡）" />
        <ElTableColumn prop="test" label="花坛（㎡）" />
        <ElTableColumn prop="test" label="洗衣台（㎡）" />
        <ElTableColumn prop="test" label="水井（口）" />
        <ElTableColumn prop="test" label="蓄水池（㎡）" />
        <ElTableColumn prop="test" label="柴灶（座）" />
        <ElTableColumn prop="test" label="水塔（个）" />
        <ElTableColumn prop="test" label="棚（㎡）" />
        <ElTableColumn prop="test" label="地坪（㎡）" />
      </ElTableColumn>
    </ElTable>
    <!-- 企业零星林（果）木 -->
    <ElTable :data="tableData3" style="width: 100%" :span-method="objectSpanMethod3" show-summary>
      <ElTableColumn prop="test" label="序号" />
      <ElTableColumn prop="test" label="行政村" />
      <ElTableColumn prop="test" label="名称" />
      <ElTableColumn prop="test" label="零星果木">
        <ElTableColumn prop="test" label="景观树（株）" />
      </ElTableColumn>
    </ElTable>
  </div>
  <div class="smart_report">
    <div class="card" v-for="(item, index) of cardList" :key="index">
      <div class="header">
        <div class="left"></div>
        <b class="label">{{ item.header }}</b>
      </div>
      <div class="content">
        <div class="item" v-for="(twoItem, twoIndex) of item.body" :key="twoIndex">
          <div class="left"> {{ twoItem.label }}： </div>
          <div class="right">
            <div class="right_top">
              <div
                :class="{
                  right_item: true,
                  right_tabs: twoItem.tabs,
                  tabs_click: threeItem.click && twoItem.tabs,
                  no_tabs_choose: threeItem.click && !twoItem.tabs
                }"
                v-for="(threeItem, threeIndex) of twoItem.content"
                :key="threeIndex"
                @click="chooseItem(threeItem, twoItem)"
              >
                <span>{{ threeItem.label }}</span>
                <template v-if="twoItem.tabs">
                  <Icon icon="formkit:down" width="16" height="16" v-show="true" />
                  <Icon icon="formkit:up" width="16" height="16" v-show="false" />
                </template>
              </div>
            </div>
            <div class="right_bottom" v-show="twoItem.openTabs">111</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'

let cardList = reactive([
  {
    header: '实物成果',
    body: [
      {
        label: '居民户',
        content: [
          {
            label: '人口房屋',
            click: false
          },
          {
            label: '附属物',
            click: false
          },
          {
            label: '零星林(果)木',
            click: false
          },
          {
            label: '实物成果汇总',
            click: false
          }
        ]
      },
      {
        label: '村集体',
        content: [
          {
            label: '房屋/附属物/零星林(果)木',
            click: false
          },
          {
            label: '土地',
            click: false
          },
          {
            label: '坟墓',
            click: false
          }
        ]
      },
      {
        label: '企(事)业单位',
        openTabs: false,
        tabs: true,
        content: [
          {
            label: '企业',
            click: false,
            openTabs: false,
            content: [
              {
                label: '基本情况',
                click: false
              },
              {
                label: '房屋及其附属物',
                click: false
              },
              {
                label: '零星林(果)木',
                click: false
              }
            ]
          },
          {
            label: '个体户',
            click: false,
            openTabs: false,
            content: [
              {
                label: '基本情况',
                click: false
              },
              {
                label: '附属物',
                click: false
              }
            ]
          },
          {
            label: '水电站',
            click: false,
            openTabs: false,
            content: [
              {
                label: '基本情况',
                click: false
              },
              {
                label: '房屋',
                click: false
              },
              {
                label: '附属物',
                click: false
              }
            ]
          },
          {
            label: '探矿权',
            click: false,
            openTabs: false,
            content: [
              {
                label: '探矿权汇总表',
                click: false
              }
            ]
          }
        ]
      }
      // {
      //   label: '专业项目',
      //   content: [
      //     {
      //       label: '交通工程设施',
      //       click: false
      //     },
      //     {
      //       label: '输变电工程设施',
      //       click: false
      //     },
      //     {
      //       label: '文物古迹',
      //       click: false
      //     },
      //     {
      //       label: '电信工程',
      //       content: [{}, '房屋及其附属物设备汇总']
      //     },
      //     {
      //       label: '移动工程',
      //       content: ['设施汇总', '房屋及其附属物设备汇总']
      //     },
      //     {
      //       label: '联通工程',
      //       content: ['设施汇总', '房屋及其附属物设备汇总']
      //     },
      //     {
      //       label: '铁塔工程',
      //       content: ['设施汇总']
      //     },
      //     {
      //       label: '广播电视工程',
      //       content: ['设施汇总', '房屋及其附属物设备汇总']
      //     },
      //     {
      //       label: '水文站',
      //       content: ['房屋及其附属物设备汇总']
      //     },
      //     {
      //       label: '宗教',
      //       content: ['基本情况', '房屋及其附属物设备汇总']
      //     }
      //   ],
      //   showNum: 3
      // }
    ]
  }
  // {
  //   header: '资金管理',
  //   body: [
  //     {
  //       label: '居民户',
  //       content: ['居民户', '资金使用详细'],
  //       showNum: 2
  //     },
  //     {
  //       label: '村集体',
  //       content: ['村集体'],
  //       showNum: 1
  //     },
  //     {
  //       label: '企(事)业单位',
  //       content: ['企业', '个体户', '水电站'],
  //       showNum: 3
  //     },
  //     {
  //       label: '专业项目',
  //       content: ['电信工程', '移动工程', '联通工程', '铁打工程', '广播电视工程', '水文站', '宗教'],
  //       showNum: 7
  //     }
  //   ]
  // },
  // {
  //   header: '安置意愿',
  //   body: [
  //     {
  //       label: '安置意愿',
  //       content: ['生产安置意愿', '搬迁安置意愿'],
  //       showNum: 2
  //     }
  //   ]
  // },
  // {
  //   header: '进度管理',
  //   body: [
  //     {
  //       label: '居民户',
  //       content: ['居民户按区域', '资金使用详细'],
  //       showNum: 2
  //     },
  //     {
  //       label: '企(事)业单位',
  //       content: ['企业', '个体户按区域', '个体户按工作区'],
  //       showNum: 3
  //     },
  //     {
  //       label: '专业项目',
  //       content: ['交通/电力/移动联通铁塔电信/文物', '寺庙/水文站'],
  //       showNum: 2
  //     }
  //   ]
  // }
])

function chooseItem(item: any, x: any) {
  console.log(item, x)
  for (let a of cardList) {
    for (let b of a.body) {
      if (!x.tabs) {
        b.openTabs = false
      }
      for (let c of b.content) {
        c.click = false
      }
    }
  }
  item.click = true
  if (x.tabs && !x.openTabs) {
    x.openTabs = true
  }
}

// 企业基本情况
let tableData1 = reactive([
  {
    test: '1'
  },
  {
    test: '2'
  },
  {
    test: '3'
  },
  {
    test: '4'
  }
])
const objectSpanMethod1 = ({
  // row,
  // column,
  rowIndex,
  columnIndex
}) => {
  if (columnIndex === 1) {
    if (rowIndex % 4 === 0) {
      return {
        rowspan: 4,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

// 企业房屋及其附属物
let tableData2 = reactive([
  {
    test: '1'
  },
  {
    test: '2'
  },
  {
    test: '3'
  },
  {
    test: '4'
  }
])
const objectSpanMethod2 = ({
  // row,
  // column,
  rowIndex,
  columnIndex
}) => {
  if (columnIndex === 0) {
    if (rowIndex % 4 === 0) {
      return {
        rowspan: 4,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

// 企业零星林（果）木
let tableData3 = reactive([
  {
    test: '1'
  },
  {
    test: '2'
  },
  {
    test: '3'
  },
  {
    test: '4'
  }
])
const objectSpanMethod3 = ({
  // row,
  // column,
  rowIndex,
  columnIndex
}) => {
  if (columnIndex === 1) {
    if (rowIndex % 4 === 0) {
      return {
        rowspan: 4,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

// function setRightTabs(a: any, b: any) {
//   return a.tabs && a.openTabs && b.openTabs
// }
// let moreFlag = ref<boolean>(true)
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

    .content {
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
          flex: 1;

          .right_top {
            display: flex;

            .right_item {
              padding: 4px 16px;
              margin-right: 16px;
              cursor: pointer;
            }

            .right_item:last-child {
              margin-right: 0;
            }
          }

          .right_bottom {
            padding: 16px;
            border: 1px solid #ebebeb;
            border-radius: 0px 4px 4px 4px;
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

.no_tabs_choose {
  color: #3e73ec;
  background-color: #f2f6ff;
  border-radius: 4px;
}

.tabs_choose {
  color: #3e73ec;
  background-color: #f2f6ff;
  border-radius: 4px;
}

.tabs_click {
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
