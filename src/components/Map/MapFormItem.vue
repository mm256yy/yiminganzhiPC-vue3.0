<template>
  <el-form-item label="经纬度" :required="!!props.required">
    <el-popover
      placement="bottom"
      width="424"
      trigger="click"
      @show="showPop"
      popper-class="popper-class"
    >
      <Map ref="mapRef" :h="400" :point="position" @chose="onChosePosition" />
      <template #reference>
        <div class="flex items-center w-full">
          <el-input
            class="!w-[calc(100%-25px)]"
            :suffix-icon="locationIcon"
            :model-value="position.longitude ? `${position.longitude},${position.latitude}` : ''"
            placeholder="请选择位置"
            style="cursor: pointer"
            readonly
          />
          <el-tooltip placement="top" content="请点击地图选择经纬度">
            <Icon class="ml-5px" icon="bi:question-circle" color="#231815" />
          </el-tooltip>
        </div>
      </template>
      <div v-if="position.address">{{ position.address }}</div>
    </el-popover>
  </el-form-item>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, reactive } from 'vue'
import { ElPopover, ElInput, ElFormItem, ElTooltip } from 'element-plus'
import { Map } from '@/components/Map'
import { useIcon } from '@/hooks/web/useIcon'

interface PositionType {
  latitude: number
  longitude: number
  address?: string
}

interface PropsType {
  positon?: PositionType
  required?: boolean
}

const props = defineProps<PropsType>()
const emit = defineEmits(['change'])

const mapRef = ref()
const position: PositionType = reactive({
  latitude: 0,
  longitude: 0,
  address: ''
})
const locationIcon = useIcon({
  icon: 'fa6-solid:map-location-dot',
  color: 'var(--el-color-primary)'
})

watch(
  () => props.positon,
  (value) => {
    if (value) {
      position.longitude = value.longitude
      position.latitude = value.latitude
      position.address = value.address
    } else {
      position.longitude = 0
      position.latitude = 0
      position.address = ''
    }
  },
  {
    immediate: true,
    deep: true
  }
)
const onChosePosition = (ps: PositionType) => {
  position.longitude = ps.longitude
  position.latitude = ps.latitude
  position.address = ps.address
  emit('change', ps)
}

const showPop = () => {
  nextTick(() => {
    mapRef.value?.resize()
  })
}
</script>
