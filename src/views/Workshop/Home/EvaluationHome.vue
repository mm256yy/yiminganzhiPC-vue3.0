<template>
  <div class="box-wrapper">
    <!-- 具体内容 -->
    <div class="main-enter">
      <!--居民区-->
      <div class="enter-item">
        <div class="title-area">
          <div class="item-title">居民区</div>
          <div class="item-number">{{ statisticsObj?.peasantCount }}户</div>
        </div>
        <div class="item-status">
          <div class="status-special">
            <div class="special-number success">{{ statisticsObj?.peasantCompleteCount }}</div>
            <div class="special-status">已评估</div>
          </div>
          <div class="status-special">
            <div class="special-number error">{{ statisticsObj?.peasantUncompletedCount }}</div>
            <div class="special-status">未评估</div>
          </div>
          <div class="status-special">
            <div class="special-number">{{ statisticsObj?.peasantMyCompleteCount }}</div>
            <div class="special-status">我的评估</div>
          </div>
        </div>
      </div>
      <!--企业-->
      <div class="enter-item">
        <div class="title-area">
          <div class="item-title">企业</div>
          <div class="item-number">{{ statisticsObj?.companyCount }}户</div>
        </div>
        <div class="item-status">
          <div class="status-special">
            <div class="special-number success">{{ statisticsObj?.companyCompleteCount }}</div>
            <div class="special-status">已评估</div>
          </div>
          <div class="status-special">
            <div class="special-number error">{{ statisticsObj?.companyUncompletedCount }}</div>
            <div class="special-status">未评估</div>
          </div>
          <div class="status-special">
            <div class="special-number">{{ statisticsObj?.companyMyCompleteCount }}</div>
            <div class="special-status">我的评估</div>
          </div>
        </div>
      </div>
      <!--个体户-->
      <div class="enter-item">
        <div class="title-area">
          <div class="item-title">个体户</div>
          <div class="item-number">{{ statisticsObj?.individualCount }}户</div>
        </div>
        <div class="item-status">
          <div class="status-special">
            <div class="special-number success">{{ statisticsObj?.individualCompleteCount }}</div>
            <div class="special-status">已评估</div>
          </div>
          <div class="status-special error">
            <div class="special-number">{{ statisticsObj?.individualUncompletedCount }}</div>
            <div class="special-status">未评估</div>
          </div>
          <div class="status-special">
            <div class="special-number">{{ statisticsObj?.individualMyCompleteCount }}</div>
            <div class="special-status">我的评估</div>
          </div>
        </div>
      </div>
      <!--村集体-->
      <div class="enter-item">
        <div class="title-area">
          <div class="item-title">村集体</div>
          <div class="item-number">{{ statisticsObj?.villageCount }}户</div>
        </div>
        <div class="item-status">
          <div class="status-special">
            <div class="special-number success">{{ statisticsObj?.villageCompleteCount }}</div>
            <div class="special-status">已评估</div>
          </div>
          <div class="status-special">
            <div class="special-number error">{{ statisticsObj?.villageUncompletedCount }}</div>
            <div class="special-status">未评估</div>
          </div>
          <div class="status-special">
            <div class="special-number">{{ statisticsObj?.villageMyCompleteCount }}</div>
            <div class="special-status">我的评估</div>
          </div>
        </div>
      </div>
    </div>

    <div class="group">
      <div class="work">
        <Echart />
      </div>
      <div class="message">
        <GroupNotice />
      </div>
    </div>
    <footer>
      <span> Copyright ©2015 zdwp All Rights Reserved. &nbsp;&nbsp;</span>
      <span> 浙ICP备10000403号-1.;</span>
      <img class="icon-emblem" :src="iconNationalEmblemSrc" alt="国徽图标" />
      <span> 浙公网安备 33010202000111号 </span>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Echart from './components/GroupChart.vue'
import GroupNotice from './components/GroupNotice.vue'
import iconNationalEmblemSrc from '@/assets/imgs/home/icon_national_emblem.png'
import type { EvaluatorStatisticsDtoType } from '@/api/home-types'
import { getEvaluatorStatistics } from '@/api/home-service'

const statisticsObj = ref<EvaluatorStatisticsDtoType>()

// 统计
const getStatistics = async () => {
  try {
    const result = await getEvaluatorStatistics()
    statisticsObj.value = result
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getStatistics()
})
</script>

<style lang="less" scoped>
.box-wrapper {
  display: flex;
  padding-top: 40px;
  margin: -30px -20px;
  background-image: url('../../../assets/imgs/home/home_bg.png');
  background-size: 100% auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .main-enter {
    display: flex;
    width: 1440px;
    padding: 12px;
    justify-content: center;

    .enter-item {
      display: flex;
      height: 140px;
      padding: 20px;
      margin-right: 20px;
      background: #f2f2f2;
      border-radius: 10px;
      flex: 1;

      .title-area {
        width: 66px;
        margin-top: 20px;
        margin-right: 10px;
        font-weight: bold;
        color: #333333;

        .item-title {
          font-size: 20px;
        }

        .item-number {
          margin-top: 4px;
          font-size: 16px;
        }
      }

      .item-status {
        display: flex;
        align-items: center;
        // margin-left: 10px;

        .status-special {
          display: flex;
          margin-right: 20px;
          font-size: 16px;
          font-weight: bold;
          flex-direction: column;
          align-items: center;

          .special-number {
            height: 30px;
            line-height: 30px;
            color: #333333;

            &.success {
              color: #30a952;
            }

            &.error {
              color: #e43030;
            }
          }

          .special-status {
            color: #333333;
            // width: 40px;
          }
        }
      }

      .top {
        display: flex;
        flex-direction: column;
      }

      &:last-child {
        margin-right: 0px;
      }
    }
  }

  .group {
    display: flex;

    .work {
      width: 710px;
      padding-top: 20px;
    }

    .message {
      width: 710px;
      margin-left: 10px;
    }
  }

  .other-enter {
    display: flex;
    justify-content: center;
    width: 750px;
    margin-top: 26px;

    &.self {
      // display: none;
      margin-top: 10px;
    }
  }

  .flex {
    display: flex;
  }

  footer {
    display: flex;
    height: 44px;
    font-size: 14px;
    font-weight: 400;
    line-height: 44px;
    color: rgba(19, 19, 19, 0.4);

    .icon-emblem {
      width: 20px;
      height: 20px;
      margin: 10px 10px 0 10px;
    }
  }
}
</style>
