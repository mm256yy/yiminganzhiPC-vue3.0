<template>
  <div class="data-fill">
    <ElButton
      @click="onBack"
      :icon="BackIcon"
      type="default"
      class="px-9px py-0px !h-28px mr-8px !text-12px"
    >
      返回
    </ElButton>
    <div>
      <div class="between process-segment" v-loading="processLoading">
        <div class="between" v-for="(item, index) in newarr" :key="index" @click="checktab(index)">
          <div class="arrow" v-if="index > 0"><img :src="arrow" /></div>
          <ElPopover :width="200" placement="right">
            <template #reference>
              <div class="header-list" :class="[currentCheckTabIndex === index ? 'active' : '']">
                <LiquidBall :title="item.name" :values="item.actual" />
              </div>
            </template>
            <template #default>
              <div
                >当前阶段：&nbsp;<span class="stage-txt">{{ item.name }}</span></div
              >
              <div
                >当前进度：&nbsp;<span>{{ (item.actual * 100).toFixed(2) }}%</span></div
              >
              <div
                >开始时间：&nbsp;<span>{{
                  item.startTime ? dayjs(item.startTime).format('YYYY-MM-DD') : '--'
                }}</span></div
              >
              <div
                >结束时间：&nbsp;<span>{{
                  item.endTime ? dayjs(item.endTime).format('YYYY-MM-DD') : '--'
                }}</span></div
              >
            </template>
          </ElPopover>
        </div>
      </div>
      <div class="between" style="margin-top: 20px; background: #fff">
        <div class="common-color background-l">
          <!--完成情况-->
          <div v-loading="completeLoading" class="white common-border">
            <div class="aliam-center">
              <div class="line"></div>
              <div class="strong">完成情况</div></div
            >
            <Echart :options="householdOption" :height="300" />
          </div>
          <!--进度预警-->
          <div class="white common-border">
            <div class="aliam-center" style="padding-bottom: 10px">
              <div class="line"></div>
              <div class="strong">预警情况</div></div
            >
            <div class="warnStatus" v-loading="warnListLoading">
              <ElTable :data="tableData1" class="warn-table">
                <ElTableColumn prop="seq" label="序号" width="80" align="center" />
                <ElTableColumn prop="villageName" label="行政村" align="center" />
                <ElTableColumn prop="householdQuantity" label="总户数" align="center" />
                <ElTableColumn prop="lagHouseholdQuantity" label="滞后户数" align="center" />
                <ElTableColumn prop="completedQuantity" label="完成户数" align="center" />
                <ElTableColumn fixed="right" prop="operation" label="操作" align="center">
                  <template #default="{ row }">
                    <el-button link type="primary" size="small" @click="handleDetailClick(row)"
                      >查看详情</el-button
                    >
                  </template>
                </ElTableColumn>
              </ElTable>
              <div class="span-area"></div>
              <ElTable :data="tableData2" class="warn-table">
                <ElTableColumn prop="seq" label="序号" width="80" align="center" />
                <ElTableColumn prop="villageName" label="行政村" align="center" />
                <ElTableColumn prop="householdQuantity" label="总户数" align="center" />
                <ElTableColumn prop="lagHouseholdQuantity" label="滞后户数" align="center" />
                <ElTableColumn prop="completedQuantity" label="完成户数" align="center" />
                <ElTableColumn fixed="right" prop="operation" label="操作" align="center">
                  <template #default="{ row }">
                    <el-button link type="primary" size="small" @click="handleDetailClick(row)"
                      >查看详情</el-button
                    >
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>
        <div class="background-r">
          <div class="common-border">
            <!--工作组进度-->
            <div class="aliam-center" style="margin: 10px">
              <div class="line"></div>
              <div class="strong">工作组进度</div></div
            >
            <div class="data-fill-head">
              <div class="head-top">
                <div class="tabs">
                  <div
                    :class="['tab-item', tabCurrentId === item.id ? 'active' : '']"
                    v-for="item in tabsList"
                    :key="item.id"
                    @click="onTabClick(item)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
            <div v-loading="workLoading" class="echart-wrap">
              <div class="echart-item" v-for="item in workGroupOptions" :key="item.index">
                <div class="echart-item-lt">
                  <span class="user-name">{{ item.name }}</span>
                </div>

                <div class="echart-item-ct">
                  <div
                    class="progress"
                    :style="{ width: `${tabCurrentId != 3 ? item.number : item.isnumber}%` }"
                  ></div>
                </div>

                <div class="echart-item-rt">
                  <text class="txt">{{ tabCurrentId != 3 ? item.number : item.isnumber }}户</text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <bottomTarg />
    <ElDialog
      title="预警详情"
      v-model="contentDialog"
      :width="800"
      @close="contentDialog = false"
      alignCenter
      appendToBody
    >
      <ElTable v-loading="contentLoading" :data="warnTableData" maxHeight="400">
        <ElTableColumn prop="warn" label="进度预警" align="center">
          <template #default>
            <div class="red-dot"></div>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="householdName" label="户主姓名" align="center" />
        <ElTableColumn prop="householdNo" label="户号" align="center" />
        <ElTableColumn prop="villageNames" label="所属行政村" align="center" />
        <ElTableColumn prop="gridmanName" label="工作组" align="center" />
      </ElTable>
    </ElDialog>
  </div>
</template>

<script lang="ts" setup>
//el-popover
import Echart from '@/components/Echart/src/Echart.vue'
import { ElDialog, ElTable, ElTableColumn, ElPopover } from 'element-plus'
import arrow from '@/assets/imgs/arrow.png'
import LiquidBall from './LiquidBall.vue'
import { ref, onMounted } from 'vue'
import bottomTarg from '../Home/components/bottomTarg.vue'
import dayjs from 'dayjs'

import {
  warningList,
  villageScheduleList,
  scheduleRankList,
  getWarningTypeList,
  getWarningDetail
} from '@/api/AssetEvaluation/leader-side'
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { getLeadershipScreen } from '@/api/AssetEvaluation/leader-side'
const tabCurrentId = ref<number>(1)
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const tableObject = ref<any>([])
const parmas = ref<any>({ type: 1, isToday: false })
const type = ref<number>(1)
const workLoading = ref<boolean>(false)
const completeLoading = ref<boolean>(false)
const contentDialog = ref<boolean>(false)
const contentLoading = ref<boolean>(false)
const warnListLoading = ref<boolean>(false)
const newarr = ref<any>([])
const currentCheckTabIndex = ref<number>(0)

const tableData1 = ref<any[]>([])
const tableData2 = ref<any[]>([])

const warnTableData = ref<any[]>([])
const processLoading = ref<boolean>(false)

const tabsList = [
  {
    id: 1,
    name: '累计'
  },
  {
    id: 2,
    name: '今日'
  },
  {
    id: 3,
    name: '滞后'
  }
]

const getWarningList = async () => {
  tableObject.value = await warningList({})
}
const getVillageScheduleList = async () => {
  completeLoading.value = true
  const list = await villageScheduleList({ type: type.value })
  const dataList = ref<any>([])
  const incompleteNumberList = ref<any>([])
  const completeNumberList = ref<any>([])
  list.forEach((item) => {
    dataList.value.push(item.name)
    incompleteNumberList.value.push(item.incompleteNumber)
    completeNumberList.value.push(item.completeNumber)
  })
  householdOption.value.xAxis.data = dataList.value
  householdOption.value.series[0].data = completeNumberList.value
  householdOption.value.series[1].data = incompleteNumberList.value
  completeLoading.value = false
}

// 获取工作组进度
const getScheduleRankList = async (e) => {
  workLoading.value = true
  try {
    const list = await scheduleRankList(e)
    workLoading.value = false
    workGroupOptions.value = list.map((item) => {
      return Object.assign(
        {},
        { name: item.name, number: item.completeNumber, isnumber: item.incompleteNumber }
      )
    })
  } catch {
    workLoading.value = false
  }
}

const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id

  switch (tabCurrentId.value) {
    case 1:
      parmas.value = { type: type.value }
      break
    case 2:
      parmas.value = { type: type.value, isToday: true }
      break
    case 3:
      parmas.value = { type: type.value }
      break
  }
  getScheduleRankList(parmas.value)
}

const requestWarningTypeList = async () => {
  warnListLoading.value = true
  try {
    const result = await getWarningTypeList(type.value)
    warnListLoading.value = false
    tableData1.value = result.slice(0, 5)
    tableData2.value = result.slice(5)
  } catch {
    warnListLoading.value = false
  }
}

// 获取进度
const requestProcess = async () => {
  processLoading.value = true
  try {
    const result = await getLeadershipScreen({})
    newarr.value = result.progressManagementDto
    processLoading.value = false
  } catch {
    processLoading.value = false
  }
}

onMounted(() => {
  requestProcess()
  getWarningList()
  getVillageScheduleList()
  getScheduleRankList(parmas.value)
  requestWarningTypeList()
})

const checktab = (index) => {
  currentCheckTabIndex.value = index
  type.value = index + 1
  getVillageScheduleList()
  parmas.value.type = type.value
  getScheduleRankList(parmas.value)
  requestWarningTypeList()
}

const handleDetailClick = async (item: any) => {
  const params = {
    type: type.value,
    villageCode: item.villageCode
  }
  contentLoading.value = true
  try {
    const result = await getWarningDetail(params)
    warnTableData.value = result
    contentLoading.value = false
    contentDialog.value = true
  } catch {
    contentLoading.value = false
  }
}
const workGroupOptions = ref<any>([])
const householdOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    //   指示框名字  注意！要和下方series中的name一起改
    data: ['已完成', '未完成'],
    // 指示框位置  距离上下左右多少
    right: '45%',
    top: '2%',
    textStyle: {
      color: '#666666 ' //字体颜色
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '已完成',
      data: [],
      type: 'bar',
      barWidth: 18,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#51CE94' // 0% 处的颜色
          }
        ]
      }
    },
    {
      name: '未完成',
      data: [],

      type: 'bar',
      barWidth: 18,
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#65A4FE' // 0% 处的颜色
          }
        ]
      }
    }
  ]
})

const { back } = useRouter()
const onBack = () => {
  back()
}
</script>

<style lang="less" scoped>
.data-fill-head {
  position: relative;
  padding: 14px 16px;
  margin-top: 6px;
  background: #ffffff;
  border-radius: 4px;

  .head-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tabs {
    display: flex;
    align-items: center;

    .tab-item {
      display: flex;
      height: 32px;
      padding: 0 20px;
      margin-right: 4px;
      font-size: 14px;
      color: #000;
      cursor: pointer;
      background: #f0f2f7;
      border-radius: 10px 10px 0px 0px;
      align-items: center;

      &.active {
        color: #fff;
        background-color: var(--el-color-primary);
      }
    }
  }
}

:deep(.el-tabs__nav .el-tabs__item) {
  width: 80%;
  height: 22px;
  font-size: 16px;
  font-weight: bold;
  line-height: 19px;
  text-align: center;
}

.data-fill {
  width: 100%;
}

.common-color {
  width: 100%;
  padding: 10px;
  margin: 10px 0px auto;
  border-radius: 5px;
}

.between {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.arround {
  display: flex;
  justify-content: space-around;
}

.center {
  display: flex;
  justify-content: center;
}

.aliam-center {
  display: flex;
  align-items: center;
}

.demo-tabs {
  margin-top: 20px;
}

.strong {
  font-weight: bolder;
}

.line {
  width: 4px;
  height: 14px;
  margin-right: 8px;
  background: #3e73ec;
}

.title-padding {
  padding: 18px 2px;
  font-size: 14px;
}

.background-l {
  width: 75%;
  background: #fff;
  border-radius: 8px;
}

.background-r {
  width: 25%;
  margin-top: 30px;
}

.white {
  padding: 10px;
  margin: 10px 0px auto;
  border-radius: 5px;
}

.margin {
  margin-top: 10px;
}

.header-list {
  display: flex;
  width: 112px;
  height: 130px;
  margin-top: 8px;
  cursor: pointer;
  background: linear-gradient(180deg, #f1f9ff 0%, #ffffff 100%);
  border-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 2 2;
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.active {
    border: 2px solid rgba(62, 115, 236, 0.7);
    background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
    box-shadow: 0px 5px 5px 0px rgba(62, 115, 236, 0.4);
  }
}

.stage-txt {
  font-weight: bold;
  color: #000;
}

.echart-wrap {
  display: flex;
  flex-direction: column;
  height: 570px;
  padding: 0 10px;
  box-sizing: border-box;

  .echart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    height: 37px;

    .echart-item-lt {
      display: flex;
      align-items: center;
      flex-direction: row;

      .top-img {
        width: 26px;
        height: 20px;
        margin-right: 10px;
      }

      .user-name {
        width: 42px;
        font-size: 14px;
        color: #333;
        text-overflow: ellipsis;
        word-break: keep-all;
      }
    }

    .echart-item-ct {
      display: flex;
      align-items: center;
      width: 278px;
      margin-left: 16px;

      .progress {
        height: 9px;
        background: linear-gradient(90deg, rgba(255, 197, 61, 0.3) 0%, #faad14 100%);
        transform: skewX(-30deg);
        transform-origin: 0% 0%;
      }
    }

    .echart-item-rt {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .txt {
        font-size: 14px;
        color: #333;
      }
    }
  }
}

.filling-btn {
  display: flex;
  width: 80px;
  height: 28px;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  background: #e9f3ff;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}

.arrow {
  display: flex;
  width: 100px;
  height: 130px;
  margin-top: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.radiuBox {
  width: 10px;
  height: 10px;
  background-color: #ff5722;
  border-radius: 50%;
  box-shadow: 0px 4px 6px 0px rgba(255, 87, 34, 0.4);
}

.common-border {
  border: 2px solid rgba(62, 115, 236, 0.7);
  border-radius: 8px;
  opacity: 1;
  box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
  box-sizing: border-box;
}

.warnStatus {
  display: flex;
  align-items: center;

  .warn-table {
    flex: 1;
    height: 262px;
  }

  .span-area {
    width: 16px;
  }
}

.red-dot {
  width: 10px;
  height: 10px;
  margin-left: 60px;
  background: #ff5722;
  border-radius: 50%;
  box-shadow: 0px 4px 6px 0px rgba(255, 87, 34, 0.4);
}

.process-segment {
  height: 150px;
}
</style>
