<template>
  <div class="section-portrait">
    <div class="flex-row justify-between items-center">
      <div class="flex-row items-center">
        <div class="shrink-zero title-marker"></div>
        <span class="label-title">移民数智</span>
      </div>
    </div>
    <!--职业分布-->
    <div class="flex-row items-center">
      <div class="arrow-right"></div>
      <div class="arrow-label">{{ educationTypeTitle }}</div>
    </div>
    <div class="education-type-group">
      <div
        class="education-type-btn"
        :class="{ active: currentType === item.id }"
        v-for="item in educationTypeList"
        :key="item.id"
        @click="tabChange(item.id)"
      >
        {{ item.name }}
      </div>
    </div>
    <!--chart-->
    <Echart :options="educationOption" :height="420" />
    <!--户籍规模-->
    <div class="flex-row items-center">
      <div class="arrow-right"></div>
      <div class="arrow-label">户籍规模</div>
    </div>
    <Echart :options="scaleOption" :height="280" />
    <!--年龄性别分析-->
    <div class="flex-row items-center">
      <div class="arrow-right"></div>
      <div class="arrow-label">年龄性别分析</div>
    </div>
    <div class="genderAnalysis">
      <div class="section-block">
        <div class="flex-col items-center justify-center">
          <div class="flex-row items-center">
            <img class="image-icon" :src="iconMan" />
            <span class="name-txt">男性</span>
          </div>
          <span class="count-txt">{{ eachartList.four.x }}人</span>
        </div>
      </div>
      <div class="section-block">
        <div class="flex-col items-center">
          <div class="flex-row items-center">
            <img class="image-icon" :src="iconWoman" />
            <span class="name-txt">女性</span>
          </div>
          <span class="count-txt">{{ eachartList.four.y }}人</span>
        </div>
      </div>
      <div class="section-block">
        <div class="flex-col items-center">
          <div class="flex-row items-center">
            <img class="image-icon" :src="iconGenderRate" />
            <span class="name-txt">男女比例</span>
          </div>
          <span class="count-txt"
            >{{ ((eachartList.four.x * 100) / eachartList.four.y).toFixed(2) }}%</span
          >
        </div>
      </div>
    </div>
    <Echart :options="genderOption" :height="280" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, reactive } from 'vue'
import Echart from '@/h5/components/Echarts/index.vue'
import iconMan from '@/h5/assets/imgs/icon_man.png'
import iconWoman from '@/h5/assets/imgs/icon_woman.png'
import iconGenderRate from '@/h5/assets/imgs/icon_gender_rate.png'
import { getChartScreen } from './service'
const currentType = ref(1)
const educationTypeTitle = ref<string>('学历分布')

interface EducationType {
  id: number
  name: string
}

const educationTypeList = ref<EducationType[]>([
  {
    id: 1,
    name: '学历分布'
  },
  {
    id: 2,
    name: '职业分布'
  }
])
let eachartList: any = reactive({
  one: [],
  two: [],
  there: [],
  four: { x: '', y: '', z: [], m: [] }
})
const tabChange = (id: number) => {
  currentType.value = id
  educationTypeTitle.value = id === 1 ? '学历分布' : '职业分布'
}

// 学历分布图表配置项
const educationOption = ref({})

watch(
  () => educationTypeTitle.value,
  (val) => {
    if (val == '职业分布') {
      educationOption.value = {
        title: {
          text: val,
          x: 'center',
          y: 'center'
        },
        tooltip: {
          show: true,
          trigger: 'item'
        },
        legend: {
          show: true,
          top: 0,
          left: 'center',
          bottom: 10
        },
        grid: {
          top: '40%',
          left: '10%',
          right: '10%',
          bottom: '10%',
          containLabel: true
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: eachartList.two
          }
        ]
      }
    } else {
      educationOption.value = {
        title: {
          text: educationTypeTitle.value,
          x: 'center',
          y: 'center'
        },
        tooltip: {
          show: true,
          trigger: 'item'
        },
        legend: {
          show: true,
          top: 0,
          left: 'center',
          bottom: 10
        },
        grid: {
          top: '40%',
          left: '10%',
          right: '10%',
          bottom: '10%',
          containLabel: false
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: eachartList.one
          }
        ]
      }
    }
  },
  {
    immediate: false
  }
)

// 户籍规模图表配置项
const scaleOption = ref({})

// 年龄性别分析配置项
const genderOption = ref({})
let getChartScreens = async () => {
  let data = await getChartScreen()
  data.education.forEach((item) => {
    //学历数据
    eachartList.one.push({ name: item.label, value: item.number })
  })
  for (let i in data.insuranceNumber[0]) {
    // 职业数据
    eachartList.two.push({ name: i, value: data.insuranceNumber[0][i] })
  }
  for (let m in data.householdNumber[0]) {
    if (m == 'oneNumber') {
      eachartList.there[0] = data.householdNumber[0][m]
    } else if (m == 'towNumber') {
      eachartList.there[1] = data.householdNumber[0][m]
    } else if (m == 'threeNumber') {
      eachartList.there[2] = data.householdNumber[0][m]
    } else if (m == 'fourNumber') {
      eachartList.there[3] = data.householdNumber[0][m]
    } else if (m == 'fiveNumber') {
      eachartList.there[4] = data.householdNumber[0][m]
    } else if (m == 'sixNumber') {
      eachartList.there[5] = data.householdNumber[0][m]
    } else if (m == 'sevenNumber') {
      eachartList.there[6] = data.householdNumber[0][m]
    } else if (m == 'eightNumber') {
      eachartList.there[7] = data.householdNumber[0][m]
    } else if (m == 'nineNumber') {
      eachartList.there[8] = data.householdNumber[0][m]
    }
  }
  eachartList.four.x = data.ageNumber[0].numberMan
  eachartList.four.y = data.ageNumber[0].numberWoman
  delete data.ageNumber[0].numberMan
  delete data.ageNumber[0].numberWoman
  // for (let k in data.ageNumber[0]) {
  // }
  eachartList.four.z = Object.keys(data.ageNumber[0])
    .map(function (i) {
      return data.ageNumber[0][i]
    })
    .slice(0, 5)
  eachartList.four.m = Object.keys(data.ageNumber[0])
    .map(function (i) {
      return data.ageNumber[0][i]
    })
    .slice(5, 10)
  console.log(eachartList.four)

  educationOption.value = {
    title: {
      text: educationTypeTitle.value,
      x: 'center',
      y: 'center'
    },
    tooltip: {
      show: true,
      trigger: 'item'
    },
    legend: {
      show: true,
      top: 0,
      left: 'center',
      bottom: 10
    },
    grid: {
      top: '40%',
      left: '10%',
      right: '10%',
      bottom: '10%',
      containLabel: false
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: eachartList.one
      }
    ]
  }
  scaleOption.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      top: '0%',
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: {
      show: false,
      type: 'value',
      boundaryGap: [0, 0.01],
      axisLine: { show: false },
      axisTick: { show: false }, //刻度
      splitLine: { show: false } //网格
    },
    yAxis: {
      type: 'category',
      data: [
        '一人户',
        '二人户',
        '三人户',
        '四人户',
        '五人户',
        '六人户',
        '七人户',
        '八人户',
        '九人户'
      ],
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        textStyle: {
          color: 'rgba(84, 106, 135, 1)'
        }
      }
    },
    series: [
      {
        type: 'bar',
        barWidth: '14', //设置宽度
        itemStyle: { normal: { color: '#4FC9FA' } }, //柱状图颜色
        showBackground: true,
        backgroundStyle: {
          //设置柱状图背景颜色
          color: '#fff'
        },
        data: eachartList.there
      }
    ]
  }
  genderOption.value = {
    color: ['#8AC1FE', '#F89DA0'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter(params) {
        let nameStr = ''
        let str = ''
        params &&
          params.map((item: any) => {
            nameStr = item.name
            str = str.concat(`
            <div>${item.seriesName}：${item.value}</div>
          `)
          })
        return nameStr + str
      }
    },
    legend: {
      y: 'top',
      x: 'right',
      data: ['男性', '女性']
    },
    grid: {
      left: '0',
      right: '0',
      bottom: '5',
      containLabel: true
    },
    xAxis: [
      {
        data: ['0岁', '18岁', '36岁', '50岁', '66岁'],
        axisTick: {
          show: false //隐藏刻度线
        },
        axisLine: {
          //隐藏y轴
          show: false
        },
        axisLabel: {
          //横坐标全部显示 不隔开显示
          interval: 0
        }
      }
    ],
    yAxis: [
      {
        name: '',
        nameTextStyle: {
          padding: [0, 0, 0, 30] // 四个数字分别为上右下左与原位置距离
        },
        splitArea: {
          //隐藏背景网格区域
          show: false
        },
        splitLine: {
          //隐藏背景网格线
          show: false
        },
        axisTick: {
          show: false //隐藏刻度线
        },
        axisLine: {
          //隐藏y轴
          show: false
        }
      }
    ],
    series: [
      {
        name: '男性',
        type: 'bar',
        data: eachartList.four.z
      },
      {
        name: '女性',
        type: 'bar',
        data: eachartList.four.m
      }
    ]
  }
  return data
}
onMounted(() => {
  getChartScreens()
})
</script>

<style lang="less" scoped>
.section-portrait {
  padding: 0 32px 32px;
  margin: 0 30px;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 16px;
  filter: drop-shadow(0px 0px 14px #0000000d);

  .education-type-group {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .education-type-btn {
      width: 170px;
      height: 56px;
      margin-right: 32px;
      font-size: 28px;
      font-weight: 500;
      line-height: 56px;
      color: #3e73ec;
      text-align: center;
      background: #f2f6ff;
      border-radius: 56px;

      &.active {
        color: #fff;
        background: #3e73ec;
      }
    }
  }

  .genderAnalysis {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .section-block {
      height: 140px;
      padding-top: 40px;
      margin-right: 16px;
      background: #fafafa;
      border-radius: 8px;
      flex: 1;

      .image-icon {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }

      &:last-child {
        margin-right: none;
      }

      .name-txt {
        font-size: 28px;
        font-weight: 500;
        line-height: 40px;
        color: #666666;
      }

      .count-txt {
        font-size: 36px;
        font-weight: bold;
        line-height: 40px;
        color: #171718;
      }
    }
  }
}
</style>
