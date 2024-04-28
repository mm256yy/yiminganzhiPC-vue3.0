<script setup lang="ts">
// import type { EChartsOption } from 'echarts'
import echarts from '@/plugins/echarts'
import { debounce } from 'lodash-es'
import { propTypes } from '@/utils/propTypes'
// PropType,
import { computed, ref, unref, watch, onMounted, onBeforeUnmount, onActivated } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { isString } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('echart')

const appStore = useAppStore()

const props = defineProps({
  options: {
    type: Object as any,
    required: true
  },
  width: propTypes.oneOfType([Number, String]).def(''),
  height: propTypes.oneOfType([Number, String]).def('500px')
})

const isDark = computed(() => appStore.getIsDark)

const theme = computed(() => {
  const echartTheme: boolean | string = unref(isDark) ? true : 'auto'

  return echartTheme
})

const optionsComputed = computed(() => {
  return Object.assign(props.options, {
    darkMode: unref(theme)
  })
})

const elRef = ref<ElRef>()

let echartRef: Nullable<echarts.ECharts> = null

const contentEl = ref<Element>()

const styles = computed(() => {
  const width = isString(props.width) ? props.width : `${props.width}px`
  const height = isString(props.height) ? props.height : `${props.height}px`

  return {
    width,
    height
  }
})

const initChart = () => {
  if (unref(elRef) && props.options) {
    echartRef = echarts.init(unref(elRef) as HTMLElement)
    echartRef?.setOption(unref(optionsComputed))
    echartRef.on('mouseover', (params: any) => {
      console.log(params)

      if (params.componentType === 'xAxis') {
        let elementDiv: any = document.getElementById('showDom')
        let elementStyle =
          'position: absolute;z-index: 99999;color: #fff;font-size: 12px;padding: 7px;display: inline;border-radius: 4px;background-color: rgba(0,0,0,0.7);box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 8px;'
        elementDiv.style.cssText = elementStyle
        elementDiv.innerHTML = params.value
        var xx = params.event.event.clientX - 55
        var yy = params.event.event.clientY - 55
        elementDiv.style.top = yy + 'px'
        elementDiv.style.left = xx + 'px'
      }
    })
    echartRef.on('mouseout', (params) => {
      if (params.componentType === 'xAxis') {
        let elementDiv: any = document.getElementById('showDom')
        let elementStyle = 'display: none'
        elementDiv.style.cssText = elementStyle
      }
    })
  }
}

watch(
  () => optionsComputed.value,
  (options) => {
    if (echartRef) {
      echartRef?.setOption(options)
    }
  },
  {
    deep: true
  }
)

const resizeHandler = debounce(() => {
  if (echartRef) {
    echartRef.resize()
  }
}, 100)

const contentResizeHandler = async (e: TransitionEvent) => {
  if (e.propertyName === 'width') {
    resizeHandler()
  }
}

onMounted(() => {
  initChart()

  window.addEventListener('resize', resizeHandler)

  contentEl.value = document.getElementsByClassName(`${variables.namespace}-layout-content`)[0]
  unref(contentEl) &&
    (unref(contentEl) as Element).addEventListener('transitionend', contentResizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  unref(contentEl) &&
    (unref(contentEl) as Element).removeEventListener('transitionend', contentResizeHandler)
})

onActivated(() => {
  if (echartRef) {
    echartRef.resize()
  }
})
</script>

<template>
  <div ref="elRef" :class="[$attrs.class, prefixCls]" :style="styles"></div>
</template>
