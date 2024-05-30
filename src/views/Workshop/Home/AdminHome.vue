<template>
  <div class="box-wrapper">
    <div class="search">
      <div class="custom-dropdown">
        <div class="search-inputs">
          <input v-model="typeTxt" type="span" placeholder="请选择类型" style="color: black" />
        </div>
        <div class="dropdown-content">
          <ul>
            <li
              data-value="1"
              v-for="item in typeList"
              :key="item"
              @click="selectType(item)"
              style="color: black"
              >{{ item.title }}</li
            >
          </ul>
        </div>
      </div>
      <div class="search-input">
        <input v-model="searchTxt" type="span" placeholder="请输入户号、联系方式" />
      </div>
      <div class="search-btn" @click="toSearch">
        <img class="search-icon" src="@/assets/imgs/icon_search_white.png" mode="aspectFit" />
        <span class="search-txt">查询</span>
      </div>
    </div>
    <!-- 具体内容 -->
    <div class="main-enter">
      <!--居民区-->
      <div class="enter-item">
        <div class="title-field" @click="toTarget('PeasantHouseholdImp')">
          <div class="enter-icon">
            <img class="img" src="@/assets/imgs/home/icon_jmh.png" />
          </div>
          <div class="enter-title">
            <span class="title-txt">居民户/只征地不搬迁</span>
            <div class="flex">
              <span class="count-num"> {{ statisticsObj?.peasantCount }} </span>
              <span class="count-unit"> 户 </span>
              <span class="count-num"> / </span>
              <span class="count-num"> {{ statisticsObj?.landNoMoveCount }} </span>
              <span class="count-unit"> 户 </span>
            </div>
          </div>
        </div>
        <div class="row-field">
          <div
            class="field-box"
            @click.prevent.stop="toLinkParams('PeasantHouseholdImp', { warnStatus: 2 })"
          >
            <div class="line-1">{{ statisticsObj?.peasantLagCount }}</div>
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
              <div class="line-2">滞后</div>
            </div>
          </div>
          <div class="field-box" @click="toLinkParams('PeasantHouseholdImp', { warnStatus: 1 })">
            <div class="line-1">{{ statisticsObj?.peasantWarnCount }}</div>
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
              <div class="line-2">预警</div>
            </div>
          </div>
          <div class="field-box" @click="toLinkParams('PeasantHouseholdImp', { warnStatus: 0 })">
            <div class="line-1">{{ statisticsObj?.peasantNormalCount }}</div>
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
              <div class="line-2">正常</div>
            </div>
          </div>
        </div>
      </div>
      <!--企业-->
      <div class="enter-item">
        <div class="title-field" @click="toTarget('EnterpriseImp')">
          <div class="enter-icon">
            <img class="img" src="@/assets/imgs/home/icon_qsydw.png" />
          </div>
          <div class="enter-title">
            <span class="title-txt">企(事)业单位</span>
            <div class="flex">
              <span class="count-num"> {{ statisticsObj?.companyCount }} </span>
              <span class="count-unit"> 家 </span>
            </div>
          </div>
        </div>
        <div class="row-field">
          <div class="field-box" @click="toTarget('EnterpriseImp', { warnStatus: 2 })">
            <div class="line-1">{{ statisticsObj?.companyLagCount }} </div>
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
              <div class="line-2 red">滞后</div>
            </div>
          </div>
          <div class="field-box" @click="toTarget('EnterpriseImp', { warnStatus: 1 })">
            <div class="line-1">{{ statisticsObj?.companyWarnCount }}</div>
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
              <div class="line-2">预警</div>
            </div>
          </div>
          <div class="field-box" @click="toTarget('EnterpriseImp', { warnStatus: 0 })">
            <div class="line-1">{{ statisticsObj?.companyNormalCount }}</div>
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
              <div class="line-2">正常</div>
            </div>
          </div>
        </div>
      </div>
      <!--个体户-->
      <div class="enter-item">
        <div class="title-field" @click="toTarget('IndividualImp')">
          <div class="enter-icon">
            <img class="img" src="@/assets/imgs/home/icon_gth.png" />
          </div>
          <div class="enter-title">
            <span class="title-txt">个体工商户</span>
            <div class="flex">
              <span class="count-num">{{ statisticsObj?.individualCount }}</span>
              <span class="count-unit"> 家 </span>
            </div>
          </div>
        </div>
        <div class="row-field">
          <div class="field-box" @click="toTarget('IndividualImp', { warnStatus: 2 })">
            <div class="line-1">{{ statisticsObj?.individualLagCount }}</div>
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
              <div class="line-2 red">滞后</div>
            </div>
          </div>
          <div class="field-box" @click="toTarget('IndividualImp', { warnStatus: 1 })">
            <div class="line-1">{{ statisticsObj?.individualWarnCount }}</div>
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
              <div class="line-2">预警</div>
            </div>
          </div>
          <div class="field-box" @click="toTarget('IndividualImp', { warnStatus: 0 })">
            <div class="line-1">{{ statisticsObj?.individualNormalCount }}</div>
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
              <div class="line-2">正常</div>
            </div>
          </div>
        </div>
      </div>
      <!--村集体-->
      <div class="enter-item">
        <div class="title-field" @click="toTarget('VillageImp')">
          <div class="enter-icon">
            <img class="img" src="@/assets/imgs/home/icon_village.png" />
          </div>
          <div class="enter-title">
            <span class="title-txt">村集体</span>
            <div class="flex">
              <span class="count-num">{{ statisticsObj?.villageCount }}</span>
              <span class="count-unit">个</span>
            </div>
          </div>
        </div>
        <div class="row-field">
          <div class="field-box" @click="toTarget('VillageImp', { warnStatus: 2 })">
            <div class="line-1">{{ statisticsObj?.villageLagCount }}</div>
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
              <div class="line-2 red">滞后</div>
            </div>
          </div>
          <div class="field-box" @click="toTarget('VillageImp', { warnStatus: 1 })">
            <div class="line-1">{{ statisticsObj?.villageWarnCount }}</div>
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
              <div class="line-2">预警</div>
            </div>
          </div>
          <div class="field-box" @click="toTarget('VillageImp', { warnStatus: 0 })">
            <div class="line-1">{{ statisticsObj?.villageNormalCount }}</div>
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
              <div class="line-2">正常</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 只征地不搬迁 -->
      <!-- <div class="enter-item">
        <div class="title-field" @click="toTarget('LandNoMove')">
          <div class="enter-icon">
            <img class="img" src="@/assets/imgs/home/icon_village.png" />
          </div>
          <div class="enter-title">
            <span class="title-txt">只征地不搬迁</span>
            <div class="flex">
              <span class="count-num">{{ statisticsObj?.landNoMoveCount }}</span>
              <span class="count-unit">户</span>
            </div>
          </div>
        </div>
        <div class="row-field">
          <div class="field-box" @click="toTarget('LandNoMove', { warnStatus: 1 })">
            <div class="line-1">{{ statisticsObj?.landNoMoveCompleteCount }}</div>
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
              <div class="line-2 red">已完成</div>
            </div>
          </div>
          <div class="field-box" @click="toTarget('LandNoMove', { warnStatus: 0 })">
            <div class="line-1">{{ statisticsObj?.landNoMoveIncompletCount }}</div>
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
              <div class="line-2">未完成</div>
            </div>
          </div>
        </div>
      </div> -->
    </div>

    <div class="group">
      <div class="work">
        <Echart />
      </div>
      <div class="message">
        <MessageNotice />
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
import Echart from './components/WorkGroupChart.vue'
import MessageNotice from './components/MessageNotice.vue'
import iconNationalEmblemSrc from '@/assets/imgs/home/icon_national_emblem.png'
import type { StatisticsDtoType } from '@/api/home-types'
import { getImplementationStatistics } from '@/api/home-service'
import { useRouter } from 'vue-router'
const { push } = useRouter()

const emit = defineEmits(['toLink', 'toParamsLink', 'loginIn'])
const statisticsObj = ref<StatisticsDtoType>()
const searchTxt = ref<string>('')
const typeTxt = ref<string>('居民户')
const typeName = ref<string>('PeasantHouseholdImp')
const toLink = (name: string) => {
  emit('toLink', name)
}
const typeList = ref<any[]>([
  {
    name: 'PeasantHouseholdImp',
    title: '居民户'
  },
  {
    name: 'EnterpriseImp',
    title: '企（事）业单位'
  },
  {
    name: 'IndividualImp',
    title: '个体工商户'
  },
  {
    name: 'VillageImp',
    title: '村集体'
  },
  {
    name: 'LandNoMove',
    title: '只征地不搬迁'
  }
])
const selectType = (item: any) => {
  console.log(item.name, '111111111')
  typeTxt.value = item.title
  typeName.value = item.name
}
const toLinkParams = (routeName: string, query = {}) => {
  // emit('toParamsLink', {
  //   name,
  //   ...params
  // })
  push({
    name: routeName,
    query
  })
}

const toTarget = (routeName: string, query = {}) => {
  push({
    name: routeName,
    query
  })
}

// 统计
const getStatistics = async () => {
  try {
    const result = await getImplementationStatistics()
    statisticsObj.value = result
  } catch (error) {
    console.log(error)
  }
}

const toSearch = () => {
  // if (typeTxt.value=='PeasantHouseholdImp') {

  // }
  toTarget(typeName.value, {
    search: searchTxt.value
  })
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
  background-size: 100% cover;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .search {
    display: flex;
    width: 1040px;
    height: 46px;
    margin: 20px auto;
    text-align: center;
    border-radius: 8px;
    justify-content: center;

    .search-input {
      width: 840px;
      height: 46px;
      line-height: 46px;
      text-align: left;
      border-radius: 8px 0 0 8px;

      input {
        width: 940px;
        height: 46px;
        padding-left: 20px;
        font-size: 14px;
        line-height: 46px;
        color: rgba(19, 19, 19, 0.4);
        border-bottom-left-radius: 8px;
        border-top-left-radius: 8px;
        outline: none;
      }
    }

    .search-btn {
      display: flex;
      width: 100px;
      height: 48px;
      overflow: hidden;
      cursor: pointer;
      background: linear-gradient(270deg, #ffb11a 0%, #ff9432 100%);
      border-radius: 0 3px 3px 0;
      justify-content: center;
      align-items: center;

      .search-icon {
        width: 14px;
        height: 14px;
      }

      .search-txt {
        margin-left: 5px;
        font-size: 14px;
        font-weight: 400;
        color: #f7f8fa;
      }
    }
  }

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
          // margin-bottom: 10px;
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
  }

  .group {
    display: flex;

    .work {
      width: 945px;
      padding-top: 20px;
    }

    .message {
      width: 460px;
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
.custom-dropdown {
  position: relative;
  display: inline-block;
}
.search-inputs {
  width: 100px;
  height: 46px;
  line-height: 46px;
  text-align: left;
  border-radius: 8px 0 0 8px;

  input {
    width: 120px;
    height: 46px;
    padding-left: 20px;
    font-size: 14px;
    line-height: 46px;
    color: rgba(19, 19, 19, 0.5);
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;
    outline: none;
  }
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-content li {
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

.dropdown-content li:hover {
  background-color: #f1f1f1;
}

.dropdown-btn {
  background-color: #4caf50;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropdown-btn:hover,
.dropdown:focus .dropdown-btn {
  background-color: #45a049;
}

.custom-dropdown:hover .dropdown-content {
  display: block;
}
</style>
