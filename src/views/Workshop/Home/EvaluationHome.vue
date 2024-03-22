<template>
  <div class="box-wrapper">
    <!-- 具体内容 -->
    <div class="main-enter">
      <!--居民区-->
      <div class="enter-item" @click="toTarget('LandlordEva')">
        <div class="title-field">
          <div class="enter-icon">
            <img class="img" src="@/assets/imgs/home/icon_jmh.png" />
          </div>
          <div class="enter-title">
            <span class="title-txt">居民户</span>
            <div class="flex">
              <span class="count-num"> {{ statisticsObj?.peasantCount }} </span>
              <span class="count-unit"> 户 </span>
            </div>
          </div>
        </div>
        <div class="row-field">
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('LandlordEva', { estimateStatus: '1' })"
          >
            <div class="line-1">{{ statisticsObj?.peasantCompleteCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #e43030;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">已评估</div>
            </div>
          </div>
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('LandlordEva', { estimateStatus: '0' })"
          >
            <div class="line-1">{{ statisticsObj?.peasantUncompletedCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #fec44c;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">未评估</div>
            </div>
          </div>
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('LandlordEva', { estimateStatus: '2' })"
          >
            <div class="line-1">{{ statisticsObj?.peasantMyCompleteCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #30a952;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">我的评估</div>
            </div>
          </div>
        </div>
      </div>
      <!--企业-->
      <div class="enter-item" @click="toTarget('EnterpriseEva')">
        <div class="title-field">
          <div class="enter-icon">
            <img class="img" src="@/assets/imgs/home/icon_qsydw.png" />
          </div>
          <div class="enter-title">
            <span class="title-txt">企业</span>
            <div class="flex">
              <span class="count-num"> {{ statisticsObj?.companyCount }} </span>
              <span class="count-unit"> 户 </span>
            </div>
          </div>
        </div>
        <div class="row-field">
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('EnterpriseEva', { estimateStatus: '1' })"
          >
            <div class="line-1">{{ statisticsObj?.companyCompleteCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #e43030;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">已评估</div>
            </div>
          </div>
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('EnterpriseEva', { estimateStatus: '0' })"
          >
            <div class="line-1">{{ statisticsObj?.companyUncompletedCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #fec44c;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">未评估</div>
            </div>
          </div>
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('EnterpriseEva', { estimateStatus: '2' })"
          >
            <div class="line-1">{{ statisticsObj?.companyMyCompleteCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #30a952;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">我的评估</div>
            </div>
          </div>
        </div>
      </div>
      <!--个体户-->
      <div class="enter-item" @click="toTarget('IndividualEva')">
        <div class="title-field">
          <div class="enter-icon">
            <img class="img" src="@/assets/imgs/home/icon_gth.png" />
          </div>
          <div class="enter-title">
            <span class="title-txt">个体户</span>
            <div class="flex">
              <span class="count-num"> {{ statisticsObj?.individualCount }} </span>
              <span class="count-unit"> 户 </span>
            </div>
          </div>
        </div>
        <div class="row-field">
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('IndividualEva', { estimateStatus: '1' })"
          >
            <div class="line-1">{{ statisticsObj?.individualCompleteCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #e43030;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">已评估</div>
            </div>
          </div>
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('IndividualEva', { estimateStatus: '0' })"
          >
            <div class="line-1">{{ statisticsObj?.individualUncompletedCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #fec44c;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">未评估</div>
            </div>
          </div>
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('IndividualEva', { estimateStatus: '2' })"
          >
            <div class="line-1">{{ statisticsObj?.individualMyCompleteCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #30a952;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">我的评估</div>
            </div>
          </div>
        </div>
      </div>
      <!--村集体-->
      <div class="enter-item" @click="toTarget('VillageCollectiveEva')">
        <div class="title-field">
          <div class="enter-icon">
            <img class="img" src="@/assets/imgs/home/icon_village.png" />
          </div>
          <div class="enter-title">
            <span class="title-txt">村集体</span>
            <div class="flex">
              <span class="count-num"> {{ statisticsObj?.villageCount }} </span>
              <span class="count-unit"> 户 </span>
            </div>
          </div>
        </div>
        <div class="row-field">
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('VillageCollectiveEva', { estimateStatus: '1' })"
          >
            <div class="line-1">{{ statisticsObj?.villageCompleteCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #e43030;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">已评估</div>
            </div>
          </div>
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('VillageCollectiveEva', { estimateStatus: '0' })"
          >
            <div class="line-1">{{ statisticsObj?.villageUncompletedCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #fec44c;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">未评估</div>
            </div>
          </div>
          <div
            class="field-box"
            @click.prevent.stop="toTargetOver('VillageCollectiveEva', { estimateStatus: '2' })"
          >
            <div class="line-1">{{ statisticsObj?.villageMyCompleteCount }}</div>
            <div class="flex">
              <div
                style="
                  width: 8px;
                  height: 8px;
                  margin-top: 8px;
                  margin-right: 8px;
                  background-color: #30a952;
                  border-radius: 50%;
                "
              ></div>
              <div class="line-2">我的评估</div>
            </div>
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
interface PropsType {
  role?: string
}
const props = defineProps<PropsType>()
const { push } = useRouter()

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

const toTarget = (routeName: string, query = {}) => {
  try {
    push({
      name: routeName,
      query
    })
  } catch (err) {
    ElMessage.error('该角色缺少相关配置路由页面')
  }
}
const toTargetOver = (routeName: string, query = {}) => {
  console.log('测试小点击')
  try {
    push({
      name: routeName,
      query
    })
  } catch (err) {
    ElMessage.error('该角色缺少相关配置路由页面')
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
      width: 362px;
      height: 163px;
      padding: 20px;
      margin-right: 60px;
      cursor: pointer;
      background: linear-gradient(180deg, #deebf6 0%, #ffffff 100%);
      border-radius: 18px;

      .title-field {
        display: flex;

        .enter-icon {
          width: 78px;
          height: 78px;

          .img {
            width: 100%;
            height: 100%;
          }
        }

        .enter-title {
          margin-left: 8px;

          .title-txt {
            font-size: 16px;
            font-weight: 500;
            color: #333333;
          }

          .count-num {
            margin-bottom: 5px;
            font-size: 28px;
            font-weight: bold;
            color: #171718;
          }

          .count-unit {
            margin-top: 6px;
            margin-left: 6px;
            font-size: 16px;
            color: #131313;
          }
        }
      }

      .row-field {
        display: flex;
        font-size: 8px;
        justify-content: space-between;

        .field-box {
          display: flex;
          width: 87px;
          padding-bottom: 10px;
          margin-top: -6px;
          background: linear-gradient(180deg, #ffffff 0%, #e9f5ff 100%);
          border-radius: 8px;
          flex-direction: column;
          align-items: center;

          .line-1 {
            font-size: 20px;
            font-weight: 400;
            color: #171718;
          }

          .flex {
            display: flex;

            .dot-red {
              width: 8px;
              height: 8px;
              background-color: #e43030;
              border-radius: 50%;
            }

            .dot-yellow {
              width: 8px;
              height: 8px;
              background-color: #fec44c;
            }

            .dot-green {
              width: 8px;
              height: 8px;
              background-color: #30a952;
            }
          }

          .line-2 {
            font-size: 16px;
            font-weight: 500;
            color: rgba(23, 23, 24, 0.6);
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

    // .enter-item {
    //   display: flex;
    //   height: 140px;
    //   padding: 20px;
    //   margin-right: 20px;
    //   background: #f2f2f2;
    //   border-radius: 10px;
    //   flex: 1;

    //   .title-area {
    //     width: 66px;
    //     margin-top: 20px;
    //     margin-right: 10px;
    //     font-weight: bold;
    //     color: #333333;

    //     .item-title {
    //       font-size: 20px;
    //     }

    //     .item-number {
    //       margin-top: 4px;
    //       font-size: 16px;
    //     }
    //   }

    //   .item-status {
    //     display: flex;
    //     align-items: center;
    //     // margin-left: 10px;

    //     .status-special {
    //       display: flex;
    //       margin-right: 20px;
    //       font-size: 16px;
    //       font-weight: bold;
    //       flex-direction: column;
    //       align-items: center;

    //       .special-number {
    //         height: 30px;
    //         line-height: 30px;
    //         color: #333333;

    //         &.success {
    //           color: #30a952;
    //         }

    //         &.error {
    //           color: #e43030;
    //         }
    //       }

    //       .special-status {
    //         color: #333333;
    //         // width: 40px;
    //       }
    //     }
    //   }

    //   .top {
    //     display: flex;
    //     flex-direction: column;
    //   }

    //   &:last-child {
    //     margin-right: 0px;
    //   }
    // }
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
