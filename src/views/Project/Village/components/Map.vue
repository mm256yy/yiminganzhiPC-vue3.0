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
  map.value = new TMap('map')
  map.value?.centerAndZoom(new TLngLat(lng, lat), 12) // 初始化地图,设置中心点坐标和地图级别
  map.value?.enableHandleMouseScroll() // 开启鼠标滚轮缩放

  // 添加控件
  addControl()
  // 添加标记
  if (props.point.longitude && props.point.latitude) {
    addOverlay(lng, lat)
  }
  // 监听事件
  addMapClick()
}

onMounted(() => {
  init()
})

const addControl = () => {
  // 缩放
  const zoomCtrl = new TScaleControl() // 添加缩放控件
  const navigationCtrl = new TNavigationControl()

  map.value?.addControl(zoomCtrl)
  map.value?.addControl(navigationCtrl)
}

const addOverlay = (longitude, latitude) => {
  const marker = new TMarker(new TLngLat(longitude, latitude))
  map.value.addOverLay(marker)
}

const clearOverlay = () => {
  map.value.clearOverLays()
}

const getAddress = (point: PointType, callback: (d: string) => void) => {
  // 创建地理编码实例
  const myGeo = new TGeocoder()
  // 根据坐标得到地址描述
  myGeo.getLocation(new TLngLat(point.longitude, point.latitude), function (result) {
    if (result && result.getStatus() == 0) {
      callback && callback(result.getAddress())
    }
  })
}

const mapClick = () => {
  TEvent.addListener(map.value, 'click', function (p) {
    //将像素坐标转换成经纬度坐标
    const lnglat = map.value.fromContainerPixelToLngLat(p)
    const lng = lnglat.getLng()
    const lat = lnglat.getLat()
    console.log(lng, lat, '经纬度')
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
      console.log(address, 'address')
      emit('chose', point)
    })
  })
}
const addMapClick = () => {
  //移除地图的点击事件
  removeMapClick()
  //注册地图的点击事件
  mapClick()
}

const removeMapClick = () => {
  //移除地图的点击事件
  TEvent.removeListener(mapClick)
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  font-family: '微软雅黑';
}
</style>
