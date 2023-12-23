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
      <div style="width: 120px">
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
                <div class="line"></div>学历职业分析
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
          <div v-loading="genderLoading" class="header-list">
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
            <div class="around gender-list">
              <div
                >男性:
                <span class="gender-txt">
                  {{ numberMan }} ({{
                    ((numberMan / (numberMan + numberWoman)) * 100).toFixed(2)
                  }}%)
                </span>
              </div>
              <div
                >女性:
                <span class="gender-txt">
                  {{ numberWoman }}({{
                    ((numberWoman / (numberMan + numberWoman)) * 100).toFixed(2)
                  }}%)
                </span>
              </div>
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
          <div class="display-flex gender-list">
            <div>{{ tabPersonName }}住房面积</div>
            <div class="gender-txt"
              >{{ tabPersonName == '人均' ? perPersonMapTotal : perHouseholdTotal }}m²</div
            >
          </div>
          <Echart :options="houseOption" :height="300" :width="'100%'" />
        </div>
        <div
          v-loading="groundLoading"
          style="width: 33%; background-color: white"
          class="common-color"
        >
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
              <div class="line"></div>土地分析（搬迁村）
            </div>
          </div>
          <div class="display-flex gender-list">
            <div>户均土地面积</div>
            <div class="gender-txt">{{ renjuntd.avgVal }}㎡</div>
          </div>
          <div class="echart-wrap" style="margin-top: 20px">
            <div class="echart-item" v-for="item in renjuntd.data" :key="item.name">
              <div class="echart-item-lt" :class="{ 'left-tit': item.isParent === '1' }">
                <div v-if="item.isParent === '1'" class="arrow-to-right"></div>
                <div v-else class="left-dot"></div>
                <div
                  style="
                    width: 80px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    white-space: nowrap;
                    cursor: pointer;
                  "
                  :title="item.name"
                >
                  {{ item.name }}</div
                >
              </div>

              <div class="echart-item-ct">
                <div
                  class="progress"
                  :style="{
                    width: `${(item.val / dataSum) * 100}%`,
                    marginLeft: item.isParent !== '1' ? '-8px' : ''
                  }"
                ></div>
              </div>

              <div class="echart-item-rt">
                <text class="txt">{{ item.val }}&nbsp;户</text>
              </div>
            </div>
          </div>
        </div>
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
          <div class="display-flex gender-list">
            <div>户均补偿补助金额</div>
            <div class="gender-txt">{{ aalls }}元</div>
          </div>
          <Echart :options="fundOption" :height="465" />
        </div>
        <div style="width: 66.4%; background-color: white" class="common-color">
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
          <div v-if="typeNumber != 4" class="display-flex gender-list">
            <div>总人口</div>
            <div class="gender-txt">{{ villageAnalysisNumber }}人</div>
          </div>
          <div v-else class="center gender-list">
            <div>总土地</div>
            <div class="ground-txt">{{ villageAnalysisNumber }}亩</div>
          </div>
          <div v-loading="analysisLoading">
            <Echart v-if="typeNumber != 4" :options="immigrationOption" :height="415" />
            <Echart v-else :options="tudiArr" :height="415" />
          </div>
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
import { ElSelect, ElOption, ElButton, ElDialog } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
// import iconEduSrc from '@/assets/imgs/homes/icon_edu.png'

const BackIcon = useIcon({ icon: 'iconoir:undo' })
const analysisLoading = ref<boolean>(false)
const groundLoading = ref<boolean>(false)
const genderLoading = ref<boolean>(false)

const tabVillageAnalysis = (index) => {
  typeNumber.value = index + 1
  getVillageAnalysisLists()
}

let aalls: any = ref()
let renjuntd: any = ref({})
let dataSum = 0
const reason = ref()
const villageAnalysisNumber = ref<number>()
const typeNumber = ref<number>(1)
let numberMan: any = ref()
let numberWoman: any = ref()
const tag = ref<boolean>(true)
const perPersonMapTotal = ref<string>()
const perHouseholdTotal = ref<string>()
const dataAll = ref()

const getChartScreenLists = async () => {
  groundLoading.value = true
  genderLoading.value = true
  const list = await getChartScreenList({ code: reason.value })
  let zhiji = await getFundAnalysis()
  try {
    let gengdi = await getLanAnalysisReport()
    dataSum = gengdi.data.reduce((pre, item) => {
      if (item.val > pre) {
        pre = item.val
      }
      return pre
    }, 0)
    renjuntd.value = gengdi
    groundLoading.value = false
  } catch {
    groundLoading.value = false
  }
  perPersonMapTotal.value = list.perPersonMapTotal[0].areaTotal
  perHouseholdTotal.value = list.perHouseholdTotal[0].areaTotal
  aalls.value = zhiji.avgMoney
  fundOption.value.series[0].data = zhiji.data.reduce((pre, item) => {
    pre.push({ value: item.totalPrice, name: item.name })
    return pre
  }, [])
  dataAll.value = list
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
  genderLoading.value = false
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
  analysisLoading.value = true
  const list = await getVillageAnalysisList({
    // code: appStore.getVillageCoder,
    code: reason.value,
    type: typeNumber.value
  })
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
  }
  analysisLoading.value = false
}
const tabVillage = async () => {
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

//参保覆盖率
const insuredOption: any = ref({
  color: ['#0041D7', '#3E73EC', '#7CA4FF', '#A2BEFF'],
  legend: {
    // 指示框名字  注意！要和下方series中的name一起改
    // data: ['商业保险', '医疗保险', '养老保险', '其他'],
    // 指示框位置  距离上下左右多少
    right: 'center',
    bottom: '2%',
    textStyle: {
      color: '#666666' //字体颜色
      // borderRadius: '50%'
    },
    icon: 'circle'
  },
  polar: {
    radius: [30, '60%']
  },
  angleAxis: {
    max: 100,
    startAngle: 90,
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

const getImageSrc = async () => {
  return await import('@/assets/imgs/homes/icon_edu.png')
}
//职业分布
const careerOption = ref({
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
  graphic: {
    //图形中间图片
    elements: [
      {
        type: 'image',
        style: {
          image: getImageSrc(), //你的图片地址
          width: 70,
          height: 70
        },
        left: 'center',
        top: 'center',
        level: '999'
      }
    ]
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)' // 鼠标悬浮在各分区时的提示内容
  },
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
            color: '#000',
            fontWeight: 'bold'
          }
        }
      }
    }
  ]
})
// 房屋分析数据
const houseOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    show: false
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '0',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['钢架', '框架', '砖混', '砖木', '石木', '土木', '木', '简易', '排架']
  },
  yAxis: {
    type: 'value'
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
      },
      label: {
        show: true,
        position: 'top',
        color: '#000',
        fontWeight: 'bold'
      }
    }
  ]
})
// 移民村分析数据
const immigrationOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}' // 鼠标悬浮在各分区时的提示内容
  },
  color: ['#0041D7', '#3E73EC', '#7CA4FF', '#A2BEFF', '#BFD3FF', '#D4E1FF'],
  legend: {
    show: false
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
      name: 'Sale',
      type: 'bar',
      data: [],
      barWidth: 57,
      colorBy: 'data',
      label: {
        show: true,
        position: 'top',
        color: '#000',
        fontWeight: 'bold'
      }
    }
  ]
})

const genderOption: any = ref({
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
  },
  series: [
    {
      name: '男',
      data: [],
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
        ]
      },
      label: {
        show: true, //开启显示
        position: 'top', //在上方显示
        formatter: function (params) {
          const result: number = (params.data / numberMan.value) * 100
          if (isNaN(result)) {
            return '' // 如果数值为 NaN，则返回空字符串
          } else {
            return result.toFixed(2) + '%'
          }
        },
        color: '#000',
        fontWeight: 'bold'
      }
    },
    {
      name: '女',
      data: [],
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
  legend: {
    show: false
  },
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
  border: 2px solid #8faef4;
  box-shadow: 0px 2px 6px #b6caf8;
}

.between {
  display: flex;
  justify-content: space-between;
}

.display-flex {
  display: flex;
  align-items: center;
}

.around {
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
  border: 2px solid #8faef4;
  box-shadow: 0px 2px 6px #b6caf8;
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

    .echart-item-lt {
      display: flex;
      width: 80px;
      padding-left: 20px;
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
      width: 300px;
      justify-content: flex-start;
      /* margin-left: 16px; */

      .progress {
        height: 10px;
        background: linear-gradient(90deg, #0041d7 0%, #d4e1ff 100%);
        /* transform: skewX(-30deg); */
        /* transform-origin: 0% 0%; */
      }
    }

    .echart-item-rt {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;

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

.gender-txt {
  padding-top: 4px;
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  font-weight: bold;
  color: #171718;
}

.ground-txt {
  margin-left: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #171718;
}

.left-tit {
  margin-left: -10px;
  font-size: 18px;
  font-weight: bolder;
  text-align: left;
}

.arrow-to-right {
  width: 0;
  height: 0;
  margin: 10px;
  font-size: 0px;
  line-height: 20px;
  border-top: 8px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid #97b7ff;
}

.left-dot {
  width: 6px;
  height: 6px;
  margin-right: 8px;
  background: #9fbcff;
  border-radius: 50%;
}
</style>
