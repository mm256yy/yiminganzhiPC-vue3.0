<template>
  <div>
    <Echart :options="liquidOption" :height="80" :width="100" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Echart from '@/h5/components/Echarts/index.vue'
const values = 0.45

const props = defineProps<{
  title?: string
  value?: number
}>()

const liquidOption = ref({
  title: [
    {
      text: props.title,
      x: '20%',
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
      data: [values, values], // data个数代表波浪数
      backgroundStyle: {
        borderWidth: 1,
        color: 'RGBA(51, 66, 127, 0.7)'
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
          borderColor: '#112165'
        }
      }
    }
  ]
})
</script>

<style lang="less" scoped></style>
