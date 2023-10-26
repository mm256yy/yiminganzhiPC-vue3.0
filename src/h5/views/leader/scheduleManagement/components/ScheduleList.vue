<template>
  <div class="flex-col section">
    <div class="flex-row items-center">
      <div class="flex-col items-center section-schedule">
        <LiquidBall title="资格认定" />
      </div>
      <img class="image-arrow" :src="iconArrowRight" />
      <div class="flex-col items-center section-schedule">
        <LiquidBall title="资产评估" />
      </div>
      <img class="image-arrow" :src="iconArrowRight" />
      <div class="flex-col items-center section-schedule">
        <LiquidBall title="安置确认" />
      </div>
      <img class="image-arrow" :src="iconArrowRight" />
      <div class="flex-col items-center section-schedule">
        <LiquidBall title="择址确认" />
      </div>
    </div>
    <div class="right-arrow">
      <img class="image-arrow" :src="iconArrowBottom" />
    </div>
    <div class="flex-row items-center">
      <div class="flex-col items-center section-schedule">
        <LiquidBall title="生产安置" />
      </div>
      <img class="image-arrow" :src="iconArrowLeft" />
      <div class="flex-col items-center section-schedule">
        <LiquidBall title="搬迁安置" />
      </div>
      <img class="image-arrow" :src="iconArrowLeft" />
      <div class="flex-col items-center section-schedule">
        <LiquidBall title="动迁协议" />
      </div>
      <img class="image-arrow" :src="iconArrowLeft" />
      <div class="flex-col items-center section-schedule">
        <LiquidBall title="腾空过渡" />
      </div>
    </div>
    <!--进度预警-->
    <div class="flex-col section-process">
      <div class="flex-row">
        <div class="title-marker"></div>
        <span class="label-title">进度预警</span>
      </div>
      <div class="flex-col space-list">
        <div class="flex-col list-item" v-for="(item, index) in items" :key="index">
          <div class="flex-row justify-between items-center group-header">
            <div class="flex-row items-center space-item">
              <div
                class="flex-col justify-start items-center text-wrapper"
                style="width: 0.5rem; height: 0.5rem; background-color: #ff5722; border-radius: 50%"
              >
                <div class="text-status"></div>
              </div>
              <span class="text-name">{{ item.name }}</span>
            </div>
            <span class="text-check">查看档案</span>
          </div>
          <div class="flex-row items-center group-list">
            <div class="flex-col list-item">
              <div class="flex-row row-field">
                <span class="label-left">户号</span>
                <span class="label-right">{{ item.doorNo }}</span>
              </div>
              <div class="flex-row row-field">
                <span class="label-left">所属行政村</span>
                <span class="label-right">{{ item.villageCodeText }}</span>
              </div>
              <div class="flex-row row-field">
                <span class="label-left">当前进度</span>
                <span class="label-right">{{ item.typeText }}</span>
              </div>
              <div class="flex-row row-field">
                <span class="label-left">工作组</span>
                <span class="label-right">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import iconArrowBottom from '@/h5/assets/imgs/icon_arrow_bottom.png'
import iconArrowLeft from '@/h5/assets/imgs/icon_arrow_left.png'
import iconArrowRight from '@/h5/assets/imgs/icon_arrow_right.png'
import LiquidBall from './LiquidBall.vue'
import { getWarning } from '../service'
import { ref, onMounted } from 'vue'

const items = ref<any[]>([
  {
    status: '滞后',
    name: '吕利君'
  },
  {
    status: '滞后',
    name: '郑清予'
  },
  {
    status: '滞后',
    name: '李淑萍'
  }
])
let getWarnings = async () => {
  let data = await getWarning()
  console.log(data)
  items.value = data
}
onMounted(() => {
  getWarnings()
})
</script>

<style lang="less" scoped>
.section {
  padding: 10px;
  overflow: hidden;
  background-color: #ffffff;

  .section-schedule {
    height: 180px;
    // padding: 14px 0 8px;
    overflow: hidden;
    background-image: linear-gradient(180deg, #dbeeff 0%, #f5faff 100%);
    border: solid 1px #ffffff;
    border-radius: 10px;
    flex: 1;
    border-image-slice: 1;

    .text-wrapper {
      width: 40px;
      padding: 30px 0 12px;
      background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/64e83d955a7e3f0310414dfe/64e842454d98100011acce52/16950085294624913749.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;

      .text-percent {
        font-size: 24px;
        font-weight: 500;
        color: #3e73ec;
      }
    }

    .schedule-title {
      padding-top: 10px;
      margin-top: 10px;
      font-size: 26px;
      font-weight: 500;
      line-height: 40px;
      color: #171718;
    }
  }

  .image-arrow {
    width: 26px;
    height: 26px;
    margin: 4px;
  }

  .right-arrow {
    display: flex;
    justify-content: flex-end;
    margin-right: 60px;
  }

  .section-process {
    padding: 40px 16px 0;
    margin: 24px;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 16px 16px 0 0;
    filter: drop-shadow(0px 0px 7px #0000000d);

    .space-list {
      .list-item {
        padding: 24px 30px 0;
        margin: 16px;
        overflow: hidden;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0px 0px 7px #00000017;

        .group-header {
          padding-bottom: 7px;
          border-bottom: solid 1px #ebebeb;

          .space-item {
            .text-wrapper {
              width: 80px;
              height: 48px;
              margin-right: 16px;
              overflow: hidden;
              line-height: 48px;
              background-color: #fcebeb;
              border-radius: 4px;

              .text-status {
                font-size: 24px;
                line-height: 48px;
                color: #e63633;
                text-align: center;
              }
            }

            .text-name {
              font-size: 32px;
              font-weight: 700;
              line-height: 30px;
              color: #131313;
            }
          }

          .text-check {
            font-size: 28px;
            line-height: 26px;
            color: #3e73ec;
          }
        }

        .group-list {
          padding: 8px 0 12px;

          .list-item {
            width: 100%;
            margin-top: 10px;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0px 0px 16px #0000000d;

            .row-field {
              height: 52px;
              padding: 15px 9;
              line-height: 52px;
            }

            .userName {
              padding-right: 24px;
              font-size: 36px;
              font-weight: bold;
              color: #363a44;
            }

            .role-txt {
              height: 36px;
              padding: 0 12px;
              margin-top: 5px;
              border: solid 2px #fec44c;
              border-radius: 4px;

              .role {
                height: 36px;
                font-size: 24px;
                line-height: 36px;
                color: #3e73ec;
                text-align: center;

                &.role-owner {
                  color: #ffab00;
                }
              }
            }

            .label-left {
              width: 112px;
              font-size: 28px;
              font-weight: 400;
              color: #666666;
              text-align: right;
            }

            .label-right {
              padding-left: 24px;
              font-size: 28px;
              font-weight: 400;
              color: #131313;
            }
          }
        }
      }

      .font_1 {
        font-family: PingFang SC;
        font-size: 14px;
        line-height: 11px;
        color: #171718;
      }

      .text_12 {
        line-height: 10.5px;
      }

      .font_4 {
        font-family: PingFang SC;
        font-size: 14px;
        line-height: 13px;
        color: #171718;
      }
    }
  }
}
</style>
