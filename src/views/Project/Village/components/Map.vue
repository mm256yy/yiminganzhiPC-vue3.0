<template>
  <div class="w-540px h-400px relative">
    <div class="absolute top-6px left-60px z-500">
      <ElInput v-model="keyword" class="!w-300px mr-6px" :prefix-icon="searchIcon" />
      <ElButton @click="search">搜索</ElButton>
      <div v-if="searchList && searchList.length" class="bg-white p-10px mt-6px">
        <div
          v-for="item in searchList"
          :key="item.hotPointID"
          class="search-item"
          @click="selectSearchItem(item)"
        >
          <Icon icon="material-symbols:location-on-outline" />
          {{ item.name }}
        </div>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElInput, ElButton } from 'element-plus'
import { debounce, throttle } from 'lodash-es'
import { useIcon } from '@/hooks/web/useIcon'
import { nextTick } from 'process'

interface PointType {
  longitude: number
  latitude: number
  address?: string
}

type SearchItemType = {
  name: string
  lonlat: string
  hotPointID: string
} & PointType

interface Props {
  point: PointType
}
const props = defineProps<Props>()
const emit = defineEmits(['chose'])

const searchIcon = useIcon({ icon: 'ic:outline-search' })
const keyword = ref('')
const searchList = ref<Array<SearchItemType>>([])

let map: any = null
let localsearch: any = null
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
  // 监听事件
  addMapClick()
  // 解决地图渲染不全的问题
  setTimeout(() => {
    map.checkResize()
  }, 300)
  initSearch()
}

watch(
  () => props.point,
  (val) => {
    // 添加标记
    nextTick(() => {
      if (val.longitude && val.latitude) {
        clearOverlay()
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

const mapClick = throttle((e) => {
  //将像素坐标转换成经纬度坐标
  const lng = e.lnglat.getLng()
  const lat = e.lnglat.getLat()
  clearOverlay()
  // 添加标记
  addOverlay(lng, lat)
  const point: PointType = {
    longitude: lng,
    latitude: lat
  }
  // 拿到地址
  getAddress(point, (address: string) => {
    point.address = address
    emit('chose', point)
  })
}, 200)

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

const localSearchResult = (res) => {
  if (res) {
    const { pois } = res
    searchList.value = pois.map((item: SearchItemType) => {
      const [longitude, latitude] = item.lonlat.split(' ')
      return {
        name: item.name,
        longitude,
        latitude,
        address: item.address,
        hotPointID: item.hotPointID
      }
    })
  } else {
    searchList.value = []
  }
}

const initSearch = () => {
  const config = {
    pageCapacity: 10, //每页显示的数量
    onSearchComplete: localSearchResult //接收数据的回调函数
  }
  localsearch = new T.LocalSearch(map, config)
}

const search = debounce(() => {
  //创建搜索对象
  if (!keyword.value) return
  localsearch.search(keyword.value, 1)
}, 200)

const selectSearchItem = (item: SearchItemType) => {
  // 清除搜索结果
  searchList.value = []
  keyword.value = ''
  // 添加标记
  clearOverlay()
  // 添加标记
  addOverlay(item.longitude, item.latitude)
  // 定位到位置
  map.centerAndZoom(new T.LngLat(item.longitude, item.latitude), 15)
  map.checkResize()

  // 拿到地址
  const point: PointType = {
    longitude: item.longitude,
    latitude: item.latitude
  }
  getAddress(point, (address: string) => {
    point.address = address
    emit('chose', point)
  })
}
</script>
<style scoped lang="less">
.search-item {
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 30px;
  cursor: pointer;

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
