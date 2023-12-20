<!--
 * @Author: baike
 * @LastEditors: 1019314017@qq.com 1019314017@qq.com
-->
<template>
  <div class="right_info">
    <div class="right_info_top">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/zj.png" alt="" />
        </template>
        <template #info>
          <view @click="handleClickItem(2)" class="right_slot">
            <view class="right_text">查看更多</view>
            <view>
              <img class="look_icon" src="../../../../assets/imgs/homes/icon.png" alt=""
            /></view>
          </view>
        </template>
      </Label>
      <div class="management">
        <div class="management_left">
          <div>
            <img class="left_logo" src="../../../../assets/imgs/homes/zj_icon.png" alt="" />
          </div>
          <div class="left_lable">概算资金(万元)</div>
          <div class="left_num">{{ fundScreenDto.gszj }}</div>
        </div>
        <div class="management_right">
          <img class="right_icon" src="../../../../assets/imgs/homes/Polygon_right.png" alt="" />
          <div class="management_r_top">
            <img class="icon_b" src="../../../../assets/imgs/homes/icon_b.png" alt="" />
            <div class="top_info">
              <div class="left_lable">累计使用（万元）</div>
              <div class="left_num">{{ fundScreenDto.ljsyzj }}</div>
            </div>
            <div class="round">
              <div class="round_top">占比</div>
              <div class="round_bom">{{ isNaN(computedProperty) ? 0 : computedProperty }}%</div>
            </div>
          </div>
          <div class="management_r_bom">
            <div class="bom_box_l">
              <div class="top_text">概算内(万元)</div>
              <div class="bom_text">{{ fundScreenDto.gsnzj }}</div>
            </div>
            <div class="bom_box_l">
              <div class="top_text">概算外(万元)</div>
              <div class="bom_text">{{ fundScreenDto.gswzj }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="management_foot">
        <span class="text_a">本年计划资金(万元)</span>
        <span class="text_num">{{ fundScreenDto.bnjhzj }}</span>
        <span class="text_b">本年使用资金(万元)</span>
        <span class="text_num">{{ fundScreenDto.bnsyzj }}</span>
      </div>
    </div>
    <div class="right_info_con" style="display: flex; flex-direction: column">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/jd.png" alt="" />
        </template>
        <template #info>
          <view @click="handleClickItem(3)" class="right_slot">
            <view class="right_text">查看更多</view>
            <view>
              <img class="look_icon" src="../../../../assets/imgs/homes/icon.png" alt=""
            /></view>
          </view>
        </template>
      </Label>

      <div class="progress" style="flex: 1; display: flex; flex-direction: column">
        <div class="progoress_ridio">
          <div class="cur_b"></div>
          <div class="ridio_text">实际进度</div>
        </div>
        <div class="progress_list" style="flex: 1">
          <div v-for="item in progressList" :key="item.img" class="progress_li">
            <div class="li_img">
              <img class="logo_li" :src="item.img" alt="" />
            </div>
            <div class="li_right">
              <div class="li_title">{{ item.name }}</div>
              <ElProgress :color="customColor_a" class="progress_top" :percentage="item.actual" />
              <!-- <ElProgress :color="customColor" class="progress_top" :percentage="item.plan" /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right_info_bom">
      <div @click="handleClickItem(6)" class="bom_box_top">
        <img class="img_box" src="../../../../assets/imgs/homes/zh.png" alt="" />
      </div>
      <div @click="handleClickItem(1)" class="bom_box_top">
        <img class="img_box" src="../../../../assets/imgs/homes/dsj.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Label from './label.vue'
import { getLeadershipScreen } from '@/api/AssetEvaluation/leader-side'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElProgress } from 'element-plus'
const { emitter } = useEmitt()

const { push } = useRouter()
let route = useRoute()
const fundScreenDto = ref<any>({})

const customColor = ref('#CADAFF')
const customColor_a = ref('#3E73EC')

const progressList: any = ref([])

const computedProperty = computed(() => {
  return (fundScreenDto.value.ljsyzj / fundScreenDto.value.gszj) * 100
})

onMounted(() => {
  emitter.on('getHomeInfo_list', getInfo)
})
// 触发
const getInfo = (e: any) => {
  fundScreenDto.value = e.fundScreenDto

  progressList.value = e.progressManagementDto.map((item: any, index: number) => {
    item.img = new URL(`../../../../assets/imgs/homes/logo_${index + 1}.png`, import.meta.url).href
    if (item.actual != 0) {
      item.actual = item.actual * 100
    }
    if (item.plan != 0) {
      item.plan = item.plan * 100
    }
    return item
  })
}
const handleClickItem = (type: number) => {
  console.log(route)

  const pathMap = {
    1: 'adminSecondHome', // 大数据分析
    2: 'adminhomefund', //资金管理
    3: 'adminhomeprogress', //进度管理 //新闻管理
    4: 'Project', //新闻管理
    5: 'Feedback', //反馈管理
    6: 'SmartReport' // 智慧报表
  }
  push({ name: pathMap[type] })
}
</script>

<style lang="less" scoped>
.right_info {
  .xm_img {
    width: 74px;
    height: 15px;
  }

  .right_slot {
    display: flex;
    cursor: pointer;

    .look_icon {
      width: 16px;
      height: 16px;
      margin-top: 2px;
    }
  }

  .right_info_top {
    width: 620px;
    height: 312px;
    margin-bottom: 12px;
    background: #ffffff;
    border: 2px solid rgba(62, 115, 236, 0.7);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    box-sizing: border-box;

    .management {
      display: flex;
      padding: 16px 16px 0px 16px;

      .management_left {
        width: 220px;
        height: 181px;
        padding-top: 24px;
        margin-right: 25px;
        text-align: center;
        background: #ffffff;
        border: 1px solid rgba(62, 115, 236, 0.2);
        border-radius: 4px 4px 4px 4px;
        opacity: 1;

        .left_logo {
          width: 60px;
          height: 60px;
          margin: auto;
          margin-bottom: 16px;
        }
      }

      .left_lable {
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 400;
        line-height: 21px;
        color: #666666;
      }

      .left_num {
        font-family: DIN Medium, DIN Medium;
        font-size: 30px;
        font-weight: 400;
        line-height: 35px;
        color: #333333;
      }

      .management_right {
        position: relative;
        width: 343px;
        height: 181px;
        padding: 20px 16px;
        background: #f2f6ff;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;

        .right_icon {
          position: absolute;
          top: 72px;
          left: -15px;
          width: 16px;
          height: 32px;
        }

        .management_r_top {
          display: flex;
          margin-bottom: 10px;

          .icon_b {
            width: 60px;
            height: 60px;
            margin-right: 10px;
          }

          .top_info {
            width: 170px;
            margin-right: 10px;
          }

          .round {
            width: 60px;
            height: 60px;
            text-align: center;
            background: #ffffff;
            border: 2px solid #3e73ec;
            border-radius: 50%;
            opacity: 1;

            .round_top {
              margin-top: 10px;
              margin-bottom: 5px;
              font-family: DIN Medium, DIN Medium;
              font-size: 10px;
              font-weight: 400;
              line-height: 12px;
              color: #3e73ec;
            }

            .round_bom {
              font-family: DIN Medium, DIN Medium;
              font-size: 18px;
              font-weight: 400;
              line-height: 18px;
              color: #3e73ec;
            }
          }
        }

        .management_r_bom {
          display: flex;
          width: 310px;
          height: 70px;
          padding: 8px 16px;
          background: #ffffff;
          border-radius: 8px 8px 8px 8px;

          .bom_box_l {
            flex: 1;
            text-align: center;
          }

          .top_text {
            margin-bottom: 3px;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            color: #737475;
          }

          .bom_text {
            font-family: DIN Medium, DIN Medium;
            font-size: 20px;
            font-weight: 400;
            line-height: 28px;
            color: #454647;
          }
        }
      }
    }

    .management_foot {
      margin-top: 25px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: #666666;

      .text_a {
        margin-right: 8px;
        margin-left: 39px;
      }

      .text_num {
        font-family: DIN Medium, DIN Medium;
        font-size: 20px;
        font-weight: 400;
        line-height: 23px;
        color: #333333;
      }

      .text_b {
        margin-right: 8px;
        margin-left: 98px;
      }
    }
  }

  .right_info_con {
    width: 620px;
    height: 402px;
    background: #ffffff;

    border: 2px solid rgba(62, 115, 236, 0.7);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    box-sizing: border-box;

    .progress {
      padding: 0px 30px;

      .progoress_ridio {
        display: flex;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: #1d2129;
        // margin-bottom: 10px;
        .cur_b {
          width: 8px;
          height: 8px;
          margin-top: 7px;
          margin-right: 4px;
          background: #165dff;
          border-radius: 100px 100px 100px 100px;
        }

        .ridio_text {
          margin-right: 16px;
        }

        .cur_jd {
          width: 8px;
          height: 8px;
          margin-top: 7px;
          margin-right: 4px;
          background: #cadaff;
          border-radius: 100px 100px 100px 100px;
        }
      }

      .progress_list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .progress_li {
          display: flex;
          margin-top: 15px;

          .logo_li {
            width: 40px;
            height: 40px;
            margin-right: 16px;
          }

          .li_title {
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 500;
            line-height: 14px;
            color: #131313;
          }

          .progress_top {
            width: 204px;
            margin-bottom: 6px;
          }

          :deep(.el-progress-bar__outer) {
            height: 10px !important;
          }
        }
      }
    }
  }

  .bom_box_top {
    width: 620px;
    height: 100px;
    padding: 8px;
    margin-top: 12px;
    background: #ffffff;
    border: 2px solid rgba(62, 115, 236, 0.7);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    box-sizing: border-box;

    .img_box {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
}
</style>
