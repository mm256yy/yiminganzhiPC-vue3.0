<template>
  <div class="statistic">
    <div class="inner">
      <div class="echart-title">
        <img src="@/assets/imgs/Icon_workteam.png" class="icon" />
        <div class="text">网格进度排行榜(居民户)</div>
      </div>
      <div class="tabs-status">
        <div
          v-for="item in tabStatus"
          :key="item.id"
          class="tabs-txt"
          :class="[item.id === statusTab ? 'active' : '']"
          @click="statusTabChange(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="bottom-wrapper">
        <div class="top5-tabs">
          <div
            v-for="item in tabs"
            :key="item.id"
            class="top5-tab-item"
            :class="[item.id === currentTab ? 'active' : '']"
            @click="tabChange(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="echart-wrap">
          <div class="echart-item" v-for="item in echartOptions" :key="item.index">
            <div class="echart-item-lt">
              <img class="top-img" :src="item.img" mode="scaleToFill" />
              <text class="user-name">{{ item.name }}</text>
            </div>

            <div class="echart-item-ct">
              <div class="progress" :style="{ width: `${item.progress}%` }"></div>
            </div>

            <div class="echart-item-rt">
              <text class="txt">{{ item.number }}户</text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import top5_1 from '@/assets/imgs/Rank_1.png'
import top5_2 from '@/assets/imgs/Rank_2.png'
import top5_3 from '@/assets/imgs/Rank_3.png'
import top5_4 from '@/assets/imgs/Rank_4.png'
import top5_5 from '@/assets/imgs/Rank_5.png'
import top5_6 from '@/assets/imgs/Rank_6.png'
import top5_7 from '@/assets/imgs/Rank_7.png'
import top5_8 from '@/assets/imgs/Rank_8.png'
import top5_9 from '@/assets/imgs/Rank_9.png'
import top5_10 from '@/assets/imgs/Rank_10.png'
import top5_11 from '@/assets/imgs/Rank_11.png'
import top5_12 from '@/assets/imgs/Rank_12.png'
import top5_13 from '@/assets/imgs/Rank_13.png'
import top5_14 from '@/assets/imgs/Rank_14.png'
import top5_15 from '@/assets/imgs/Rank_15.png'

interface OptionsType {
  name: string
  number: number
  index?: number
  progress?: number
  img?: string
}

interface TabType {
  id: number
  name: string
}

const currentTab = ref(0)
const statusTab = ref(0)

const tabStatus = ref([
  {
    id: 0,
    name: '动迁阶段'
  },
  {
    id: 1,
    name: '安置阶段'
  }
])

let tabs = ref<TabType[]>([])

const tabs1 = ref<TabType[]>([
  {
    name: '资格认定',
    id: 0
  },
  {
    name: '安置确认',
    id: 1
  },
  {
    name: '择址确认',
    id: 2
  },
  {
    name: '腾空过渡',
    id: 3
  },
  {
    name: '动迁协议',
    id: 4
  }
])

const tabs2 = ref<TabType[]>([
  {
    name: '拆迁安置',
    id: 0
  },
  {
    name: '生产安置',
    id: 1
  }
])

const echartOptions = ref<OptionsType[]>([])

const getStatisticData = () => {
  echartOptions.value = [
    {
      name: '陈汉林',
      number: 20,
      index: 0,
      progress: 100,
      img: top5_1
    },
    {
      name: '梁柏林',
      number: 18,
      index: 1,
      progress: 95,
      img: top5_2
    },
    {
      name: '董化杰',
      number: 15,
      index: 2,
      progress: 80,
      img: top5_3
    },
    {
      name: '潘永浩',
      number: 11,
      index: 3,
      progress: 60,
      img: top5_4
    },
    {
      name: '董羽坤',
      number: 10,
      index: 4,
      progress: 55,
      img: top5_5
    },
    {
      name: '董化杰',
      number: 15,
      index: 2,
      progress: 80,
      img: top5_6
    },
    {
      name: '潘永浩',
      number: 11,
      index: 3,
      progress: 60,
      img: top5_7
    },
    {
      name: '董羽坤',
      number: 10,
      index: 4,
      progress: 55,
      img: top5_8
    },
    {
      name: '董化杰',
      number: 15,
      index: 2,
      progress: 80,
      img: top5_9
    },
    {
      name: '潘永浩',
      number: 11,
      index: 3,
      progress: 60,
      img: top5_10
    },
    {
      name: '董羽坤',
      number: 10,
      index: 4,
      progress: 55,
      img: top5_11
    },
    {
      name: '董羽坤',
      number: 10,
      index: 4,
      progress: 55,
      img: top5_12
    },
    {
      name: '董羽坤',
      number: 10,
      index: 4,
      progress: 55,
      img: top5_13
    },
    {
      name: '董羽坤',
      number: 10,
      index: 4,
      progress: 55,
      img: top5_14
    },
    {
      name: '董羽坤',
      number: 10,
      index: 4,
      progress: 55,
      img: top5_15
    }
  ]
}

const tabChange = (id: number) => {
  if (currentTab.value === id) {
    return
  }
  currentTab.value = id
}

const statusTabChange = (id: number) => {
  statusTab.value = id
  tabs.value = statusTab.value === 0 ? tabs1.value : tabs2.value
}

onMounted(() => {
  getStatisticData()
  statusTabChange(0)
})
</script>

<style lang="less" scoped>
.statistic {
  margin-right: 11px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  border-radius: 9px;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.08);

  .inner {
    padding: 6px;
    background: linear-gradient(180deg, #deebf6 0%, #ffffff 100%);
    border-radius: 9px;
  }

  .echart-title {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 960px;
    height: 44px;
    padding: 0 6px;
    background: linear-gradient(135deg, #1a63ff 0%, rgba(255, 255, 255, 0) 100%);
    border-radius: 5px;

    .icon {
      width: 18px;
      height: 18px;
      margin-right: 10px;
    }

    .text {
      font-size: 20px;
      font-weight: 400;
      color: #ffffff;
    }
  }

  .tabs-status {
    display: flex;
    margin-top: 8px;
    margin-bottom: 4px;
    overflow: hidden;
    font-size: 16px;

    .tabs-txt {
      width: 120px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
      background-color: #ffffff;
      border: 1px solid #2f72fe;

      &.active {
        color: #ffffff;
        background-color: #2f72fe;
      }

      &:first-child {
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
      }

      &:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
  }

  .bottom-wrapper {
    margin-top: 8px;
    background: #ffffff;

    .top5-tabs {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 5px;
      margin-left: 15px;

      .top5-tab-item {
        display: flex;
        width: 88px;
        height: 32px;
        margin-right: 10px;
        font-size: 14px;
        line-height: 32px;
        color: #666666;
        cursor: pointer;
        background-color: #ffffff;
        border-radius: 4px;
        align-items: center;
        justify-content: center;

        &.active {
          color: #ffffff;
          background-color: #2f72fe;
        }
      }
    }

    .echart-wrap {
      display: flex;
      flex-direction: column;
      width: 930px;
      height: 546px;
      box-sizing: border-box;

      .echart-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 25px;
        margin-bottom: 9px;

        .echart-item-lt {
          display: flex;
          align-items: center;

          .top-img {
            width: 26px;
            height: 20px;
            margin-right: 5px;
            margin-left: 20px;
          }

          .user-name {
            overflow: hidden;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            text-overflow: ellipsis;
            word-break: keep-all;
          }
        }

        .echart-item-ct {
          display: flex;
          align-items: center;
          width: 719px;

          .progress {
            height: 10px;
            background: linear-gradient(90deg, rgba(255, 197, 61, 0.3) 0%, #faad14 100%);
            transform: skewX(-15deg);
            transform-origin: 0% 0%;
          }
        }

        .echart-item-rt {
          display: flex;
          align-items: center;
          margin-right: 40px;

          .txt {
            font-size: 14px;
            font-weight: 400;
            color: #333333;
          }
        }
      }
    }
  }
}
</style>
