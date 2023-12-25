<template>
  <div>
    <Echart :options="liquidOption" :height="100" :width="120" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Echart from '@/h5/components/Echarts/index.vue'

const props = defineProps<{
  title?: string
  value?: number
  values?: string
}>()
const values = props.values
const liquidOption = ref({
  title: [
    {
      text: props.title,
      x: '26%',
      y: '75%',
      textStyle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#171718',
        lineHeight: 20,
        textAlign: 'center'
      }
    }
  ],
  series: [
    {
      type: 'liquidFill',
      radius: '50%',
      center: ['50%', '50%'],
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          colorStops: [
            {
              offset: 0,
              color: '#446bf5'
            },
            {
              offset: 1,
              color: '#2ca3e2'
            }
          ],
          globalCoord: false
        }
      ],
      data: [values, values, values, values], // data个数代表波浪数
      backgroundStyle: {
        borderWidth: 1,
        color: 'RGBA(240, 240, 240, 0.5)'
      },
      label: {
        normal: {
          textStyle: {
            fontSize: 16,
            color: '#fff'
          }
        }
      },
      outline: {
        borderDistance: 0,
        itemStyle: {
          borderWidth: 2,
          borderColor: '#e9f3ff'
        }
      }
    }
  ]
})
</script>

<style lang="less" scoped></style>
