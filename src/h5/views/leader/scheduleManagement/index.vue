<template>
  <div>
    <ScheduleList />
    <ChartBox title="完成情况">
      <div style="overflow: auto">
        <Echart :options="completionStatusOption" :height="260" :width="1000" />
      </div>
    </ChartBox>
  </div>
</template>

<script setup lang="ts">
import ScheduleList from './components/ScheduleList.vue'
import ChartBox from '@/h5/components/ChartBox/index.vue'
import Echart from '@/h5/components/Echarts/index.vue'
import { getVillageSchedule } from './service'
import { ref, onMounted, reactive } from 'vue'
let eachart: any = reactive({
  one: [],
  two: [],
  there: []
})
// 完成情况配置项
const completionStatusOption = ref({})
let getVillageSchedules = async () => {
  let data = await getVillageSchedule()
  data.forEach((item) => {
    eachart.one.push(item.name)
    eachart.two.push(item.completeNumber)
    eachart.there.push(item.incompleteNumber)
  })
  completionStatusOption.value = {
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
      x: 'left',
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
        data: eachart.one,
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
        data: eachart.two
      },
      {
        name: '已付',
        type: 'bar',
        data: eachart.there
      }
    ]
  }
  console.log(data)
}
onMounted(() => {
  getVillageSchedules()
})
</script>

<style lang="less" scoped></style>
