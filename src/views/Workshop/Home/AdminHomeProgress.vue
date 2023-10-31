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
    <div class="between">
      <div class="between" @click="checktab(-1)">
        <div class="header-list">
          <img :src="water_first" />
          资格认定
        </div></div
      >
      <div class="between" @click="checktab(index)" v-for="(item, index) in headList" :key="index">
        <div class="arrow"><img :src="arrow" /></div>
        <div class="header-list">
          <img :src="item.url" />
          {{ item.name }}
        </div></div
      >
    </div>
    <div class="between">
      <div class="common-color background-l">
        <div class="aliam-center">
          <div class="line"></div>
          <div class="strong">工作组进度</div></div
        >
        <ElTabs class="demo-tabs news" v-if="flag" @tab-click="handleClick">
          <ElTabPane label="房产" name="房产" />
          <ElTabPane label="土地" name="土地" />
        </ElTabs>
        <tabButton @tab="tab" :tabList="tabList" />
        <div class="echart-wrap">
          <div class="echart-item" v-for="item in workGroupOptions" :key="item.index">
            <div class="echart-item-lt">
              <!-- <img class="top-img" :src="item.url" /> -->
              <span class="user-name">{{ item.name }}</span>
            </div>

            <div class="echart-item-ct">
              <div class="progress" :style="{ width: `${item.number}%` }"></div>
            </div>

            <div class="echart-item-rt">
              <text class="txt">{{ item.number }}户</text>
            </div>
          </div>
        </div>
      </div>
      <div class="background-r">
        <div class="white">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">完成情况</div></div
          >
          <Echart :options="householdOption" :height="300" />
        </div>
        <div class="white">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">进度预警</div></div
          >
          <Table
            :data="tableObject"
            :columns="allSchemas.tableColumns"
            :header-cell-style="{ background: '#F2F6ff' }"
            row-key="id"
            headerAlign="center"
            align="center"
            highlightCurrentRow
          >
            <!-- <template #doorNo="{ row }">
                  {{ filterViewDoorNo(row) }}
                </template>
                <template #regionText="{ row }">
                  <div>
                    {{
                      `
                  ${row.cityCodeText ? row.cityCodeText + '/' : ''}
                  ${row.areaCodeText ? row.areaCodeText : ''}
                  ${row.townCodeText ? '/' + row.townCodeText : ''}
                  ${row.villageText ? '/' + row.villageText : ''}
                  ${row.virutalVillageText ? '/' + row.virutalVillageText : ''}
                  `
                    }}
                  </div>
                </template>
                <template #reportDate="{ row }">
                  <div>{{ formatDate(row.reportDate) }}</div>
                </template> -->
            <template #radiu>
              <div class="center"><div class="radiuBox"></div></div>
            </template>
            <template #filling="{ row }">
              <div class="filling-btn" @click="viewProfile(row)">查看档案</div>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <bottomTarg />
  </div>
</template>

<script lang="ts" setup>
import Echart from '@/components/Echart/src/Echart.vue'
import water_first from '@/assets/imgs/water_first.png'
import water_two from '@/assets/imgs/water_two.png'
import water_three from '@/assets/imgs/water_three.png'
import water_four from '@/assets/imgs/water_four.png'
import water_five from '@/assets/imgs/water_five.png'
import water_six from '@/assets/imgs/water_six.png'
import water_seven from '@/assets/imgs/water_seven.png'
import water_eight from '@/assets/imgs/water_eight.png'
import arrow from '@/assets/imgs/arrow.png'

// import icon_first from '@/assets/imgs/home/icon_first.png' // 引入工作粗比拼晾晒 No.1 icon
// import icon_second from '@/assets/imgs/home/icon_second.png' // 引入工作粗比拼晾晒 No.2 icon
// import icon_third from '@/assets/imgs/home/icon_third.png' // 引入工作粗比拼晾晒 No.3 icon
// import icon_four from '@/assets/imgs/home/icon_four.png' // 引入工作粗比拼晾晒 No.4 icon
// import icon_five from '@/assets/imgs/home/icon_five.png' // 引入工作粗比拼晾晒 No.5 icon
import tabButton from '../Home/components/tabButton.vue'
import { ref, reactive, onMounted } from 'vue'
// import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'
// import { getLandlordListApi } from '@/api/AssetEvaluation/service'
// import { useAppStore } from '@/store/modules/app'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import bottomTarg from '../Home/components/bottomTarg.vue'

import {
  warningList,
  villageScheduleList,
  scheduleRankList
} from '@/api/AssetEvaluation/leader-side'
import { ElTabs, ElTabPane, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'

const BackIcon = useIcon({ icon: 'iconoir:undo' })
const tableObject = ref<any>([])
const parmas = ref<any>({ type: 1, isToday: false })
const type = ref<number>(1)
const flag = ref<boolean>(false)
const getWarningList = async () => {
  tableObject.value = await warningList({})
}
const getVillageScheduleList = async () => {
  const list = await villageScheduleList({ type: type.value })
  console.log(list, '1222')
  const dataList = ref<any>([])
  const incompleteNumberList = ref<any>([])
  const completeNumberList = ref<any>([])
  list.forEach((item) => {
    dataList.value.push(item.name)
    incompleteNumberList.value.push(item.incompleteNumber)
    completeNumberList.value.push(item.completeNumber)
  })
  // householdOption.value.xAxis.data = dataList.value
  console.log(householdOption.value.xAxis.data, '11111')
  householdOption.value.series[0].data = completeNumberList.value
  householdOption.value.series[1].data = incompleteNumberList.value
}
const getScheduleRankList = async () => {
  const list = await scheduleRankList(parmas.value)
  //false 累计 true 今日
  workGroupOptions.value = list.map((item) => {
    return Object.assign({}, { name: item.name, number: item.completeNumber })
  })
}

onMounted(() => {
  getWarningList()
  getVillageScheduleList()
  getScheduleRankList()
})
// const { register, tableObject, methods } = useTable({
//   getListApi: getLandlordListApi
// })
// const appStore = useAppStore()
// const projectId = appStore.currentProjectId
// const { setSearchParams } = methods

// tableObject.params = {
//   projectId,
//   status: 'implementation'
// }
const schema = reactive<CrudSchema[]>([
  // table字段 分割
  // {
  //   field: 'index',
  //   type: 'index',
  //   label: '进度预警',
  //   search: {
  //     show: false
  //   }
  // },
  {
    field: 'radiu',
    label: '进度预警',
    fixed: 'left',
    width: 115,
    search: {
      show: false
    }
  },
  {
    field: 'name',
    label: '户主姓名',
    search: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '户号',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'legalPersonName',
    label: '所属行政村',
    search: {
      show: false
    }
  },
  // {
  //   field: 'regionText',
  //   label: '所属区域',
  //   width: 190,
  //   search: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'regionText',
  //   label: '所在位置',
  //   search: {
  //     show: false
  //   }
  // },
  {
    field: 'gridmanName',
    label: '工作组',
    search: {
      show: false
    }
  },
  {
    field: 'gridmanPhone',
    label: '当前进度',
    search: {
      show: false
    }
  },
  {
    field: 'filling',
    label: '操作',
    fixed: 'right',
    width: 115,
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])
const viewProfile = (row) => {
  console.log(row)
}
const { allSchemas } = useCrudSchemas(schema)
// setSearchParams({ type: 'PeasantHousehold', status: SurveyStatusEnum.Implementation })
// setSearchParams({ type: 'IndividualHousehold', status: 'implementation' })
const tabList = [
  {
    title: '累计'
  },
  {
    title: '今日'
  }
]
const tab = (index) => {
  if (index == 0) {
    parmas.value = { type: type.value, isToday: false }
    getScheduleRankList()
  } else {
    parmas.value = { type: type.value, isToday: true }
    getScheduleRankList()
  }
}

const checktab = (index) => {
  if (index == -1) {
    type.value = 1
    getVillageScheduleList()
  } else {
    type.value = index + 2
    console.log(type.value)
    getVillageScheduleList()
    if (index == 0) {
      flag.value = true
    } else {
      flag.value = false
    }
  }
}

const handleClick = (tab) => {
  if (tab.props.name == '房产') {
    // console.log(tab.props.name, '11111111111111')
    // type.value = 10
    // parmas.value = { type: type.value, isToday: false }
    parmas.value.type = 10
    getScheduleRankList()
  } else if (tab.props.name == '土地') {
    // console.log(tab.props.name, '222222222222')
    // type.value = 11
    // parmas.value = { type: type.value, isToday: false }
    parmas.value.type = 11
    getScheduleRankList()
  }
}
const workGroupOptions = ref<any>([
  // { index: 1, name: '陈汉林', progress: 100, number: 125, url: icon_first },
  // { index: 2, name: '梁柏林', progress: 90, number: 115, url: icon_second },
  // { index: 3, name: '董化杰', progress: 80, number: 105, url: icon_third },
  // { index: 4, name: '潘永浩', progress: 70, number: 98, url: icon_four },
  // { index: 5, name: '董羽坤', progress: 65, number: 85, url: icon_five },
  // { index: 1, name: '陈汉林', progress: 100, number: 125, url: icon_first },
  // { index: 2, name: '梁柏林', progress: 90, number: 115, url: icon_second },
  // { index: 3, name: '董化杰', progress: 80, number: 105, url: icon_third },
  // { index: 4, name: '潘永浩', progress: 70, number: 98, url: icon_four },
  // { index: 5, name: '董羽坤', progress: 65, number: 85, url: icon_five },
  // { index: 1, name: '陈汉林', progress: 100, number: 125, url: icon_first },
  // { index: 2, name: '梁柏林', progress: 90, number: 115, url: icon_second },
  // { index: 3, name: '董化杰', progress: 80, number: 105, url: icon_third },
  // { index: 4, name: '潘永浩', progress: 70, number: 98, url: icon_four },
  // { index: 5, name: '董羽坤', progress: 65, number: 85, url: icon_five }
])
const headList = [
  // { url: water_first, name: '资格认定' },
  { url: water_two, name: '资产评估' },
  { url: water_three, name: '安置确认' },
  { url: water_four, name: '择址确认' },
  { url: water_five, name: '腾空过渡' },
  { url: water_six, name: '动迁协议' },
  { url: water_seven, name: '搬迁安置' },
  { url: water_eight, name: '生产安置' }
]
const householdOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    //   指示框名字  注意！要和下方series中的name一起改
    data: ['已完成', '未完成'],
    // 指示框位置  距离上下左右多少
    right: '10%',
    top: '5%',
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
    data: [
      '殿前村',
      '大畈村',
      '后染村',
      '里镜村',
      '潭角村',
      '下潘村',
      '小泉村',
      '竹潭村',
      '安山村',
      '荷塘村',
      '市中社',
      '钟楼社',
      '桐中井',
      '里东村',
      '姚宫村',
      '琅珂村',
      '大塘坑'
    ]
  },
  yAxis: {
    type: 'value'
    // data: ['村6', '村7', '村8', '村6', '村7', '村8', '村6', '村7', '村8', '村6']
  },
  series: [
    {
      name: '已完成',
      data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
          // {
          //   offset: 1,
          //   color: '#8EBBFF' // 100% 处的颜色
          // }
        ]
      }
    },
    {
      name: '未完成',
      data: [1, 1, 1, 1, 1, 1, 1, 1, 1],

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
            color: '#65A4FE' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#FF8E8E ' // 100% 处的颜色
          // }
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
/deep/ .el-tabs__nav .el-tabs__item {
  width: 80%;
  height: 22px;
  font-size: 16px;
  font-family: PingFang SC-Bold, PingFang SC;
  text-align: center;
  font-weight: bold;
  // color: #3e73ec;
  line-height: 19px;
  // -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
}

.data-fill {
  width: 100%;
}

.common-color {
  width: 100%;
  /* background-color: white; */
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
  width: 39.5%;
  background-color: white;
}

.background-r {
  width: 59.5%;
}

.white {
  padding: 10px;
  margin: 10px 0px auto;
  background-color: white;
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
  background: linear-gradient(180deg, #f1f9ff 0%, #ffffff 100%);
  border-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 2 2;
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.echart-wrap {
  display: flex;
  flex-direction: column;
  // width: 436px;
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
        // overflow: hidden;
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
</style>
