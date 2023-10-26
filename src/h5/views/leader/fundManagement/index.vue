<template>
  <div class="app-container">
    <ChartBox title="居民户">
      <div>
        <Echart :options="householdOption" :height="260" />
      </div>
    </ChartBox>
    <ChartBox title="村集体">
      <div>
        <Echart :options="villageOption" :height="260" />
      </div>
    </ChartBox>
    <ChartBox title="企(事)业单位">
      <div class="enterprises">
        <div class="section-switch">
          <div class="enterprises-type-group">
            <div
              class="enterprises-type-btn"
              :class="{ active: currentType === item.id }"
              v-for="item in fundTypeList"
              :key="item.id"
              @click="tabChange(item.id)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <Echart :options="enterpriseOption" :height="260" />
      </div>
    </ChartBox>
    <ChartBox title="专业项目">
      <div>
        <Echart :options="professionalProjectOption" :height="260" />
      </div>
    </ChartBox>
    <ChartBox title="其他费用">
      <div>
        <Echart :options="otherFeeOption" :height="260" />
      </div>
    </ChartBox>
    <ChartBox title="有关税费">
      <div>
        <Echart :options="taxesFeesOption" :height="260" />
      </div>
    </ChartBox>
  </div>
</template>

<script setup lang="ts">
import ChartBox from '@/h5/components/ChartBox/index.vue'
import Echart from '@/h5/components/Echarts/index.vue'
import { ref } from 'vue'

const currentType = ref(1)

interface FundType {
  id: number
  name: string
}

const fundTypeList = ref<FundType[]>([
  {
    id: 1,
    name: '企业'
  },
  {
    id: 2,
    name: '水电站'
  }
])

const tabChange = (id: number) => {
  currentType.value = id
}

// 居民户图表配置项
const householdOption = ref({
  color: ['#65A4FE', '#51CE94'],
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
    data: ['应付', '已付']
  },
  grid: {
    left: '0',
    right: '0',
    bottom: '5',
    containLabel: true
  },
  xAxis: [
    {
      data: ['行政村1', '行政村2', '行政村3'],
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
      name: '应付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 200
        },
        {
          name: '2021',
          value: 100
        },
        {
          name: '2022',
          value: 400
        }
      ]
    },
    {
      name: '已付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 66
        },
        {
          name: '2021',
          value: 88
        },
        {
          name: '2022',
          value: 99
        }
      ]
    }
  ],
  itemStyle: {
    //圆弧处理的核心源代码
    borderRadius: [20, 20, 0, 0, 0]
  }
})

// 村集体图表配置项
const villageOption = ref({
  color: ['#58CEEE', '#F9A851'],
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
            <div>${item.seriesName}：${item.value}%</div>
          `)
        })
      return nameStr + str
    }
  },
  legend: {
    y: 'top',
    x: 'right',
    data: ['应付', '已付']
  },
  grid: {
    left: '0',
    right: '0',
    bottom: '5',
    containLabel: true
  },
  xAxis: [
    {
      data: ['行政村1', '行政村2', '行政村3'],
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
      name: '应付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 200
        },
        {
          name: '2021',
          value: 100
        },
        {
          name: '2022',
          value: 400
        }
      ]
    },
    {
      name: '已付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 66
        },
        {
          name: '2021',
          value: 88
        },
        {
          name: '2022',
          value: 99
        }
      ]
    }
  ],
  itemStyle: {
    //圆弧处理的核心源代码
    borderRadius: [20, 20, 0, 0, 0]
  }
})

// 企(事)业单位配置项
const enterpriseOption = ref({
  color: ['#F89DA0', '#8AC1FE'],
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
            <div>${item.seriesName}：${item.value}%</div>
          `)
        })
      return nameStr + str
    }
  },
  legend: {
    y: 'top',
    x: 'right',
    data: ['应付', '已付']
  },
  grid: {
    left: '0',
    right: '0',
    bottom: '5',
    containLabel: true
  },
  xAxis: [
    {
      data: ['行政村1', '行政村2', '行政村3'],
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
      name: '应付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 200
        },
        {
          name: '2021',
          value: 100
        },
        {
          name: '2022',
          value: 400
        }
      ]
    },
    {
      name: '已付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 66
        },
        {
          name: '2021',
          value: 88
        },
        {
          name: '2022',
          value: 99
        }
      ]
    }
  ]
})

// 专业项目配置项
const professionalProjectOption = ref({
  color: ['#938BF4', '#58CFEE'],
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
            <div>${item.seriesName}：${item.value}%</div>
          `)
        })
      return nameStr + str
    }
  },
  legend: {
    y: 'top',
    x: 'right',
    data: ['应付', '已付']
  },
  grid: {
    left: '0',
    right: '0',
    bottom: '5',
    containLabel: true
  },
  xAxis: [
    {
      data: ['行政村1', '行政村2', '行政村3'],
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
      name: '应付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 200
        },
        {
          name: '2021',
          value: 100
        },
        {
          name: '2022',
          value: 400
        }
      ]
    },
    {
      name: '已付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 66
        },
        {
          name: '2021',
          value: 88
        },
        {
          name: '2022',
          value: 99
        }
      ]
    }
  ],
  itemStyle: {
    //圆弧处理的核心源代码
    borderRadius: [20, 20, 0, 0, 0]
  }
})
// 其他费用配置项
const otherFeeOption = ref({
  color: ['#7C7AF4', '#EBD870'],
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
            <div>${item.seriesName}：${item.value}%</div>
          `)
        })
      return nameStr + str
    }
  },
  legend: {
    y: 'top',
    x: 'right',
    data: ['应付', '已付']
  },
  grid: {
    left: '0',
    right: '0',
    bottom: '5',
    containLabel: true
  },
  xAxis: [
    {
      data: ['行政村1', '行政村2', '行政村3'],
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
      name: '应付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 200
        },
        {
          name: '2021',
          value: 100
        },
        {
          name: '2022',
          value: 400
        }
      ]
    },
    {
      name: '已付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 66
        },
        {
          name: '2021',
          value: 88
        },
        {
          name: '2022',
          value: 99
        }
      ]
    }
  ],
  itemStyle: {
    //圆弧处理的核心源代码
    borderRadius: [20, 20, 0, 0, 0]
  }
})

// 有关税费配置项
const taxesFeesOption = ref({
  color: ['#FF9F6D', '#50E192'],
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
            <div>${item.seriesName}：${item.value}%</div>
          `)
        })
      return nameStr + str
    }
  },
  legend: {
    y: 'top',
    x: 'right',
    data: ['应付', '已付']
  },
  grid: {
    left: '0',
    right: '0',
    bottom: '5',
    containLabel: true
  },
  xAxis: [
    {
      data: ['行政村1', '行政村2', '行政村3'],
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
      name: '应付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 200
        },
        {
          name: '2021',
          value: 100
        },
        {
          name: '2022',
          value: 400
        }
      ]
    },
    {
      name: '已付',
      type: 'bar',
      data: [
        {
          name: '2020',
          value: 66
        },
        {
          name: '2021',
          value: 88
        },
        {
          name: '2022',
          value: 99
        }
      ]
    }
  ]
})
</script>

<style lang="less" scoped>
.enterprises {
  position: relative;

  .section-switch {
    position: absolute;
    top: 0;
    left: 0;

    .enterprises-type-group {
      display: flex;
      align-items: center;

      .enterprises-type-btn {
        width: 130px;
        height: 48px;
        margin-right: 32px;
        font-size: 28px;
        font-weight: 500;
        line-height: 48px;
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
  }
}
</style>
