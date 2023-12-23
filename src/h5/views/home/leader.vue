<template>
  <div class="flex-col flex-auto group-all">
    <div class="flex-col justify-start items-center relative section-header">
      <img class="image-curved-bg" :src="iconMineBg" />
      <div class="flex-col justify-start section position-header">
        <div class="grid-display">
          <div class="flex-col items-center relative grid-item" @click="toLink('fundManagement')">
            <img class="image-grid" :src="iconFundManagement" />
            <span class="font-normal text-grid">资金管理</span>
          </div>
          <div
            class="flex-col items-center relative grid-item"
            @click="toLink('scheduleManagement')"
          >
            <img class="image-grid" :src="iconProcessManagement" />
            <span class="font-normal text-grid">进度管理</span>
          </div>
          <div class="flex-col items-center relative grid-item" @click="toLink('feedback')">
            <img class="image-grid" :src="iconInfoFeedback" />
            <span class="font-normal text-grid">信息反馈</span>
          </div>
          <div class="flex-col items-center relative grid-item">
            <img class="image-grid" :src="iconGeneralSituation" />
            <span class="font-normal text-grid">水库概况</span>
          </div>
          <div
            class="flex-col items-center relative grid-item"
            @click="toLink('immigrantPortrait')"
          >
            <img class="image-grid" :src="iconImmigrantPortrait" />
            <span class="font-normal text-grid">移民画像</span>
          </div>
          <div class="flex-col items-center relative grid-item">
            <img class="image-grid" :src="iconImmigrantHomeSickness" />
            <span class="font-normal text-grid">移民乡愁</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-col section-immigrant">
      <div class="flex-row justify-between items-center group-immigrant">
        <div
          class="flex-row items-center"
          style="display: flex; justify-content: space-between; width: 100%"
        >
          <div style="display: flex; align-items: baseline">
            <div class="shrink-zero title-marker"></div>
            <div class="label-title">移民数智</div>
          </div>

          <ElSelect
            v-model="cityList.value"
            class="m-2"
            placeholder="请选择区域"
            @change="handelchange"
          >
            <ElOption
              v-for="item in cityList.data"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </ElSelect>
        </div>
      </div>
      <div class="flex-col justify-start items-center relative group-land">
        <img class="image-land" :src="iconFreeholdLand" />
        <span class="position-land">永久用地</span>
        <div class="position-area">
          <span class="text-area">{{ cityList.listArray.landScreenDto.totalArea }}</span>
          <span class="font-area">亩</span>
        </div>
        <div class="flex-col section-group pos_6">
          <div class="flex-row items-center">
            <div class="label-mark blue"></div>
            <span class="text-title">水库淹没区</span>
          </div>
          <div class="flex-row items-center">
            <div class="flex-row items-center">
              <span class="text-number">{{ cityList.listArray.landScreenDto.totalSkymqArea }}</span>
              <span class="font-normal">亩</span>
            </div>
          </div>
        </div>
        <div class="flex-col section-group pos_7">
          <div class="flex-row items-center">
            <div class="label-mark green"></div>
            <span class="text-title">枢纽工程建设区</span>
          </div>
          <div class="flex-row items-center">
            <div class="flex-row items-center">
              <span class="text-number">{{ cityList.listArray.landScreenDto.totalSnjsqArea }}</span>
              <span class="font-normal">亩</span>
            </div>
          </div>
        </div>
        <div class="flex-col section-group pos_8">
          <div class="flex-row items-center">
            <div class="label-mark yellow"></div>
            <span class="text-title">输水工程建设区</span>
          </div>
          <div class="flex-row items-center">
            <div class="flex-row items-center">
              <span class="text-number">{{ cityList.listArray.landScreenDto.totalSsjsqArea }}</span>
              <span class="font-normal">亩</span>
            </div>
          </div>
        </div>
      </div>
      <!--人口-->
      <div class="flex-row items-center">
        <div class="arrow-right"></div>
        <div class="arrow-label">人口</div>
      </div>
      <div class="flex-row equal-division">
        <div class="flex-row justify-center items-center equal-division-item section-total">
          <img class="image-account" :src="iconTotalHouseholdNumber" />
          <div class="flex-col items-start group-account">
            <div class="flex-row justify-center txt-field">
              <span class="text-number">{{ cityList.listArray.populationScreenDto.houseNum }}</span>
              <span class="normal">人</span>
            </div>
            <div class="account-txt">总户数</div>
          </div>
        </div>
        <div class="flex-row justify-center items-center equal-division-item section-property">
          <img class="image-account" :src="iconPropertyHousehold" />
          <div class="flex-col items-start group-account">
            <div class="flex-row justify-center txt-field">
              <span class="text-number">{{ cityList.listArray.populationScreenDto.cchNum }}</span>
              <span class="normal">人</span>
            </div>
            <div class="account-txt">财产户</div>
          </div>
        </div>
      </div>
      <div class="flex-row justify-between items-center section-headcount">
        <div class="flex-row">
          <img class="image-headcount" :src="iconHeadCount" />
          <div class="flex-col items-start group-total">
            <div class="txt-field">
              <span class="text-number">{{
                cityList.listArray.populationScreenDto.peopleNum
              }}</span>
              <span class="normal">人</span>
            </div>
            <span class="account-txt">总人数</span>
          </div>
        </div>
        <div class="flex-row items-center section-agriculture">
          <div class="flex-col items-center">
            <span class="account-txt">农业</span>
            <div class="txt-field">
              <span class="text-number">{{ cityList.listArray.populationScreenDto.nongNum }}</span>
              <span class="normal">人</span>
            </div>
          </div>
          <div class="divider"></div>
          <div class="flex-col items-center">
            <span class="account-txt">非农</span>
            <div class="txt-field">
              <span class="text-number">{{
                cityList.listArray.populationScreenDto.unNongNum
              }}</span>
              <span class="normal">人</span>
            </div>
          </div>
        </div>
      </div>
      <!--房屋-->
      <div class="flex-row items-center">
        <div class="arrow-right"></div>
        <div class="arrow-label">房屋</div>
      </div>
      <div class="flex-row equal-division">
        <div class="flex-col section-house equal-division-item">
          <div class="flex-row items-center">
            <div class="label-mark blue"></div>
            <span class="house-title">总房屋面积</span>
          </div>
          <div class="flex-row items-center">
            <div class="group-house">
              <span class="emphasize">{{
                (cityList.listArray.houseScreenDto.totalArea / 10000).toFixed(2)
              }}</span>
              <span class="house-title">万㎡</span>
            </div>
          </div>
        </div>
        <div class="flex-col section-house equal-division-item">
          <div class="flex-row items-center">
            <div class="label-mark green"></div>
            <span class="house-title">住宅房屋</span>
          </div>
          <div class="flex-row items-center">
            <div class="group-house">
              <span class="emphasize">{{
                (cityList.listArray.houseScreenDto.zzArea / 10000).toFixed(2)
              }}</span>
              <span class="house-title">万㎡</span>
            </div>
          </div>
        </div>
        <div class="flex-col section-house equal-division-item">
          <div class="flex-row items-center">
            <div class="label-mark yellow"></div>
            <span class="house-title">村集体房屋</span>
          </div>
          <div class="flex-row items-center">
            <div class="group-house">
              <span class="emphasize">{{
                (cityList.listArray.houseScreenDto.cjtArea / 10000).toFixed(2)
              }}</span>
              <span class="house-title">万㎡</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-col section-implementation-progress">
      <div class="flex-row justify-between items-center bottom-gap">
        <div class="flex-row items-center">
          <div class="shrink-zero title-marker"></div>
          <span class="label-title">实施进度</span>
        </div>
        <span class="font-gray" @click="toLink('scheduleManagement')">查看更多</span>
      </div>
      <Echart :options="progressOption" :height="260" />
    </div>
  </div>
</template>

<script setup lang="ts">
import iconMineBg from '@/h5/assets/imgs/icon_mine_bg.png'
import iconFundManagement from '@/h5/assets/imgs/icon_fund_management.png'
import iconProcessManagement from '@/h5/assets/imgs/icon_process_management.png'
import iconInfoFeedback from '@/h5/assets/imgs/icon_info_feedback.png'
import iconGeneralSituation from '@/h5/assets/imgs/icon_general_situation.png'
import iconImmigrantPortrait from '@/h5/assets/imgs/icon_immigrant_portrait.png'
import iconImmigrantHomeSickness from '@/h5/assets/imgs/icon_immigrant_homesickness.png'
import iconFreeholdLand from '@/h5/assets/imgs/icon_freehold_land.png'
import iconTotalHouseholdNumber from '@/h5/assets/imgs/icon_total_household_number.png'
import iconPropertyHousehold from '@/h5/assets/imgs/icon_property_household.png'
import iconHeadCount from '@/h5/assets/imgs/icon_headcount.png'
import Echart from '@/h5/components/Echarts/index.vue'
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElSelect, ElOption } from 'element-plus'
import { getVillageList, getLeadershipScreen, getTokenApi } from './service'

const { push } = useRouter()
const tokenStr = ref<string>('')

const toLink = (routeName: string, query = {}) => {
  push({
    name: routeName,
    query
  })
}

// 第三方跳转
const toThirdParty = () => {
  const url = `https://jingling-reservoir-demo.jldt.top?token=${tokenStr.value}`
  window.location.href = url
}

let cityList: any = reactive({
  data: [],
  value: '',
  listArray: {
    companyDto: {},
    houseScreenDto: {},
    landScreenDto: {},
    populationScreenDto: {},
    professionalProjectsDto: {},
    progressManagementDto: {}
  },
  Echarts: {
    one: [],
    two: [],
    there: []
  }
})
let handelchange = (e) => {
  console.log(e)
  getLeadershipScreens()
}
// 实施进度图表配置项
const progressOption = ref({})

let getLeadershipScreens = async () => {
  let data = await getLeadershipScreen({ code: cityList.value || null })
  cityList.listArray = data
  cityList.Echarts.one = []
  cityList.Echarts.two = []
  cityList.Echarts.there = []
  // cityList.echart.x = data.progressManagementDto.reduce((pre, item) => {
  //   pre.push(item.plan)
  //   cityList.echart.y.push(item.actual)
  //   cityList.echart.z.push(item.name)
  //   return pre
  // }, [])
  cityList.listArray.progressManagementDto.reverse().forEach((item) => {
    cityList.Echarts.two.push(item.actual)
    cityList.Echarts.there.push(item.name)
    cityList.Echarts.one.push(item.plan)
  })

  progressOption.value = {
    color: ['#4892FB', '#F89DA0'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
      },
      formatter: (params) => {
        let nameStr = ''
        let str = ''
        params &&
          params.map((item: any) => {
            nameStr = item.name
            str = str.concat(`
            <div>${item.seriesName}：${item.value}%</div>
          `)
          })
        return nameStr + str
      }
    },
    legend: {
      icon: 'circle'
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: 30,
      containLabel: true
    },
    xAxis: {
      show: false
      // type: 'value'
    },
    yAxis: {
      type: 'category',
      axisLine: {
        show: false // 不显示坐标轴轴线
      },
      axisTick: {
        show: false // 不显示坐标刻度
      },
      data: cityList.Echarts.there
    },
    series: [
      {
        name: '实际进度',
        type: 'bar',
        barWidth: 10,
        stack: 'total',
        label: {
          show: false
        },
        emphasis: {
          focus: 'series'
        },
        backgroundStyle: {
          color: 'linear-gradient(100deg, #95C9FF 0%, #4892FB 100%)'
        },
        data: cityList.Echarts.two
      },
      {
        name: '计划进度',
        type: 'bar',
        barWidth: 10,
        stack: 'total',
        label: {
          show: false
        },
        emphasis: {
          focus: 'series'
        },
        data: cityList.Echarts.one
      }
    ]
  }
}

const requestToken = async () => {
  try {
    const result = await getTokenApi()
    console.log('T-Api', result)
    tokenStr.value = result.token
  } catch {}
}

let getVillageLists = async () => {
  let data = await getVillageList()
  cityList.data = data
}

onMounted(() => {
  getVillageLists()
  nextTick(() => {
    getLeadershipScreens()
  })
})
</script>

<style lang="less" scoped>
.group-all {
  height: 100%;
  overflow-y: auto;

  .section-header {
    padding-bottom: 92px;

    .image-curved-bg {
      width: 750px;
      height: 340px;
    }

    .section {
      overflow: hidden;
      background-image: linear-gradient(180deg, #ffffffab 33.3%, #fffffff2 100%);
      border: solid 2px #ffffff73;
      border-radius: 16px;
      filter: drop-shadow(0px 0px 14px #0000000d);
      border-image-slice: 1;
      backdrop-filter: blur(4px);

      .grid-display {
        display: grid;
        // height: 360px;
        grid-template-columns: repeat(3, 2fr);

        .grid-item {
          padding: 10px;

          .image-grid {
            width: 140px;
            height: 140px;
          }

          .text-grid {
            font-size: 26px;
            font-weight: 500;
            color: #171718;
          }
        }
      }
    }

    .position-header {
      position: absolute;
      top: 44px;
      right: 30px;
      left: 30px;
    }
  }

  .section-immigrant {
    padding: 0 32px 32px;
    margin: 0 30px;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 16px;
    filter: drop-shadow(0px 0px 14px #0000000d);

    .group-immigrant {
      padding: 32px 0 16px;
    }

    .group-land {
      border-radius: 8px;

      .image-land {
        width: 626px;
        height: 400px;
        border-radius: 8px;
      }

      .position-land {
        position: absolute;
        top: 39px;
        left: 41px;
        font-size: 28px;
        font-weight: 500;
        line-height: 40px;
        color: #333333;
      }

      .position-area {
        position: absolute;
        top: 80px;
        left: 42px;

        .text-area {
          font-size: 48px;
          font-weight: bold;
          line-height: 41px;
          color: #131313;
        }

        .font-area {
          font-size: 28px;
          line-height: 26px;
          color: #131313;
        }
      }

      .section-group {
        width: 262px;
        height: 112px;
        padding: 10px 8px 16px 24px;
        margin: 10px 0;
        overflow: hidden;
        background-image: linear-gradient(89.1deg, #ffffff 7.2%, #ffffff99 106.6%);
        border: solid 2px #ffffff;
        border-radius: 8px;
        border-image-slice: 1;
      }

      .pos_6 {
        position: absolute;
        top: 10px;
        right: 20px;
      }

      .pos_7 {
        position: absolute;
        top: 48%;
        right: 20px;
        transform: translateY(-50%);
      }

      .pos_8 {
        position: absolute;
        top: 260px;
        right: 20px;
      }
    }

    .text_4 {
      font-size: 34px;
      line-height: 32px;
    }

    .text-title {
      font-size: 28px;
      font-weight: 500;
      line-height: 45px;
      color: #666666;
    }

    .text-number {
      padding-left: 20px;
      font-size: 36px;
      font-weight: bold;
      line-height: 45px;
      color: #171718;
    }

    .label-mark {
      width: 6px;
      height: 24px;
      margin-right: 16px;
      border-radius: 6px;

      &.blue {
        background-color: #00aaff;
      }

      &.green {
        background-color: #30a952;
      }

      &.yellow {
        background-color: #fec44c;
      }
    }

    .group-house {
      display: flex;
      align-items: center;
      margin-left: 24px;
    }

    .emphasize {
      font-size: 36px;
      font-weight: bold;
      line-height: 40px;
      color: #171718;
    }

    .house-title {
      font-size: 28px;
      font-weight: 500;
      line-height: 40px;
      color: #666666;
    }

    .equal-division {
      .equal-division-item {
        flex: 1 1 305px;
        row-gap: 10px;

        .image-account {
          width: 88px;
          height: 88px;
          border-radius: 20px;
          filter: drop-shadow(0px 12px 12px #ff2e2e61);
        }
      }

      .section-total {
        height: 128px;
        padding: 20px 32px;
        margin-right: 10px;
        overflow: hidden;
        background-color: #fff3ec;
        border-radius: 8px;
      }

      .section-property {
        height: 128px;
        padding: 20px 32px;
        margin-left: 10px;
        overflow: hidden;
        background-color: #f6f2ff;
        border-radius: 8px;
      }

      .group-account {
        width: 136px;

        .account-txt {
          padding-left: 20px;
          font-size: 28px;
          font-weight: 500;
          line-height: 40px;
          color: #666666;
        }
      }
    }

    .section-headcount {
      padding: 16px 16px 16px 32px;
      margin-top: 16px;
      overflow: hidden;
      background-color: #daf1e799;
      border-radius: 8px;

      .image-headcount {
        width: 88px;
        height: 88px;
        border-radius: 20px;
        filter: drop-shadow(0px 12px 9.5px #0aff3f63);
      }

      .group-total {
        margin: 8px 0 8px 10px;
      }

      .section-agriculture {
        height: 128px;
        padding: 20px 24px;
        background-image: linear-gradient(89.1deg, #ffffffcc 7.2%, #ffffff7a 106.6%);
        border: solid 2px #ffffff;
        border-radius: 8px;
        filter: drop-shadow(0px 0px 8px #d2eee2d6);
        border-image-slice: 1;

        .divider {
          width: 2px;
          height: 56px;
          background-color: #ebebeb;
        }
      }
    }

    .txt-field {
      display: flex;
      align-items: center;

      .normal {
        font-size: 30px;
        line-height: 40px;
        color: #171718;
      }
    }

    .account-txt {
      padding-left: 20px;
      font-size: 28px;
      font-weight: 500;
      line-height: 40px;
      color: #666666;
    }
  }

  .font-normal {
    font-family: PingFang SC;
    font-size: 28px;
    line-height: 26px;
    color: #171718;
  }

  .font-gray {
    font-size: 28px;
    font-weight: 500;
    line-height: 32px;
    color: #333;
  }

  .text-title {
    font-family: PingFang SC;
    font-size: 28px;
    line-height: 26px;
    color: #666666;
  }

  .section-house {
    padding: 14px;
    background: #f2f6ff;
    border-radius: 8px;
    flex: 1 1 198px;
  }

  .section-house:not(:first-child) {
    margin-left: 16px;
  }

  .section-implementation-progress {
    padding: 40px 32px;
    margin: 24px 30px 85px 30px;
    overflow: auto;
    background-color: #ffffff;
    border-radius: 16px;
    filter: drop-shadow(0px 0px 14px #0000000d);

    .bottom-gap {
      margin-bottom: 15px;
    }
  }
}
</style>
