<template>
  <div>
    <Echart :options="liquidOption" :height="80" :width="100" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Echart from '@/h5/components/Echarts/index.vue'

const props = defineProps({
  title: String,
  value: {
    type: String,
    default: () => '0.01'
  }
})

let liquidOption = ref({
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
      data: [Number(props.value), Number(props.value)], // data个数代表波浪数
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
let setdata = (m) => {
  liquidOption.value = {
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
        data: [Number(m), Number(m)], // data个数代表波浪数
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
  }
}
watch(
  () => props.value,
  (val) => {
    console.log(val, typeof val)
    setdata(val)
  },
  { deep: true, immediate: true }
)
</script>

<style lang="less" scoped></style>
