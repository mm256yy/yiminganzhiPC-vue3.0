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
    <!-- 上面区域 -->
    <div class="common-color" style="background-color: white">
      <div class="between">
        <div class="aliam-center">
          <div class="line"></div>
          <div class="strong">项目概览</div></div
        >
        <div>
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
      <div class="between">
        <div class="header-list">
          <div class="strong aliam-center title-padding">
            <Icon icon="teenyicons:right-solid" style="color: #97b7ff" />职业分布</div
          >
          <tabButton @tab="tab" :tabList="tabListCareer" />
          <Echart :options="careerOption" :height="340" />
        </div>
        <div class="header-list">
          <div class="strong aliam-center title-padding">
            <Icon icon="teenyicons:right-solid" style="color: #97b7ff" />户籍规模</div
          >
          <!-- impProgressOption -->
          <Echart :options="domicileOption" :height="340" />
        </div>
        <div class="header-list">
          <div class="strong aliam-center title-padding">
            <Icon icon="teenyicons:right-solid" style="color: #97b7ff" />年龄性别分析</div
          >
          <div class="between gender-list"
            ><div>男性:{{ numberMan }}</div>
            <div>女性:{{ numberWoman }}</div>
            <!-- <div>男女比例:{{ (numberMan / numberWoman).toFixed(2) }}</div> -->
          </div>
          <Echart :options="genderOption" :height="300" />
        </div>
      </div>
    </div>
    <!-- 中间区域 -->
    <div class="between">
      <div style="width: 30%; background-color: white" class="common-color">
        <div class="between">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">参保覆盖率</div></div
          >
        </div>
        <Echart :options="insuredOption" :height="410" />
      </div>
      <div style="width: 38%; margin-left: 0.5%; background-color: white" class="common-color">
        <div class="between">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">房屋分析</div></div
          >
        </div>
        <tabButton @tab-person="tabPerson" :tabList="tabListHouse" />
        <div class="between gender-list">
          <div>户均住房面积</div>
          <div>2000,000m²</div>
        </div>
        <Echart :options="houseOption" :height="300" />
      </div>
      <div></div>
      <div style="width: 30%; height: 454px; background-color: white" class="common-color">
        <div class="between">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">土地分析</div></div
          >
        </div>
        <div class="between gender-list">
          <div>户均土地面积</div>
          <div>2000,000人</div>
        </div>
        <div class="echart-wrap">
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
        </div></div
      >
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
      <div style="width: 30%; background-color: white" class="common-color">
        <div class="between">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">资金分析</div></div
          >
        </div>
        <div class="between gender-list">
          <div>户均补偿补助金额</div>
          <div>2000,000元</div>
        </div>
        <Echart :options="fundOption" :height="465" />
      </div>
      <div style="width: 69%; background-color: white" class="common-color">
        <div class="between">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">移民村分析</div></div
          >
        </div>
        <tabButton @tab-village-analysis="tabVillageAnalysis" :tabList="tabListImmigration" />
        <div class="between gender-list">
          <div>总人口</div>
          <div>{{ villageAnalysisNumber }}人</div>
        </div>
        <Echart :options="immigrationOption" :height="415" />
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
  getVillageList
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
const reason = ref()
const appStore = useAppStore()
const villageAnalysisNumber = ref<number>()
const typeNumber = ref<number>(1)
const numberMan = ref<number>()
const numberWoman = ref<number>()
const tag = ref<boolean>(true)
const getChartScreenLists = async () => {
  const list = await getChartScreenList({ code: reason.value })
  console.log(list, '1111')
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
    householdNumberList.value.push(list.householdNumber[0][index])
  }
  domicileOption.value.series[0].data = householdNumberList.value
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
const tabVillage = async () => {
  console.log(reason.value, '选中的code')
  getVillageAnalysisLists()
  getChartScreenLists()
}
const tabPerson = (index) => {
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
    title: '学历分布'
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
  { index: 1, name: '耕地', progress: 100, number: 125 },
  { index: 2, name: '水田', progress: 90, number: 115 },
  { index: 3, name: '水浇地', progress: 80, number: 105 },
  { index: 4, name: '旱地', progress: 70, number: 98 },
  { index: 5, name: '园地', progress: 65, number: 85 },
  { index: 6, name: '耕地', progress: 100, number: 125 },
  { index: 7, name: '水田', progress: 90, number: 115 },
  { index: 8, name: '水浇地', progress: 80, number: 105 },
  { index: 9, name: '旱地', progress: 70, number: 98 },
  { index: 10, name: '园地', progress: 65, number: 85 },
  { index: 11, name: '耕地', progress: 100, number: 125 },
  { index: 12, name: '水田', progress: 90, number: 115 },
  { index: 13, name: '水浇地', progress: 80, number: 105 },
  { index: 14, name: '旱地', progress: 70, number: 98 },
  { index: 15, name: '园地', progress: 65, number: 85 }
]
// const genderList = [
//   { title: '男性', num: '6145' },
//   { title: '女性', num: '6145' },
//   { title: '男女比例', num: '6145' }
// ]
//参保覆盖率
const insuredOption = ref({
  // title: [
  //   {
  //     text: 'Tangential Polar Bar Label Position (middle)'
  //   }
  // ],
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
      show: false // 显示坐标轴轴线
    },
    axisTick: {
      show: false // 显示坐标刻度
    }
  },
  radiusAxis: {
    type: 'category',
    // data: ['商业保险', '医疗保险', '养老保险', '其他'],
    axisLine: {
      show: false // 显示坐标轴轴线
    },
    axisTick: {
      show: false // 显示坐标刻度
    }
  },
  tooltip: {},
  series: [
    {
      name: '商业保险',
      type: 'bar',
      data: [20, 40, 60, 80],
      coordinateSystem: 'polar',
      barWidth: 20,
      colorBy: 'data'
    },
    {
      name: '医疗保险',
      type: 'bar',
      data: [20, 40, 60, 80],
      coordinateSystem: 'polar',
      barWidth: 20,
      colorBy: 'data'
    },
    {
      name: '养老保险',
      type: 'bar',
      data: [20, 40, 60, 80],
      coordinateSystem: 'polar',
      barWidth: 20,
      colorBy: 'data'
    },
    {
      name: '其他',
      type: 'bar',
      data: [20, 40, 60, 80],
      coordinateSystem: 'polar',
      barWidth: 20,
      colorBy: 'data'
    }
  ]
})
const tab = (index) => {
  if (index == 0) {
    careerOption.value.legend.data = [
      '研究生',
      '大学生',
      '专科生',
      '技效生',
      '高中生',
      '初中生',
      '小学生',
      '未上学'
    ]
    careerOption.value.series.forEach((item) => {
      item.data = [
        { value: 600, name: '研究生' },
        { value: 600, name: '大学生' },
        { value: 600, name: '专科生' },
        { value: 600, name: '技校生' },
        { value: 600, name: '高中生' },
        { value: 600, name: '初中生' },
        { value: 600, name: '小学生' },
        { value: 600, name: '未上学' }
      ]
    })
  } else if (index == 1) {
    careerOption.value.legend.data = [
      '专业技术人员',
      '办事人员和有关人员',
      '商业、服务业人员',
      '农、林、牧、渔、水利业生产人员',
      '生产、运输设备操作人员及有关人员',
      '不便分类的其他从业人员'
    ]
    careerOption.value.series.forEach((item) => {
      item.data = [
        { value: 600, name: '专业技术人员' },
        { value: 100, name: '办事人员和有关人员' },
        { value: 200, name: '商业、服务业人员' },
        { value: 300, name: '农、林、牧、渔、水利业生产人员' },
        { value: 400, name: '生产、运输设备操作人员及有关人员' },
        { value: 500, name: '不便分类的其他从业人员' }
      ]
    })
  }
}
//职业分布
const careerOption = ref({
  // title: {
  //   text: 'Referer of a Website',
  //   subtext: 'Fake Data',
  //   left: 'center'
  // },
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
    left: '62%',
    textStyle: {
      color: '#666666' //字体颜色
      // borderRadius: '50%'
    },
    icon: 'circle'
  },
  tooltip: {
    trigger: 'item'
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
  legend: {
    // 指示框名字  注意！要和下方series中的name一起改
    data: ['奖励费', '补偿费', '补助费'],
    // 指示框位置  距离上下左右多少
    right: 'center',
    bottom: '2%',
    textStyle: {
      color: '#666666' //字体颜色
      // borderRadius: '50%'
    },
    icon: 'circle'
  },
  tooltip: {
    trigger: 'item'
  },
  // legend: {
  //   orient: 'vertical',
  //   left: 'left'
  // },
  series: [
    {
      name: '奖励费',
      type: 'pie',
      radius: ['40%', '80%'],
      data: [
        { value: 735, name: '淹没区' },
        { value: 580, name: '建设区' },
        { value: 484, name: '影响区' }
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
      }
    },
    {
      name: '补偿费',
      type: 'pie',
      radius: ['40%', '80%'],
      data: [
        { value: 735, name: '淹没区' },
        { value: 580, name: '建设区' },
        { value: 484, name: '影响区' }
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
      }
    },
    {
      name: '补助费',
      type: 'pie',
      radius: ['40%', '80%'],
      data: [
        { value: 735, name: '淹没区' },
        { value: 580, name: '建设区' },
        { value: 484, name: '影响区' }
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
      }
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
    show: true
    // type: 'value'
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
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      backgroundStyle: {
        // color: 'linear-gradient(100deg, #95C9FF 0%, #4892FB 100%)'
        color: 'linear-gradient(294deg, #4FC9FA 0%, #45DBE5 100%)'
      },
      data: [50, 50, 30, 60, 70, 20, 40, 50, 10]
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
    trigger: 'item'
  },
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
//年龄性别分析数据图
// option = {
//   legend: {},
//   tooltip: {},
//   dataset: {
//     source: [
//       ['product', '2015', '2016', '2017'],
//       ['Matcha Latte', 43.3, 85.8, 93.7],
//       ['Milk Tea', 83.1, 73.4, 55.1],
//       ['Cheese Cocoa', 86.4, 65.2, 82.5],
//       ['Walnut Brownie', 72.4, 53.9, 39.1]
//     ]
//   },
//   xAxis: { type: 'category' },
//   yAxis: {},
//   // Declare several bar series, each will be mapped
//   // to a column of dataset.source by default.
//   series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
// };

const genderOption = ref({
  tooltip: {
    trigger: 'item'
  },
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
    containLabel: true
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
            color: '#8EBBFF' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#8EBBFF' // 100% 处的颜色
          // }
        ]
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
            color: '#FF8E8E ' // 0% 处的颜色
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
  padding: 10px;
  margin: 10px 0px auto;
  border-radius: 5px;
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
  width: calc((100%) / 3);
  /* flex: 1; */
}

.echart-wrap {
  display: flex;
  flex-direction: column;
  width: 436px;
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
      align-items: center;
      flex-direction: row;

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

.gender-list {
  padding: 12px;
  margin-top: 10px;
  background-color: #f2f6ff;
}
</style>
