<template>
  <div class="data-fill" style="height: 100%">
    <div style="display: flex; justify-content: space-between">
      <ElButton
        @click="onBack"
        :icon="BackIcon"
        type="default"
        class="px-9px py-0px !h-28px mr-8px !text-12px"
      >
        返回
      </ElButton>
      <div style="width: 80px">
        <ElSelect clearable filterable v-model="reason" class="!w-full" @change="tabVillage">
          <ElOption
            v-for="item in villageLists"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </ElSelect>
      </div>
    </div>
    <div
      style="
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        justify-content: space-between;
      "
    >
      <!-- 上面区域 -->
      <div class="common-color">
        <div class="between">
          <div class="header-list">
            <div
              style="
                display: flex;
                padding: 0 10px;
                background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
                justify-content: space-between;
                align-items: center;
              "
            >
              <div
                class="strong aliam-center title-padding"
                style="font-size: 20px; color: #3e73ec"
              >
                <div class="line"></div>职业分布
              </div>
              <tabButton @tab="tab" :tabList="tabListCareer" :link="true" />
            </div>

            <Echart :options="careerOption" :height="340" />
          </div>
          <div class="header-list">
            <div
              style="
                display: flex;
                padding: 0 10px;
                background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
                justify-content: space-between;
                align-items: center;
              "
            >
              <div
                class="strong aliam-center title-padding"
                style="font-size: 20px; color: #3e73ec"
              >
                <div class="line"></div>户籍规模
              </div>
            </div>
            <Echart :options="domicileOption" :height="340" />
          </div>
          <div class="header-list">
            <div
              style="
                display: flex;
                padding: 0 10px;
                background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
                justify-content: space-between;
                align-items: center;
              "
            >
              <div
                class="strong aliam-center title-padding"
                style="font-size: 20px; color: #3e73ec"
              >
                <div class="line"></div>年龄性别分析
              </div>
            </div>
            <div class="between gender-list">
              <div
                >男性:{{ numberMan }} ({{
                  ((numberMan / (numberMan + numberWoman)) * 100).toFixed(2)
                }}%)</div
              >
              <div
                >女性:{{ numberWoman }}({{
                  ((numberWoman / (numberMan + numberWoman)) * 100).toFixed(2)
                }}%)</div
              >
              <!-- <div>男女比例:{{ (numberMan / numberWoman).toFixed(2) }}</div> -->
            </div>
            <Echart :options="genderOption" :height="300" />
          </div>
        </div>
      </div>
      <!-- 中间区域 -->
      <div class="between" style="width: 100%; height: 100%">
        <div style="width: 33%; background-color: white" class="common-color">
          <div
            style="
              display: flex;
              padding: 0 10px;
              background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
              justify-content: space-between;
              align-items: center;
            "
          >
            <div class="strong aliam-center title-padding" style="font-size: 20px; color: #3e73ec">
              <div class="line"></div>参保覆盖率
            </div>
          </div>
          <Echart :options="insuredOption" :height="410" />
        </div>
        <div style="width: 33%; background-color: white" class="common-color">
          <div
            style="
              display: flex;
              padding: 0 10px;
              background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
              justify-content: space-between;
              align-items: center;
            "
          >
            <div class="strong aliam-center title-padding" style="font-size: 20px; color: #3e73ec">
              <div class="line"></div>房屋分析
            </div>
            <tabButton @tab="tabPerson" :tabList="tabListHouse" :link="true" />
          </div>
          <div class="between gender-list">
            <div>{{ tabPersonName }}住房面积</div>
            <div>{{ tabPersonName == '人均' ? perPersonMapTotal : perHouseholdTotal }}m²</div>
          </div>
          <Echart :options="houseOption" :height="300" :width="'100%'" />
        </div>
        <div style="width: 33%; background-color: white" class="common-color">
          <div
            style="
              display: flex;
              padding: 0 10px;
              background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
              justify-content: space-between;
              align-items: center;
            "
          >
            <div class="strong aliam-center title-padding" style="font-size: 20px; color: #3e73ec">
              <div class="line"></div>土地分析
            </div>
          </div>
          <div class="between gender-list">
            <div>户均土地面积</div>
            <div>{{ renjuntd.avgVal }}㎡</div>
          </div>
          <div class="echart-wrap" style="margin-top: 20px">
            <div class="echart-item" v-for="item in renjuntd.data" :key="item.name">
              <div class="echart-item-lt" :class="{ 'left-tit': item.isParent == '1' }">
                <div
                  style="
                    width: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    white-space: nowrap;
                  "
                >
                  {{ item.name }}</div
                >
              </div>

              <div class="echart-item-ct">
                <div class="progress" :style="{ width: `${(item.val / dataSum) * 100}%` }"></div>
              </div>

              <div class="echart-item-rt">
                <text class="txt">{{ item.val }}户</text>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="echart-wrap">
        <div class="echart-item" v-for="item in workGroupOptions" :key="item.index">
          <div class="echart-item-lt">
            <span class="user-name">{{ item.name }}</span>
          </div>

          <div class="echart-item-ct">
            <div class="progress" :style="{ width: `${item.progress}%` }"></div>
          </div>

          <div class="echart-item-rt">
            <text class="txt">{{ item.number }}户</text>
          </div>
        </div>
      </div> -->
      </div>
      <!-- 下面区域 -->
      <div class="between">
        <div style="width: 33%; background-color: white" class="common-color">
          <div
            style="
              display: flex;
              padding: 0 10px;
              background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
              justify-content: space-between;
              align-items: center;
            "
          >
            <div class="strong aliam-center title-padding" style="font-size: 20px; color: #3e73ec">
              <div class="line"></div>资金分析
            </div>
          </div>
          <div class="between gender-list">
            <div>户均补偿补助金额</div>
            <div>{{ aalls }}元</div>
          </div>
          <Echart :options="fundOption" :height="465" />
        </div>
        <div style="width: 66%; background-color: white" class="common-color">
          <div
            style="
              display: flex;
              padding: 0 10px;
              background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
              justify-content: space-between;
              align-items: center;
            "
          >
            <div class="strong aliam-center title-padding" style="font-size: 20px; color: #3e73ec">
              <div class="line"></div>移民村分析
            </div>
            <tabButton
              @tab-village-analysis="tabVillageAnalysis"
              :tabList="tabListImmigration"
              :link="true"
            />
          </div>
          <div class="between gender-list">
            <div>总人口</div>
            <div>{{ villageAnalysisNumber }}人</div>
          </div>
          <Echart v-if="typeNumber != 4" :options="immigrationOption" :height="415" />
          <Echart v-else :options="tudiArr" :height="415" />
        </div>
      </div>
    </div>

    <bottomTarg />
  </div>
</template>

<script setup lang="ts">
import Echart from '@/components/Echart/src/Echart.vue'
import { ref, onMounted } from 'vue'
import tabButton from '../Home/components/tabButton.vue'
import bottomTarg from '../Home/components/bottomTarg.vue'
import {
  getChartScreenList,
  getVillageAnalysisList,
  getVillageList,
  getFundAnalysis,
  getLanAnalysisReport
} from '@/api/AssetEvaluation/leader-side'
import { useAppStore } from '@/store/modules/app'
import { ElSelect, ElOption, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'

const BackIcon = useIcon({ icon: 'iconoir:undo' })

const tabVillageAnalysis = (index) => {
  typeNumber.value = index + 1
  getVillageAnalysisLists()
}
let aalls: any = ref()
let renjuntd: any = ref({})
let dataSum = 0
const reason = ref()
const appStore = useAppStore()
const villageAnalysisNumber = ref<number>()
const typeNumber = ref<number>(1)
let numberMan: any = ref()
let numberWoman: any = ref()
const tag = ref<boolean>(true)
const perPersonMapTotal = ref<string>()
const perHouseholdTotal = ref<string>()
const dataAll = ref()
const getChartScreenLists = async () => {
  const list = await getChartScreenList({ code: reason.value })
  let zhiji = await getFundAnalysis()
  let gengdi = await getLanAnalysisReport()
  dataSum = gengdi.data.reduce((pre, item) => {
    if (item.val > pre) {
      pre = item.val
    }
    return pre
  }, 0)
  renjuntd.value = gengdi
  console.log(gengdi)
  perPersonMapTotal.value = list.perPersonMapTotal[0].areaTotal
  perHouseholdTotal.value = list.perHouseholdTotal[0].areaTotal
  aalls.value = zhiji.avgMoney
  fundOption.value.series[0].data = zhiji.data.reduce((pre, item) => {
    pre.push({ value: item.totalPrice, name: item.name })
    return pre
  }, [])
  dataAll.value = list
  console.log(list, '1111')
  careerOption.value.legend.data = dataAll.value.career.reduce((pre, item) => {
    pre.push(item.label)
    return pre
  }, [])
  careerOption.value.series.forEach((item) => {
    item.data = dataAll.value.career.reduce((pre, item) => {
      pre.push({ value: item.number, name: item.label })
      return pre
    }, [])
  })
  let all = 0
  for (var index in list.insuranceNumber[0]) {
    all += list.insuranceNumber[0][index]
  }
  insuredOption.value.series[0].data[0] = (
    (dataAll.value.insuranceNumber[0].commerceNumber / all) *
    100
  ).toFixed(2)
  insuredOption.value.series[0].data[1] = (
    (dataAll.value.insuranceNumber[0].medicalNumber / all) *
    100
  ).toFixed(2)
  insuredOption.value.series[0].data[2] = (
    (dataAll.value.insuranceNumber[0].retirementNumber / all) *
    100
  ).toFixed(2)
  insuredOption.value.series[0].data[3] = (
    (dataAll.value.insuranceNumber[0].otherNumber / all) *
    100
  ).toFixed(2)
  console.log(insuredOption.value.series, 'bbq')

  numberMan.value = list.ageNumber[0].numberMan
  numberWoman.value = list.ageNumber[0].numberWoman
  genderOption.value.series[0].data = [
    list.ageNumber[0].numberMan0,
    list.ageNumber[0].numberMan18,
    list.ageNumber[0].numberMan36,
    list.ageNumber[0].numberMan50,
    list.ageNumber[0].numberMan66
  ]
  genderOption.value.series[1].data = [
    list.ageNumber[0].numberWoman0,
    list.ageNumber[0].numberWoman18,
    list.ageNumber[0].numberWoman36,
    list.ageNumber[0].numberWoman50,
    list.ageNumber[0].numberWoman66
  ]
  const householdNumberList = ref<any>([])
  for (var index in list.householdNumber[0]) {
    let m = ''
    if (index == 'nineNumber') {
      m = '九人户'
    } else if (index == 'eightNumber') {
      m = '八人户'
    } else if (index == 'sevenNumber') {
      m = '七人户'
    } else if (index == 'sixNumber') {
      m = '六人户'
    } else if (index == 'fiveNumber') {
      m = '五人户'
    } else if (index == 'fourNumber') {
      m = '四人户'
    } else if (index == 'threeNumber') {
      m = '三人户'
    } else if (index == 'towNumber') {
      m = '二人户'
    } else if (index == 'oneNumber') {
      m = '一人户'
    }
    if (m) {
      householdNumberList.value.push({ value: list.householdNumber[0][index], name: m })
    }
  }
  console.log(householdNumberList.value, 'bbq')

  domicileOption.value.series[0].data = householdNumberList.value
  domicileOption.value.yAxis.data = householdNumberList.value.reduce((pre, item) => {
    pre.push(item.name)
    return pre
  }, [])
  if (tag.value) {
    const perHouseholdList = ref<any>([])
    list.perHousehold.forEach((item) => {
      perHouseholdList.value.push(item.area)
    })
    houseOption.value.series[0].data = perHouseholdList.value
  } else {
    const perHouseholdList = ref<any>([])
    list.perPerson.forEach((item) => {
      perHouseholdList.value.push(item.area)
    })
    houseOption.value.series[0].data = perHouseholdList.value
  }
}
const villageLists = ref<any>([])
const villageList = async () => {
  villageLists.value = await getVillageList({})
}
const getVillageAnalysisLists = async () => {
  const list = await getVillageAnalysisList({
    // code: appStore.getVillageCoder,
    code: reason.value,
    type: typeNumber.value
  })
  console.log(list, '2222')
  if (typeNumber.value == 4) {
    tudiArr.value.xAxis[0].data = list.reduce((pre, item) => {
      pre.push(item.qsdw)
      return pre
    }, [])
    let arr = {}
    list.forEach((item) => {
      for (let i in item) {
        if (i != 'qsdw') {
          if (!arr[i]) arr[i] = []
          arr[i].push(item[i])
        }
      }
    })
    let sseries: any = []
    for (let m in arr) {
      if (m == 'caodi') {
        sseries.push({
          name: '草地',
          type: 'bar',
          stack: 'Ad',
          barWidth: 57,
          emphasis: {
            focus: 'series'
          },
          data: arr[m]
        })
      } else if (m == 'gengdi') {
        sseries.push({
          name: '耕地',
          type: 'bar',
          stack: 'Ad',
          barWidth: 57,
          emphasis: {
            focus: 'series'
          },
          data: arr[m]
        })
      } else if (m == 'gkccyd') {
        sseries.push({
          name: '工矿仓储用地',
          type: 'bar',
          stack: 'Ad',
          barWidth: 57,
          emphasis: {
            focus: 'series'
          },
          data: arr[m]
        })
      } else if (m == 'ggfwyd') {
        sseries.push({
          name: '公共管理与公共服务用地',
          type: 'bar',
          stack: 'Ad',
          barWidth: 57,
          emphasis: {
            focus: 'series'
          },
          data: arr[m]
        })
      } else if (m == 'jtyd') {
        sseries.push({
          name: '交通用地',
          type: 'bar',
          stack: 'Ad',
          barWidth: 57,
          emphasis: {
            focus: 'series'
          },
          data: arr[m]
        })
      } else if (m == 'lindi') {
        sseries.push({
          name: '林地',
          type: 'bar',
          stack: 'Ad',
          barWidth: 57,
          emphasis: {
            focus: 'series'
          },
          data: arr[m]
        })
      } else if (m == 'sfyd') {
        sseries.push({
          name: '商服用地',
          type: 'bar',
          stack: 'Ad',
          barWidth: 57,
          emphasis: {
            focus: 'series'
          },
          data: arr[m]
        })
      } else if (m == 'syyd') {
        sseries.push({
          name: '水域及水利设施用地',
          type: 'bar',
          stack: 'Ad',
          barWidth: 57,
          emphasis: {
            focus: 'series'
          },
          data: arr[m]
        })
      } else if (m == 'tsyd') {
        sseries.push({
          name: '特殊用地',
          type: 'bar',
          stack: 'Ad',
          barWidth: 57,
          emphasis: {
            focus: 'series'
          },
          data: arr[m]
        })
      } else if (m == 'yuandi') {
        sseries.push({
          name: '园地',
          type: 'bar',
          stack: 'Ad',
          barWidth: 57,
          emphasis: {
            focus: 'series'
          },
          data: arr[m]
        })
      } else if (m == 'zzyd') {
        sseries.push({
          name: '住宅用地',
          type: 'bar',
          stack: 'Ad',
          barWidth: 57,
          emphasis: {
            focus: 'series'
          },
          data: arr[m]
        })
      }
    }
    tudiArr.value.series = sseries
    console.log(sseries, tudiArr.value.xAxis)
  } else {
    const dataList = ref<any>([])
    const numberList = ref<any>([])
    list.forEach((item) => {
      dataList.value.push(item.name)
      numberList.value.push(item.number)
    })
    immigrationOption.value.xAxis.data = dataList.value
    immigrationOption.value.series[0].data = numberList.value
    villageAnalysisNumber.value = numberList.value.reduce((old, now) => {
      return old + now
    }, 0)
    console.log(numberList.value, '1111111111')
  }
}
const tabVillage = async () => {
  console.log(reason.value, '选中的code')
  getVillageAnalysisLists()
  getChartScreenLists()
}
const tabPersonName = ref<string>('')
if (tabPersonName.value) {
} else {
  tabPersonName.value = '户均'
}
const tabPerson = (index) => {
  tabPersonName.value = tabListHouse[index].title
  if (index == 0) {
    tag.value = true
    getChartScreenLists()
  } else {
    tag.value = false
    getChartScreenLists()
  }
}
onMounted(() => {
  getChartScreenLists()
  getVillageAnalysisLists()
  villageList()
  console.log(appStore.getVillageCoder, '测试数据的传入')
})
const tabListCareer = [
  {
    title: '文化程度分布'
  },
  {
    title: '职业分布'
  }
]
const tabListHouse = [
  {
    title: '户均'
  },
  {
    title: '人均'
  }
]
const tabListImmigration = [
  {
    title: '人口'
  },
  {
    title: '户数'
  },
  {
    title: '补偿补助费'
  },
  {
    title: '土地'
  },
  {
    title: '村集体资产补偿费'
  }
]
const workGroupOptions = [
  { index: 1, name: '耕地', progress: 100, number: 125, show: true },
  { index: 2, name: '水田', progress: 90, number: 115 },
  { index: 3, name: '水浇地', progress: 80, number: 105 },
  { index: 4, name: '旱地', progress: 70, number: 98 },
  { index: 5, name: '园地', progress: 65, number: 85, show: true },
  { index: 6, name: '果园', progress: 100, number: 125 },
  { index: 7, name: '水园', progress: 90, number: 115 },
  { index: 8, name: '苹果园', progress: 80, number: 105 },
  { index: 9, name: '香蕉园', progress: 70, number: 98 },
  { index: 10, name: '草莓园', progress: 65, number: 85 },
  { index: 11, name: '林地', progress: 100, number: 125, show: true },
  { index: 12, name: '山林', progress: 90, number: 115 },
  { index: 13, name: '土林', progress: 80, number: 105 },
  { index: 14, name: '水林', progress: 70, number: 98 },
  { index: 15, name: '枫林', progress: 65, number: 85 }
]
// const genderList = [
//   { title: '男性', num: '6145' },
//   { title: '女性', num: '6145' },
//   { title: '男女比例', num: '6145' }
// ]
//参保覆盖率
const insuredOption: any = ref({
  // title: [
  //   {
  //     text: 'Tangential Polar Bar Label Position (middle)'
  //   }
  // ],
  color: ['#0041D7', '#3E73EC', '#7CA4FF', '#A2BEFF'],
  legend: {
    // 指示框名字  注意！要和下方series中的name一起改
    data: ['商业保险', '医疗保险', '养老保险', '其他'],
    // 指示框位置  距离上下左右多少
    // right: 'center',
    bottom: '2%',
    textStyle: {
      color: '#666666' //字体颜色
      // borderRadius: '50%'
    },
    icon: 'circle'
  },
  polar: {
    radius: [30, '80%']
  },
  angleAxis: {
    max: 100,
    startAngle: 100,

    axisLine: {
      show: true // 显示坐标轴轴线
    },
    axisTick: {
      show: true // 显示坐标刻度
    }
  },
  radiusAxis: {
    type: 'category',
    data: ['商业保险', '医疗保险', '养老保险', '其他'],
    axisLabel: {
      interval: 0, //代表显示所有x轴标签显示
      show: true
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b} : {c}%'
  },

  series: [
    {
      type: 'bar',
      data: [2, 1.2, 2.4, 3.6],
      coordinateSystem: 'polar',
      barWidth: 10
    }
    // {
    //   name: '医疗保险',
    //   type: 'bar',
    //   data: [0, 80],
    //   coordinateSystem: 'polar',
    //   showBackground: true,
    //   barWidth: 10,
    //   colorBy: 'data'
    // },
    // {
    //   name: '养老保险',
    //   type: 'bar',
    //   data: [0, 80],
    //   coordinateSystem: 'polar',
    //   showBackground: true,
    //   barWidth: 10,
    //   colorBy: 'data'
    // },
    // {
    //   name: '其他',
    //   type: 'bar',
    //   data: [0, 80],
    //   coordinateSystem: 'polar',
    //   showBackground: true,
    //   barWidth: 10,
    //   colorBy: 'data'
    // }
  ]
})
const tab = (index) => {
  if (index == 0) {
    careerOption.value.legend.data = dataAll.value.career.reduce((pre, item) => {
      pre.push(item.label)
      return pre
    }, [])
    careerOption.value.series.forEach((item) => {
      item.data = dataAll.value.career.reduce((pre, item) => {
        pre.push({ value: item.number, name: item.label })
        return pre
      }, [])
    })
  } else if (index == 1) {
    console.log(dataAll.value)

    careerOption.value.legend.data = dataAll.value.education.reduce((pre, item) => {
      pre.push(item.label)
      return pre
    }, [])
    careerOption.value.series.forEach((item) => {
      item.data = dataAll.value.education.reduce((pre, item) => {
        pre.push({ value: item.number, name: item.label })
        return pre
      }, [])
    })
  }
}
function arrCount(arr) {
  let count = 0
  arr.forEach((item) => {
    count = count + item.value
  })
  return count
}
//职业分布
const careerOption = ref({
  // title: {
  //   text: 'Referer of a Website',
  //   subtext: 'Fake Data',
  //   left: 'center'
  // },
  color: ['#0041D7', '#3E73EC', '#7CA4FF', '#A2BEFF', '#BFD3FF', '#D4E1FF'],
  legend: {
    // 指示框名字  注意！要和下方series中的name一起改
    data: [
      '专业技术人员',
      '办事人员和有关人员',
      '商业、服务业人员',
      '农、林、牧、渔、水利业生产人员',
      '生产、运输设备操作人员及有关人员',
      '不便分类的其他从业人员'
    ],
    // 指示框位置  距离上下左右多少
    // right: 'center',
    // bottom: '2%',
    top: 'center',
    right: '10%',
    left: '50%',
    textStyle: {
      color: '#666666', //字体颜色
      fontSize: '10'
    },
    icon: 'circle',
    formatter: function (name) {
      let singleData = careerOption.value.series[0].data.filter(function (item) {
        return item.name == name
      })
      let m = careerOption.value.series[0].data.reduce((pre, item) => {
        pre += item.value
        return pre
      }, 0)
      console.log(m, singleData)

      return name + ' | ' + ((singleData[0].value / m) * 100).toFixed(2) + '%'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)' // 鼠标悬浮在各分区时的提示内容
  },
  // legend: {
  //   orient: 'vertical',
  //   left: 'left'
  // },
  series: [
    {
      // name: '奖励费',
      type: 'pie',
      radius: ['40%', '80%'],
      data: [
        { value: 600, name: '专业技术人员' },
        { value: 100, name: '办事人员和有关人员' },
        { value: 200, name: '商业、服务业人员' },
        { value: 300, name: '农、林、牧、渔、水利业生产人员' },
        { value: 400, name: '生产、运输设备操作人员及有关人员' },
        { value: 500, name: '不便分类的其他从业人员' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'red'
        }
      },
      label: {
        show: false,
        position: 'center'
      },
      right: '50%'
    },
    {
      // name: '补偿费',
      type: 'pie',
      radius: ['40%', '80%'],
      data: [
        { value: 600, name: '专业技术人员' },
        { value: 100, name: '办事人员和有关人员' },
        { value: 200, name: '商业、服务业人员' },
        { value: 300, name: '农、林、牧、渔、水利业生产人员' },
        { value: 400, name: '生产、运输设备操作人员及有关人员' },
        { value: 500, name: '不便分类的其他从业人员' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      // label: {
      //   normal: {
      //     show: true,
      //     formatter: '{b}\n{d}%'
      //   }
      // }
      label: {
        show: false,
        position: 'center'
      },
      right: '50%'
    },
    {
      // name: '补助费',
      type: 'pie',
      radius: ['40%', '80%'],
      data: [
        { value: 600, name: '专业技术人员' },
        { value: 100, name: '办事人员和有关人员' },
        { value: 200, name: '商业、服务业人员' },
        { value: 300, name: '农、林、牧、渔、水利业生产人员' },
        { value: 400, name: '生产、运输设备操作人员及有关人员' },
        { value: 500, name: '不便分类的其他从业人员' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      // label: {
      //   normal: {
      //     show: true,
      //     formatter: '{b}\n{d}%'
      //   }
      // }
      label: {
        show: false,
        position: 'center'
      },
      right: '50%'
    }
  ]
})
//资金分析
const fundOption = ref({
  // title: {
  //   text: 'Referer of a Website',
  //   subtext: 'Fake Data',
  //   left: 'center'
  // },
  color: ['#0041D7', '#3E73EC', '#7CA4FF', '#A2BEFF', '#BFD3FF', '#D4E1FF'],
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)' // 鼠标悬浮在各分区时的提示内容
  },
  legend: {
    bottom: '5%',
    left: 'center'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
})
//户籍规模
const domicileOption = ref({
  // color: ['#4892FB', '#F89DA0'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
    }
    // formatter: (params) => {
    //   let nameStr = ''
    //   let str = ''
    //   params &&
    //     params.map((item: any) => {
    //       nameStr = item.name
    //       str = str.concat(`
    //         <div>${item.seriesName}：${item.value}%</div>
    //       `)
    //     })
    //   return nameStr + str
    // }
  },
  legend: {
    // 指示框名字  注意！要和下方series中的name一起改
    // 指示框位置  距离上下左右多少
    // right: 'center',
    // bottom: '2%',
    show: true,
    top: 'center',
    right: '10%',
    left: '50%',
    textStyle: {
      color: '#666666', //字体颜色
      fontSize: '10'
    },
    icon: 'circle'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '0%',
    top: 30,
    containLabel: true
  },
  xAxis: {
    show: false
  },
  yAxis: {
    type: 'category',
    axisLine: {
      show: true // 显示坐标轴轴线
    },
    axisTick: {
      show: true // 显示坐标刻度
    },
    data: ['一人户', '二人户', '三人户', '四人户', '五人户', '六人户', '七人户', '八人户', '九人户']
  },
  series: [
    {
      // name: '实际进度',
      type: 'bar',
      barWidth: 15,
      stack: 'total',
      // label: {
      //   show: true
      // },
      emphasis: {
        focus: 'series'
      },
      backgroundStyle: {
        // color: 'linear-gradient(100deg, #95C9FF 0%, #4892FB 100%)'
        color: 'linear-gradient(294deg, #4FC9FA 0%, #45DBE5 100%)'
      },
      data: [50, 50, 30, 60, 70, 20, 40, 50, 10],
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: 'right', //在上方显示
            textStyle: {
              //数值样式
              color: 'black',
              fontSize: 8
            }
          }
        }
      }
    }
    // {
    //   name: '计划进度',
    //   type: 'bar',
    //   barWidth: 15,
    //   stack: 'total',
    //   label: {
    //     show: false
    //   },
    //   emphasis: {
    //     focus: 'series'
    //   },
    //   data: [80, 70, 50, 70, 90, 60, 70, 80]
    // }
  ]
})
// 房屋分析数据
const houseOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    // 指示框名字  注意！要和下方series中的name一起改
    // data: ['男', '女'],
    // 指示框位置  距离上下左右多少
    // right: '10%',
    // top: '5%',
    // textStyle: {
    //   color: '#666666 ' //字体颜色
    // }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['钢架', '框架', '砖混', '砖木', '石木', '土木', '木', '简易', '排架']
  },
  yAxis: {
    type: 'value'
    // data: ['0-17岁', '18-35岁', '36-49岁', '50-65岁', '65岁以上岁', '村6', '村7', '村8']
  },
  series: [
    {
      // name: '男',
      data: [10, 18, 30, 20, 15, 12, 14, 19, 35],
      type: 'bar',
      barWidth: 25,
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
          //   color: '#8EBBFF' // 100% 处的颜色
          // }
        ]
      }
    }
    // {
    //   name: '女',
    //   data: [1200, 1300, 2500, 2100, 1800],
    //   type: 'bar',
    //   barWidth: 30,
    //   // stack: 'all',
    //   color: {
    //     type: 'linear',
    //     x: 0, // 右
    //     y: 0, // 下
    //     x2: 0, // 左
    //     y2: 1, // 上
    //     colorStops: [
    //       {
    //         offset: 0,
    //         color: '#FF8E8E ' // 0% 处的颜色
    //       }
    //       // {
    //       //   offset: 1,
    //       //   color: '#FF8E8E ' // 100% 处的颜色
    //       // }
    //     ]
    //   }
    // }
  ]
})
// 移民村分析数据
const immigrationOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}' // 鼠标悬浮在各分区时的提示内容
  },
  color: ['#0041D7', '#3E73EC', '#7CA4FF', '#A2BEFF', '#BFD3FF', '#D4E1FF'],
  // legend: {
  //   //   指示框名字  注意！要和下方series中的name一起改
  //   data: ['未采集', '已采集'],
  //   // 指示框位置  距离上下左右多少
  //   right: '10%',
  //   top: '5%',
  //   textStyle: {
  //     color: '#4F4F4F' //字体颜色
  //   }
  // },
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
      name: 'Sale',
      type: 'bar',
      data: [],
      barWidth: 57,
      colorBy: 'data'
    }
    // {
    //   name: '已采集',
    //   data: [100, 120, 300, 200, 150, 210, 230, 250],
    //   type: 'bar',
    //   barWidth: 57,
    //   stack: 'all',
    //   color: {
    //     type: 'linear',
    //     x: 0, // 右
    //     y: 0, // 下
    //     x2: 0, // 左
    //     y2: 1, // 上
    //     colorStops: [
    //       {
    //         offset: 0,
    //         color: 'rgba(113, 182, 185, 1)' // 0% 处的颜色
    //       },
    //       {
    //         offset: 1,
    //         color: 'rgba(37, 197, 102, 1)' // 100% 处的颜色
    //       }
    //     ]
    //   }
    // },
    // {
    //   name: '未采集',
    //   data: [120, 130, 250, 210, 180, 110, 290, 250],
    //   type: 'bar',
    //   barWidth: 45,
    //   stack: 'all',
    //   color: {
    //     type: 'linear',
    //     x: 0, // 右
    //     y: 0, // 下
    //     x2: 0, // 左
    //     y2: 1, // 上
    //     colorStops: [
    //       {
    //         offset: 0,
    //         color: 'rgba(22, 208, 255, 1)' // 0% 处的颜色
    //       },
    //       {
    //         offset: 1,
    //         color: 'rgba(0, 102, 255, 1)' // 100% 处的颜色
    //       }
    //     ]
    //   }
    // }
  ]
})

const genderOption = ref({
  tooltip: {
    trigger: 'item'
  },
  color: ['#5E8AEF', '#D2DFFF'],
  legend: {
    //   指示框名字  注意！要和下方series中的name一起改
    data: ['男', '女'],
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
    containLabel: true,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    }
  },
  xAxis: {
    type: 'category',
    data: ['0-17岁', '18-35岁', '36-49岁', '50-65岁', '65岁以上岁']
  },
  yAxis: {
    type: 'value'
    // data: ['0-17岁', '18-35岁', '36-49岁', '50-65岁', '65岁以上岁', '村6', '村7', '村8']
  },
  series: [
    {
      name: '男',
      data: [1400, 1800, 3000, 2000, 1500],
      type: 'bar',
      barWidth: 30,
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
            color: '#5E8AEF' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#8EBBFF' // 100% 处的颜色
          // }
        ]
      },
      label: {
        show: true, //开启显示
        position: 'top', //在上方显示
        formatter: function (params) {
          return ((params.data / numberMan.value) * 100).toFixed(2) + '%'
        },
        textStyle: {
          //数值样式
          color: 'black', //字体颜色
          fontSize: 10 //字体大小
        }
      }
    },
    {
      name: '女',
      data: [1200, 1300, 2500, 2100, 1800],
      type: 'bar',
      barWidth: 30,
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
            color: '#D2DFFF ' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#FF8E8E ' // 100% 处的颜色
          // }
        ]
      },
      label: {
        show: true, //开启显示
        position: 'top', //在上方显示
        formatter: function (params) {
          return ((params.data / numberWoman.value) * 100).toFixed(2) + '%'
        }, //显示百分号
        textStyle: {
          //数值样式
          color: 'black', //字体颜色
          fontSize: 10 //字体大小
        }
      }
    }
  ]
})
const tudiArr = ref({
  color: [
    '#4682B4',
    '#6495ED',
    '#1E90FF',
    '#B0C4DE',
    '#00BFFF',
    '#87CEEB',
    '#87CEFA',
    '#ADD8E6',
    '#B0E0E6',
    '#E6E6FA',
    '#F0F8FF'
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: []
})
const { back } = useRouter()
const onBack = () => {
  back()
}
</script>

<style scoped>
.data-fill {
  /* display: flex; */
  width: 100%;
  /* margin: 0 auto;
  justify-content: space-between; */
}

.common-color {
  width: 100%;
  /* background-color: white; */
  margin: 10px 0px;
}

.between {
  display: flex;
  justify-content: space-between;
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

.header-list {
  width: 33%;
  background-color: white;
  /* flex: 1; */
}

.echart-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* height: 185px; */
  padding: 0 10px;
  box-sizing: border-box;

  .echart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    /* height: 37px; */

    .echart-item-lt {
      display: flex;
      /* flex-direction: row; */
      width: 60px;
      font-size: 14px;
      text-overflow: ellipsis;
      word-break: keep-all;
      align-items: center;
      justify-content: center;

      .top-img {
        width: 26px;
        height: 20px;
        margin-right: 10px;
      }

      .user-name {
        width: 42px;
        overflow: hidden;
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
        background: linear-gradient(90deg, #0041d7 0%, #d4e1ff 100%);
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

.gender-list {
  padding: 12px;
  margin: 0 12px 0 12px;
  background: #f2f6ff;
  background-color: #f2f6ff;
  border-radius: 8px 8px 8px 8px;
  box-shadow: 0px 2px 0px 0px rgba(62, 115, 236, 0.2);
}

.left-tit {
  margin-left: -10px;
  font-size: 18px;
  font-weight: bolder;
  text-align: left;
}
</style>
