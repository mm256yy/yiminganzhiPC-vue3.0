<template>
  <div class="area-detail-wrap">
    <div class="area-box">
      <div class="tab-cont-item">
        <div class="common-head"> A地块基本信息 </div>

        <div class="base-info">
          <div class="base-column">
            <div class="info-item">
              <div class="label">小区名称：</div>
              <div class="value">太阳小区</div>
            </div>
            <div class="info-item">
              <div class="label">结构类型：</div>
              <div class="value">钢架</div>
            </div>
            <div class="info-item">
              <div class="label">用地面积(㎡)：</div>
              <div class="value">20,020</div>
            </div>
            <div class="info-item">
              <div class="label">地理位置：</div>
              <div class="value">浙江省龙游县石乡大力山村白岩25号</div>
            </div>
          </div>

          <div class="base-column">
            <div class="info-item">
              <div class="label">绿化率：</div>
              <div class="value">25%</div>
            </div>
            <div class="info-item">
              <div class="label">建筑密度：</div>
              <div class="value">12%</div>
            </div>
            <div class="info-item">
              <div class="label">建筑面积(㎡)：</div>
              <div class="value">13,500</div>
            </div>
          </div>
        </div>

        <div class="common-head"> 周边配套 </div>

        <div class="periphery">
          <div class="periphery-item">
            <div class="label">交通：</div>
            <div class="value">直接连接市区和机场1号线，7号线</div>
          </div>

          <div class="periphery-item">
            <div class="label">商业：</div>
            <div class="value">位于市区，各种商业配套齐全</div>
          </div>

          <div class="periphery-item">
            <div class="label">教育：</div>
            <div class="value">周边有幼儿园、小学、初中、高中，教育配套齐全</div>
          </div>

          <div class="periphery-item">
            <div class="label">医院：</div>
            <div class="value">镇中心医院</div>
          </div>
        </div>

        <div class="common-head"> 地图 </div>

        <div class="map-cont">
          <div class="map" id="map"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const map = ref<any>(null)
const AMap = ref<any>(null)
const longitude = 120.148775
const latitude = 30.245799

const init = async () => {
  AMap.value = await AMapLoader.load({
    key: import.meta.env.VITE_MAP_AK, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15

    // plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.Geolocation'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.Geocoder']
  })

  map.value = new AMap.value.Map('map', {
    //设置地图容器id
    zoom: 13, //初始化地图层级
    viewMode: '3D', //是否为3D地图模式
    //初始化地图中心点位置

    center: [longitude, latitude],
    dragEnable: true, //禁止鼠标拖拽
    scrollWheel: true, //鼠标滚轮放大缩小
    doubleClickZoom: true, //双击放大缩小
    keyboardEnable: true //键盘控制放大缩小移动旋转
  })
  map.value.setDefaultCursor('pointer')
}

onMounted(() => {
  init()
})
</script>

<style lang="less" scoped>
.area-detail-wrap {
  width: 900px;
  background: #ffffff;
  border-radius: 4px;

  .desc-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 0 24px;
    border-bottom: 1px solid #f0f0f0;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #171718;
    }

    .close {
      width: 20px;
      height: 20px;
    }
  }

  .base-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 30px;

    .base-column {
      flex: 50%;

      .info-item {
        display: flex;
        align-items: center;
        height: 20px;
        margin-bottom: 10px;

        .label {
          width: 100px;
          font-size: 14px;
          color: #171718;
        }

        .value {
          flex: 1;
          font-size: 14px;
          color: #171718;
        }
      }
    }
  }

  .periphery {
    padding: 0 30px;

    .periphery-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 20px;
      margin-bottom: 10px;

      .label {
        flex: none;
        width: 42px;
        font-size: 14px;
        color: #171718;
      }

      .value {
        flex: 1;
        font-size: 14px;
        color: #171718;
      }
    }
  }

  .map-cont {
    position: relative;
    width: 840px;
    height: 190px;
    margin: 0 auto;
    overflow: hidden;
    background-color: #f8f8f8;
    border-radius: 12px;

    .map {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}

.common-head {
  display: flex;
  width: 100%;
  height: 48px;
  padding: 0 30px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #171718;
  background: #ffffff;
  flex-direction: row;
  align-items: center;
}
</style>
