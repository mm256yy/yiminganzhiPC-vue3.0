<template>
  <div class="area-detail-wrap">
    <!-- <div class="desc-header">
      <div class="title">安置点详情</div>
      <image
        class="close"
        @click="close"
        src="@/static/images/resettle_close.png"
        mode="scaleToFill"
      />
    </div> -->

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
          <div class="map"></div>
          <!-- <map class="map" longitude="120.17327222279103" latitude="30.235643678475068"></map> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
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

  // .area-box {
  // }

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
    padding: 0 30px;
    border-radius: 12px;

    .map {
      height: 190px;
      background-color: #f8f8f8;
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
