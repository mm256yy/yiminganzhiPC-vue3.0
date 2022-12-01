<template>
  <div class="w-540px h-400px">
    <div id="map"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface PointType {
  longitude: number
  latitude: number
  address?: string
}

interface Props {
  point: PointType
}
const props = defineProps<Props>()
const emit = defineEmits(['chose'])

const map = ref<any>(null)
const longitude = 120.12792
const latitude = 30.228932

const init = () => {
  const lng = props.point.longitude || longitude
  const lat = props.point.latitude || latitude
  map.value = new BMapGL.Map('map')
  map.value?.centerAndZoom(new BMapGL.Point(lng, lat), 12) // 初始化地图,设置中心点坐标和地图级别
  map.value?.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
  // 添加控件
  addControl()
  // 添加标记
  addOverlay(lng, lat)
  // 监听事件
  addListener()
}

onMounted(() => {
  init()
})

const addControl = () => {
  // 城市选择控件
  const cityControl = new BMapGL.CityListControl({
    // 控件的停靠位置（可选，默认左上角）
    anchor: BMAP_ANCHOR_TOP_LEFT,
    // 控件基于停靠位置的偏移量（可选）
    offset: new BMapGL.Size(10, 5)
  })
  // 缩放
  const zoomCtrl = new BMapGL.ZoomControl() // 添加缩放控件
  // 比例尺
  const scaleCtrl = new BMapGL.ScaleControl()

  map.value?.addControl(cityControl)
  map.value?.addControl(zoomCtrl)
  map.value?.addControl(scaleCtrl)
}

const addOverlay = (longitude, latitude) => {
  const marker = new BMapGL.Marker(new BMapGL.Point(longitude, latitude))
  map.value.addOverlay(marker)
}

const clearOverlay = () => {
  map.value.clearOverlays()
}

const getAddress = (point: PointType, callback: (d: string) => void) => {
  // 创建地理编码实例
  const myGeo = new BMapGL.Geocoder()
  // 根据坐标得到地址描述
  myGeo.getLocation(new BMapGL.Point(point.longitude, point.latitude), function (result) {
    if (result && callback) {
      callback(result.address)
    }
  })
}

const addListener = () => {
  map.value.addEventListener('click', function (e) {
    const { lng, lat } = e.latlng
    clearOverlay()
    // 添加标记
    addOverlay(lng, lat)
    const point: PointType = {
      longitude: lng,
      latitude: lat
    }
    // console.log(point, 'point')
    // 拿到地址
    getAddress(point, (address: string) => {
      point.address = address
      emit('chose', point)
    })
  })
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  font-family: '微软雅黑';
}
</style>
