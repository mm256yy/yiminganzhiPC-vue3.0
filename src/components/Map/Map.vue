<template>
  <div
    class="w-full h-400px relative"
    :style="{ width: props.w ? `${props.w}px` : '100%', height: `${props.h}px` }"
  >
    <div class="absolute top-6px left-100px z-500">
      <!-- <ElInput v-model="keyword" class="!w-[70%] mr-6px" :prefix-icon="searchIcon" id="keyword" /> -->
    </div>
    <div id="map"></div>
    <div
      @click="llqgetLocation"
      class="absolute left-150px z-500"
      style="
        bottom: 10px;
        left: 302px;
        padding: 3px;
        cursor: pointer;
        background-color: white;
        border-radius: 100%;
      "
    >
      <img src="@/assets/imgs/locate.png" alt="" style="height: 32px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
// import { ElInput } from 'element-plus'
// import { debounce, throttle } from 'lodash-es'
// import { useIcon } from '@/hooks/web/useIcon'
import AMapLoader from '@amap/amap-jsapi-loader'
interface PointType {
  longitude: number
  latitude: number
  address?: string
}

// type SearchItemType = {
//   name: string
//   lonlat: string
//   hotPointID: string
// } & PointType

interface Props {
  point: PointType
  w?: number
  h: number
}
const props = defineProps<Props>()
const emit = defineEmits(['chose'])

// const searchIcon = useIcon({ icon: 'ic:outline-search' })
const keyword = ref()
// const searchList = ref<Array<SearchItemType>>([])

let map: any = null
let AMap: any = null
let geocoder: any = null
// let localsearch: any = null
// 默认杭州市区
let longitude = 120.17418
let latitude = 30.26961
const clearOverlay = () => {
  if (map) map.clearMap()
}
console.log(window, 'ddddddddddddddddddd')

const init = async (type) => {
  let lng
  let lat
  if (type == 'props' && props.point.longitude && props.point.latitude) {
    lng = props.point.longitude
    lat = props.point.latitude
  } else {
    lng = longitude
    lat = latitude
  }

  AMap = await AMapLoader.load({
    key: 'c4d29cb422ae2bda245486bf7953b85d', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15

    plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.Geolocation'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })

  map = new AMap.Map('map', {
    //设置地图容器id
    zoom: 5, //初始化地图层级
    viewMode: '3D', //是否为3D地图模式
    //初始化地图中心点位置
    center: [lng, lat],
    dragEnable: true, //禁止鼠标拖拽
    scrollWheel: true, //鼠标滚轮放大缩小
    doubleClickZoom: true, //双击放大缩小
    keyboardEnable: true //键盘控制放大缩小移动旋转
  })
  map.setDefaultCursor('pointer')
  map.addControl(new AMap.Geolocation())
  // map.add(
  //   new AMap.Marker({
  //     position: map.getCenter()
  //   })
  // )
  const autoOptions = {
    input: 'keyword' // 使用联想输入的input的id
  }
  const location = new AMap.Geolocation({
    enableHighAccuracy: true,
    // 设置定位超时时间，默认：无穷大
    timeout: 10000,
    // 定位按钮的停靠位置的偏移量
    offset: [10, 20],
    //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    zoomToAccuracy: true,
    //  定位按钮的排放位置,  RB表示右下
    position: 'RB'
  })

  // AMap.Event.addListener(location, 'keyup', function (e) {})

  location.getCurrentPosition(function (status, result) {
    console.log(status, result, 'status, result')
    if (status == 'complete') {
      console.log(result, '高德地图调用了')

      addOverlay(result.position.lng, result.position.lat)
      // result.position.KT
      // result.position.KL
      // onComplete(result)
    } else {
      console.log(status, result, '高德地图调用失败')
      // onError(result)
      llqgetLocation()
    }
  })

  const autoComplete = new AMap.AutoComplete(autoOptions)
  // 根据关键字进行搜索
  const placeSearch = new AMap.PlaceSearch({
    map: map
  })
  geocoder = new AMap.Geocoder({
    radius: 1000,
    extensions: 'all'
  })
  console.log(AMap, 'AMap.EventAMap.Event')
  AMap.Event.addListener(autoComplete, 'select', function (e) {
    console.log(e, 13256)
    placeSearch.setCity(e.poi.adcode)
    placeSearch.search(e.poi.name, function (status, result) {
      console.log(status)

      const pois = result.poiList.pois
      for (let i = 0; i < pois.length; i++) {
        if (pois[i].name === e.poi.name) {
          geocoder.getAddress(
            [pois[i].location.lng, pois[i].location.lat],
            function (status, result) {
              console.log(result)
              if (status === 'complete' && result.info === 'OK') {
                console.log(result.regeocode.formattedAddress)
              } else {
              }
            }
          )
          // GETAddress(pois[i].location.lng, pois[i].location.lat)
        }
      }
    })
  })

  addOverlay(lng, lat)
  autoComplete.search(keyword, function (status, result) {
    // 搜索成功时，result即是对应的匹配数据
    keyword.value = result.tips
    console.log(status, result, '搜索状态')
  })
  // setInterval(() => {
  //   llqgetLocation()
  // }, 1000)
  //   // map.add(marker); // 地图添加标记

  //   //为地图注册click事件获取鼠标点击出的经纬度坐标
  map.on('click', function (e) {
    console.log(e)

    addOverlay(e.lnglat.getLng(), e.lnglat.getLat())
  })
  // 浏览器自带定位
}
const GETAddress = (longitude, latitude) => {
  const point: PointType = {
    longitude: longitude,
    latitude: latitude
  }
  if (geocoder) {
    geocoder.getAddress([longitude, latitude], function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        console.log(point, 'point')
        point.address = result.regeocode.formattedAddress
        emit('chose', point)
      } else {
      }
    })
  }
}
// 实例化AutoComplete
const addOverlay = (longitude, latitude) => {
  GETAddress(longitude, latitude)
  clearOverlay()
  map.add(
    new AMap.Marker({
      position: [longitude, latitude]
    })
  )
}
// const init = () => {
//   const lng = props.point.longitude || longitude
//   const lat = props.point.latitude || latitude
//   map = new T.Map('map')
//   map.centerAndZoom(new T.LngLat(lng, lat), 12) // 初始化地图,设置中心点坐标和地图级别
//   map.enableScrollWheelZoom()
//   clearOverlay()
//   // 添加控件
//   addControl()
//   // 监听事件
//   addMapClick()
//   // 解决地图渲染不全的问题
//   setTimeout(() => {
//     resize()
//   }, 300)
//   initSearch()
// }

const resize = () => {
  // map.setZoom(12)
  init('props')
}
const llqgetLocation = () => {
  if (navigator.geolocation) navigator.geolocation.getCurrentPosition(showPosition, showError)
  else console.log('该浏览器无法获取IP')

  function showPosition(position: any) {
    // let point = {
    //   longitude: position.coords.longitude,
    //   latitude: position.coords.latitude
    // }

    // emit('chose', point)
    longitude = position.coords.longitude
    latitude = position.coords.latitude
    GETAddress(position.coords.longitude, position.coords.latitude)
    init('location')
    // addOverlay(position.coords.longitude, position.coords.latitude)
    console.log(
      position.coords.latitude,
      position.coords.longitude,

      '该浏览器定位成功'
    )
  }

  function showError(error: any) {
    console.log('H5错误编码  ' + error.code)
  }
}
watch(
  () => props.point,
  (val) => {
    console.log(val)

    nextTick(() => {
      clearOverlay()
      if (val.longitude && val.latitude) {
        addOverlay(val.longitude, val.latitude)
      }
    })
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  init('props')
})

defineExpose({
  init,
  resize
})
</script>
<style scoped lang="less">
.search-item {
  display: flex;
  height: 30px;
  overflow: hidden;
  cursor: pointer;
  align-items: center;

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
<style>
#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.tdt-control-copyright {
  display: none !important;
}
</style>
