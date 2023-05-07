<template>
  <div class="map-wrapper">
    <div id="container" class="map"></div>
    <div class="info-wrapper" v-if="show && dataInfo.type === 'PeasantHousehold'">
      <div class="name-wrapper">
        <img class="icon" :src="dataInfo.iconPath" />
        <div class="name">{{ dataInfo.name }}</div>
        <img class="close" src="@/assets/imgs/icon_close.png" @click="close" />
      </div>
      <div class="row">
        <div class="dot"></div>
        <div class="label">户号：</div>
        <div class="content door-no">{{ dataInfo.doorNo }}</div>
      </div>
      <div class="row">
        <div class="dot"></div>
        <div class="label">身份证号：</div>
        <div class="content">{{ dataInfo.card }}</div>
      </div>
      <div class="row">
        <div class="dot"></div>
        <div class="label">家庭总人数：</div>
        <div class="content">
          <span class="num">{{ dataInfo.demographicNumber }}</span> 人
        </div>
      </div>
      <div class="row">
        <div class="dot"></div>
        <div class="label">房屋总数：</div>
        <div class="content">
          <span class="num">{{ dataInfo.houseNumber }}</span> 幢
        </div>
      </div>
      <div class="row">
        <div class="dot"></div>
        <div class="label">户籍所在地：</div>
        <div class="content">{{ dataInfo.address }}</div>
      </div>
    </div>
    <div class="info-wrapper village" v-if="show && dataInfo.type === 'Village'">
      <div class="name-wrapper">
        <img class="icon" :src="dataInfo.iconPath" />
        <div class="name">{{ dataInfo.name }}</div>
        <img class="close" src="@/assets/imgs/icon_close.png" @click="close" />
      </div>
      <div class="row">
        <div class="dot"></div>
        <div class="label">区县：</div>
        <div class="content">{{ dataInfo.areaCodeText }}</div>
      </div>
      <div class="row">
        <div class="dot"></div>
        <div class="label">街道：</div>
        <div class="content">{{ dataInfo.townCodeText }}</div>
      </div>
      <div class="row">
        <div class="dot"></div>
        <div class="label">行政村：</div>
        <div class="content">{{ dataInfo.villageCodeText }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import AMapLoader from '@amap/amap-jsapi-loader'
import { splitStr, hideStr } from '@/utils'
import { getLandlordListApi } from '@/api/workshop/landlord/service'
import { getVillageListApi } from '@/api/workshop/village/service'
import iconPath from './iconPath'

const appStore = useAppStore()
const projectId = appStore.currentProjectId

// 初始化聚合点坐标
const initCoordinatesData = (obj: any) => {
  let arr: any = []
  obj?.features.map((item: any) => {
    arr.push(...item.geometry?.coordinates[0][0])
  })
  return arr
}

const mapJson: any = appStore.currentMapJson ? JSON.parse(appStore.currentMapJson) : null
const points = mapJson ? initCoordinatesData(mapJson) : []
const pointsLength = points.length

interface LocationType {
  longitude: number
  latitude: number
}

// 初始地图坐标, 如果没有该区域的中心经、纬度，默认杭州经、纬度显示
const centerLocation = ref<LocationType>({
  longitude: pointsLength ? points[pointsLength / 2][0] : 120.153576, // 经度
  latitude: pointsLength ? points[pointsLength / 2][1] : 30.287459 // 纬度
})

let AMap: any = null
let map: any = null
const householdList = ref<any>([]) // 居民户列表
const householdMarkersList = ref<any>([]) // 居民户标记点列表
const villageList = ref<any>([]) // 自然村列表
const villageMarkersList = ref<any>([]) // 自然村标记点列表
const markersList = ref<any>([]) // 标记点集合
const dataInfo = ref<any>({}) // 单个标记点信息
const show = ref<boolean>(false) // 是否显示标记点信息弹窗

// 初始化地图
const initMap = async () => {
  AMap = await AMapLoader.load({
    key: import.meta.env.VITE_MAP_AK, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    // plugins: ['AMap.AutoComplete', 'AMap.MarkerCluster', 'AMap.Geolocation'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    plugins: ['AMap.AutoComplete', 'AMap.MarkerCluster', 'AMap.MapType']
  })

  const { longitude, latitude } = centerLocation.value

  let position = new AMap.LngLat(longitude, latitude)

  // 设置地图容器id
  map = new AMap.Map('container', {
    zoom: 15, // 初始化地图层级
    viewMode: '3D', // 是否为3D地图模式
    center: position, // 初始化地图中心点位置 [经度, 纬度]
    layers: [
      // 卫星
      new AMap.TileLayer.Satellite(),
      // 路网
      new AMap.TileLayer.RoadNet()
    ],
    resizeEnable: true
  })
  map.setDefaultCursor('pointer')
}

// 初始化获取居民户相关信息
const initHouseholdData = async () => {
  const res: any = await getLandlordListApi({
    type: 'PeasantHousehold',
    projectId,
    size: 99999,
    needCoordinates: true
  })

  if (res && res.content && res.content.length) {
    let arr: any = []
    let markerArr: any = []
    res.content.map((item: any) => {
      if (item.longitude && item.latitude) {
        markerArr.push({
          id: item.uid,
          lnglat: [item.longitude, item.latitude],
          name: item.name,
          type: 'PeasantHousehold'
        })
        arr.push({
          id: item.id,
          uid: item.uid,
          name: item.name,
          doorNo: item.doorNo,
          card: item.card,
          address: item.address,
          longitude: item.longitude,
          latitude: item.latitude,
          demographicNumber: item.demographicNumber,
          houseNumber: item.houseNumber,
          type: 'PeasantHousehold'
        })
      }
    })
    householdMarkersList.value = markerArr
    householdList.value = arr
  }
}

// 初始化获取自然村相关信息
const initVillageData = async () => {
  const res: any = await getVillageListApi({ projectId, size: 99999 })
  if (res && res.content && res.content.length) {
    let arr: any = []
    let markerArr: any = []
    res.content.map((item: any) => {
      if (item.longitude && item.latitude && item.districtName) {
        markerArr.push({
          id: item.uid,
          lnglat: [item.longitude, item.latitude],
          name: item.name,
          type: 'Village'
        })
        arr.push({
          id: item.id,
          uid: item.uid,
          name: item.name,
          longitude: item.longitude,
          latitude: item.latitude,
          areaCodeText: splitStr(item.districtName, '/')
            ? splitStr(item.districtName, '/')[2]
            : '-',
          townCodeText: splitStr(item.districtName, '/')
            ? splitStr(item.districtName, '/')[3]
            : '-',
          villageCodeText: splitStr(item.districtName, '/')
            ? splitStr(item.districtName, '/')[4]
            : '-',
          type: 'Village'
        })
      }
    })
    villageMarkersList.value = markerArr
    villageList.value = arr
  }
}

// 初始化标记点
const initMarker = async () => {
  await initHouseholdData()
  await initVillageData()

  markersList.value = [...villageMarkersList.value, ...householdMarkersList.value]
  const gridSize = 60
  let count = markersList.value.length

  // 自定义聚合点样式
  let _renderClusterMarker = function (context) {
    let factor = Math.pow(context.count / count, 1 / 18)
    let div = document.createElement('div')
    let Hue = 180 - factor * 180
    let bgColor = 'hsla(' + Hue + ',100%,40%,0.7)'
    let fontColor = 'hsla(' + Hue + ',100%,90%,1)'
    let borderColor = 'hsla(' + Hue + ',100%,40%,1)'
    let shadowColor = 'hsla(' + Hue + ',100%,90%,1)'
    div.style.backgroundColor = bgColor
    let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
    div.style.width = div.style.height = size + 'px'
    div.style.border = 'solid 1px ' + borderColor
    div.style.borderRadius = size / 2 + 'px'
    div.style.boxShadow = '0 0 5px ' + shadowColor
    div.innerHTML = context.count
    div.style.lineHeight = size + 'px'
    div.style.color = fontColor
    div.style.fontSize = '14px'
    div.style.textAlign = 'center'
    context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
    context.marker.setContent(div)
  }

  // 自定义非聚合点样式，点标记显示内容，HTML要素字符串
  let _renderMarker = function (context) {
    if (context && context.data && context.data.length) {
      context.data.forEach((item: any) => {
        let iconUrl: any =
          item.type === 'PeasantHousehold' ? iconPath.userIconPath : iconPath.villageIconPath

        let content = `
          <div class="custom-content-marker">
            <img class="icon" src="${iconUrl}" />
            <div
              class='info' 
              style="width: ${(item.name.length > 8 ? 8 : item.name.length) * 12}px"
            >
              ${hideStr(item.name, 8)}
            </div>
          </div>
        `
        let offset = new AMap.Pixel(-9, -9)
        context.marker.setContent(content)
        context.marker.setOffset(offset)

        // 设置点击标记点事件
        context.marker.on('click', handlerClickMarker)
      })
    }
  }

  let marker = new AMap.MarkerCluster(map, markersList.value, {
    gridSize: gridSize,
    renderClusterMarker: _renderClusterMarker, // 自定义聚合点样式
    renderMarker: _renderMarker // 自定义非聚合点样式
  })

  marker.on('click', (item) => {
    // 此处是通过包含点的数量判断是否是聚合点，不是聚合点就执行上方单个点的点击方式
    if (item.clusterData.length <= 1) {
      return
    }
    // 这里是计算所有聚合点的中心点
    let alllng = 0,
      alllat = 0
    for (const mo of item.clusterData) {
      alllng += mo.lnglat.lng
      alllat += mo.lnglat.lat
    }
    const lat = alllat / item.clusterData.length
    const lng = alllng / item.clusterData.length
    // 这里是放大地图，此处写死了每次点击放大的级别，可以根据点的数量和当前大小适应放大，体验更佳
    map.setZoomAndCenter(map.getZoom() + 4, [lng, lat])
  })

  // 将 markers 添加到地图
  map.add(marker)
}

// 初始化多边形轮廓
const initPolygon = async () => {
  // 配置多边形
  let polygon = new AMap.Polygon({
    path: points, // 路径
    strokeColor: '#ff0000', // 轮廓线颜色
    strokeWeight: 2, // 轮廓线宽度
    strokeOpacity: 1, // 轮廓线透明度
    fillOpacity: 0.2, // 矩形内部填充颜色透明度
    fillColor: 'transparent', // 矩形 内部填充颜色透明度
    zIndex: 50 // 多边形覆盖物的叠加顺序。地图上存在多个多边形覆盖物叠加时，通过该属性使级别较高的多边形覆盖物在上层显示
  })
  map.add(polygon)
}

/**
 * 点击标记点
 * @param{Object} e
 */
const handlerClickMarker = (e: any) => {
  const [lng, lat] = e.target._position
  let arr: any = [...householdList.value, ...villageList.value]
  if (arr && arr.length) {
    arr.map((item: any) => {
      if (Number(item.longitude) === Number(lng) && Number(item.latitude) == Number(lat)) {
        if (item.type === 'PeasantHousehold') {
          dataInfo.value = {
            iconPath: iconPath.userIconPath,
            name: item.name,
            doorNo: item.doorNo,
            card: item.card,
            address: item.address,
            demographicNumber: item.demographicNumber,
            houseNumber: item.houseNumber,
            type: item.type
          }
          return
        } else if (item.type === 'Village') {
          dataInfo.value = {
            iconPath: iconPath.villageIconPath,
            name: item.name,
            areaCodeText: item.areaCodeText,
            townCodeText: item.townCodeText,
            villageCodeText: item.villageCodeText,
            type: item.type
          }
          return
        }
      }
    })
    show.value = true
  }
}

// 关闭信息框
const close = () => {
  show.value = false
  dataInfo.value = {}
}

onMounted(async () => {
  await initMap()
  await initPolygon()
  await initMarker()
})
</script>

<style>
.map-wrapper {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.map {
  width: 100%;
  height: calc(100vh - 64px) !important;
}

.custom-content-marker {
  display: flex;
  height: 26px;
  padding: 0 4px;
  background-color: rgba(23, 23, 24, 0.6);
  border: 2px solid transparent;
  border-radius: 13px;
  align-items: center;
}

.custom-content-marker:active {
  border: 2px solid #0f83ff;
}

.custom-content-marker .icon {
  width: 17px;
  height: 17px;
}

.custom-content-marker .info {
  margin-left: 3px;
  font-size: 12px;
  color: #fff;
}

.info-wrapper {
  position: absolute;
  top: 145px;
  right: 101px;
  z-index: 1;
  width: 344px;
  padding-bottom: 15px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
}

.info-wrapper.village {
  top: 115px;
  right: 280px;
  width: 235px;
}

.info-wrapper .name-wrapper {
  display: flex;
  padding: 10px 0 10px 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  justify-content: space-between;
}

.info-wrapper .name-wrapper .icon {
  width: 28px;
  height: 28px;
  margin-right: 6px;
}

.info-wrapper .name-wrapper .name {
  width: calc(100% - 74px);
  margin-top: 3px;
  font-size: 16px;
  font-weight: bold;
  color: #171718;
}

.info-wrapper .name-wrapper .close {
  width: 14px;
  height: 14px;
  margin: 8px 12px 0 0;
  cursor: pointer;
}

.info-wrapper .row {
  display: flex;
  padding: 0 24px;
  margin-top: 10px;
  box-sizing: border-box;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
}

.info-wrapper .row .dot {
  width: 8px;
  height: 8px;
  margin-right: 6px;
  background: #ff862f;
  border-radius: 4px;
}

.info-wrapper .row .label {
  font-size: 14px;
  color: #131313;
}

.info-wrapper .row .content {
  display: flex;
  font-size: 14px;
  font-weight: bold;
  color: #131313;
  text-align: justify;
  word-break: break-all;
  flex-wrap: wrap;
}

.info-wrapper .row .content.door-no {
  color: #3e73ec;
}

.info-wrapper .row .content .num {
  margin-right: 3px;
  color: #3e73ec;
}

/* 去掉高德地图logo、版本号、去掉地图的图层切换控制 */
.amap-logo,
.amap-copyright,
.amap-maptypecontrol {
  opacity: 0;
}
</style>
