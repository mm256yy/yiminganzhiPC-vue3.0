<!--
 * @Author: baike
 * @LastEditors: baike
-->
<template>
  <div class="right_info">
    <div class="right_info_top">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/zj.png" alt="" />
        </template>
        <template #info>
          <view class="right_slot">
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
              <div class="round_bom">98%</div>
            </div>
          </div>
          <div class="management_r_bom">
            <div class="bom_box_l">
              <div class="top_text">概算内(万元)</div>
              <div class="bom_text">{{ fundScreenDto.gsnzj }}</div>
            </div>
            <div class="bom_box_l">
              <div class="top_text">概算外(万元)</div>
              <div class="bom_text">{{ fundScreenDto.gswzj }}s</div>
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
    <div class="right_info_con">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/jd.png" alt="" />
        </template>
        <template #info>
          <view class="right_slot">
            <view class="right_text">查看更多</view>
            <view>
              <img class="look_icon" src="../../../../assets/imgs/homes/icon.png" alt=""
            /></view>
          </view>
        </template>
      </Label>
    </div>
    <div class="right_info_bom">
      <div class="bom_box_top">
        <img class="img_box" src="../../../../assets/imgs/homes/zh.png" alt="" />
      </div>
      <div class="bom_box_top">
        <img class="img_box" src="../../../../assets/imgs/homes/dsj.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Label from './label.vue'
import { getLeadershipScreen } from '@/api/AssetEvaluation/leader-side'
import { useRouter } from 'vue-router'
import { ref, onMounted, watchEffect } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'

const { emitter } = useEmitt()

const { push } = useRouter()
const fundScreenDto = ref<any>({})

onMounted(() => {
  emitter.on('getHomeInfo_list', getInfo)
})
// 触发
const getInfo = (e: any) => {
  fundScreenDto.value = e.fundScreenDto
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
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 2px solid rgba(62, 115, 236, 0.7);
    margin-bottom: 12px;
    box-sizing: border-box;

    .management {
      padding: 16px 16px 0px 16px;
      display: flex;

      .management_left {
        width: 220px;
        height: 181px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        border: 1px solid rgba(62, 115, 236, 0.2);
        margin-right: 25px;
        padding-top: 24px;
        text-align: center;
        .left_logo {
          width: 60px;
          height: 60px;
          margin: auto;
          margin-bottom: 16px;
        }
      }
      .left_lable {
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        line-height: 21px;
        margin-bottom: 8px;
      }
      .left_num {
        font-size: 30px;
        font-family: DIN Medium, DIN Medium;
        font-weight: 400;
        color: #333333;
        line-height: 35px;
      }
      .management_right {
        width: 343px;
        height: 181px;
        background: #f2f6ff;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        position: relative;
        padding: 20px 16px;
        .right_icon {
          position: absolute;
          top: 72px;
          width: 16px;
          height: 32px;
          left: -15px;
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
            background: #ffffff;
            border-radius: 50%;
            opacity: 1;
            border: 2px solid #3e73ec;
            text-align: center;
            .round_top {
              font-size: 10px;
              font-family: DIN Medium, DIN Medium;
              font-weight: 400;
              color: #3e73ec;
              line-height: 12px;
              margin-bottom: 5px;
              margin-top: 10px;
            }
            .round_bom {
              font-size: 18px;
              font-family: DIN Medium, DIN Medium;
              font-weight: 400;
              color: #3e73ec;
              line-height: 18px;
            }
          }
        }
        .management_r_bom {
          width: 310px;
          height: 70px;
          background: #ffffff;
          border-radius: 8px 8px 8px 8px;
          display: flex;
          padding: 8px 16px;
          .bom_box_l {
            flex: 1;
            text-align: center;
          }
          .top_text {
            margin-bottom: 3px;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #737475;
            line-height: 22px;
          }
          .bom_text {
            font-size: 20px;
            font-family: DIN Medium, DIN Medium;
            font-weight: 400;
            color: #454647;
            line-height: 28px;
          }
        }
      }
    }
    .management_foot {
      margin-top: 25px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #666666;
      line-height: 20px;
      .text_a {
        margin-right: 8px;
        margin-left: 39px;
      }
      .text_num {
        font-size: 20px;
        font-family: DIN Medium, DIN Medium;
        font-weight: 400;
        color: #333333;
        line-height: 23px;
      }
      .text_b {
        margin-left: 98px;
        margin-right: 8px;
      }
    }
  }
  .right_info_con {
    width: 620px;
    height: 402px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-sizing: border-box;

    border: 2px solid rgba(62, 115, 236, 0.7);
  }
  .bom_box_top {
    margin-top: 12px;
    width: 620px;
    height: 100px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-sizing: border-box;
    padding: 8px;
    border: 2px solid rgba(62, 115, 236, 0.7);
    .img_box {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
