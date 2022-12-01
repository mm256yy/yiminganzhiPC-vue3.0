<template>
  <div class="w-540px h-400px">
    <div id="map"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

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

let map: any = null
// 默认杭州市区
const longitude = 120.17418
const latitude = 30.26961

const init = () => {
  const lng = props.point.longitude || longitude
  const lat = props.point.latitude || latitude
  map = new T.Map('map')
  map.centerAndZoom(new T.LngLat(lng, lat), 12) // 初始化地图,设置中心点坐标和地图级别
  map.enableScrollWheelZoom()
  // 添加控件
  addControl()
  // 添加标记
  if (props.point.longitude && props.point.latitude) {
    addOverlay(lng, lat)
  }
  // 监听事件
  addMapClick()
  // 解决地图渲染不全的问题
  setTimeout(() => {
    map.checkResize()
  }, 300)
}

onMounted(() => {
  init()
})

const addControl = () => {
  // 缩放
  const zoomCtrl = new T.Control.Zoom() // 添加缩放控件
  const scaleCtrl = new T.Control.Scale()

  map.addControl(zoomCtrl)
  map.addControl(scaleCtrl)
}

const addOverlay = (longitude, latitude) => {
  const marker = new T.Marker(new T.LngLat(longitude, latitude))
  map.addOverLay(marker)
}

const clearOverlay = () => {
  map.clearOverLays()
}

const getAddress = (point: PointType, callback: (d: string) => void) => {
  // 创建地理编码实例
  const myGeo = new T.Geocoder()
  // 根据坐标得到地址描述
  myGeo.getLocation(new T.LngLat(point.longitude, point.latitude), function (result) {
    if (result && result.getStatus() == 0) {
      callback && callback(result.getAddress())
    }
  })
}

const addListener = () => {
  map.addEventListener('click', mapClick)
}

const mapClick = (e) => {
  //将像素坐标转换成经纬度坐标
  const lng = e.lnglat.getLng()
  const lat = e.lnglat.getLat()
  // console.log(lng, lat, '经纬度')
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
    // console.log(address, 'address')
    emit('chose', point)
  })
}
const addMapClick = () => {
  //移除地图的点击事件
  removeMapClick()
  //注册地图的点击事件
  addListener()
}

const removeMapClick = () => {
  //移除地图的点击事件
  map.removeEventListener('click', mapClick)
}
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
.tdt-control-copyright {
  display: none !important;
}
</style>
