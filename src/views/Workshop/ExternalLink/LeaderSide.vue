<template>
  <div>
    <div class="data-fill">
      <!-- 左边内容 -->
      <div class="data-left data-common common-hegiht">
        <div
          class="data-left-header common-color"
          style="height: 178px; overflow: hidden; text-overflow: ellipsis"
        >
          <div class="data-left-header-tab">
            <div class="flex">
              <div class="line"></div>
              <div class="strong">项目概览</div></div
            >
            <div>
              <ElSelect
                clearable
                filterable
                v-model="reason"
                class="!w-full"
                @change="tabVillage"
                placeholder="全域"
                @clear="clearInput"
              >
                <ElOption
                  v-for="item in villageLists"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </ElSelect>
            </div>
          </div>
          <div class="direction">{{ landScreenDtoListObj.overview }}</div>
          <div></div>
        </div>
        <div class="data-left-bottom common-color">
          <div class="data-left-header-tab">
            <div class="flex">
              <div class="line"></div>
              <div class="strong">移民数智</div></div
            >
          </div>
          <div>
            <div class="data-left-header-tab-c">
              <div class="strong flex title-padding">
                <Icon icon="teenyicons:right-solid" style="color: #97b7ff" />永久用地</div
              >
              <div
                ><span class="num-color">{{ landScreenDtoListObj.totalArea }}</span
                >亩</div
              >
            </div>
            <div class="land data-left-header-tab-c">
              <div v-for="item in landList" :key="item.id" class="land-list">
                <div class="sub-title">{{ item.name }}</div>
                <div class="amount">{{ item.num }}<span class="sub-title">亩</span></div>
              </div>
            </div>
          </div>
          <div>
            <div class="data-left-header-tab">
              <div class="strong title-padding">
                <Icon icon="teenyicons:right-solid" style="color: #97b7ff" />人口</div
              >
            </div>
            <div class="data-left-header-tab-c">
              <div class="data-left-header-tab-c" style="width: 100%">
                <div class="data-left-header-tab-c">
                  <!-- <div class="icon-l icon-back"
                    ><Icon icon="healthicons:money-bag-outline" style="color: white" />
                  </div> -->
                  <img class="icon-back" src="@/assets/imgs/hushu.png" />
                  <div>
                    <div class="strong">{{ populationScreenDtoList[0] }}户</div>
                    <div class="sub-title">总户数</div>
                  </div>
                </div>
                <div class="data-left-header-tab-c" style="padding-right: 30px">
                  <!-- <div class="icon-r icon-back">
                    <Icon icon="material-symbols:person-add" style="color: white"
                  /></div> -->
                  <img class="icon-back" src="@/assets/imgs/caichan.png" />
                  <div>
                    <div class="strong">{{ populationScreenDtoList[2] }}户</div>
                    <div class="sub-title">财产户</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="data-left-header-tab-c" style="width: 100%; margin-top: 15px">
              <div class="data-left-header-tab-c">
                <!-- <div class="icon-l icon-back"
                  ><Icon icon="fluent:home-person-24-filled" style="color: white" />
                </div> -->
                <img class="icon-back" src="@/assets/imgs/ren.png" />
                <div>
                  <div class="strong">{{ populationScreenDtoList[1] }}户</div>
                  <div class="sub-title">总人数</div>
                </div>
              </div>
              <div>
                <div class="land data-left-header-tab-c land-fill">
                  <div
                    style="
                      display: flex;
                      height: 72px;
                      padding: 0 30px;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <div class="sub-title">农业</div>
                    <div class="amount" style="display: flex; align-items: center"
                      ><span>{{ populationScreenDtoList[3] }}</span
                      ><span class="sub-title">人</span></div
                    >
                  </div>
                  <div
                    style="
                      display: flex;
                      height: 72px;
                      padding: 0 30px;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <div class="sub-title">非农业</div>
                    <div class="amount" style="display: flex; align-items: center"
                      ><span>{{ populationScreenDtoList[4] }}</span
                      ><span class="sub-title">人</span></div
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="data-left-header-tab-c">
              <div class="strong title-padding">
                <Icon icon="teenyicons:right-solid" style="color: #97b7ff" />房屋</div
              >
            </div>
            <div class="land data-left-header-tab-c">
              <div v-for="item in houseList" :key="item.id" class="land-list">
                <div class="sub-title">{{ item.name }}</div>
                <div class="amount" style="padding-top: 10px"
                  >{{ (item.num / 10000).toFixed(2) }}<span class="sub-title">万m²</span></div
                >
              </div>
            </div>
          </div>
          <div>
            <div class="strong title-padding">
              <Icon icon="teenyicons:right-solid" style="color: #97b7ff" /> 企(事业单位)</div
            >
            <div class="data-left-header-tab-c">
              <div v-for="(item, index) in institutionsList" :key="index" class="flex">
                <!-- <div class="icon-back" :style="{ backgroundColor: item.background }">
                  <Icon
                    :icon="item.icon"
                    :style="{
                      color: item.color
                    }"
                /></div> -->
                <img class="icon-back" :src="item.url" />
                <div>
                  <div class="strong">{{ item.num }}家</div>
                  <div class="sub-title">{{ item.title }}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="data-left-header-tab-c">
              <div class="strong title-padding">
                <Icon icon="teenyicons:right-solid" style="color: #97b7ff" />主要专业项目</div
              >
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <div
                v-for="item in projectsList"
                :key="item.id"
                class="land-list"
                style="background-color: rgba(231, 237, 253, var(--tw-bg-opacity))"
              >
                <div class="sub-title">{{ item.name }}</div>
                <div class="sub-num">{{ item.num }}<span class="sub-title">m²</span></div>
              </div>
            </div>
          </div>
          <!-- <div class="icon-back back-color-o">
            <Icon icon="ph:buildings-fill" style="color: #97b7ff"
          /></div>
          <div class="icon-back back-color-t"
            ><Icon icon="solar:buildings-3-bold" style="color: #fd8746"
          /></div>
          <div class="icon-back back-color-s"
            ><Icon icon="icon-park-solid:building-four" style="color: #fd8746"
          /></div>
          <div class="icon-back back-color-f">
            <Icon icon="fluent:building-mosque-48-filled" style="color: #1ac5ab"
          /></div> -->
        </div>
      </div>
      <!-- 中间内容 -->
      <div class="data-center data-common common-hegiht">
        <div class="common-color" @click="goLink()">
          <img :src="VR" alt="背景图" style="width: 100%; height: 453px" />
        </div>
        <div class="common-color height-fill">
          <div class="data-left-header-tab" @click="handleClickItem(4)">
            <div class="data-left-header-tab">
              <div class="flex">
                <div class="line"></div>
                <div class="strong">新闻&法规</div></div
              >
            </div>
            <div class="toMore aliam-center">
              <div>查看更多</div>
              <Icon icon="ant-design:right-outlined" />
            </div>
          </div>
          <!-- <div class="tab-list">
            <div v-for="item in newsTabList" :key="item.value">
              {{ item.title }}
            </div>
          </div>
          <div class="news-list">
            <div class="list-item" v-for="item in newsList" :key="item.id">
              <img class="cover-img" :src="item.url" />
              <div class="content">
                <div class="news-title">{{ item.title }}</div>
                <div class="news-time">{{ item.createTime }}</div>
              </div>
            </div>
          </div> -->
          <ElTabs v-model="activeName2" class="demo-tabs news" @tab-click="newsHandleClick">
            <ElTabPane name="水库要闻" label="水库要闻">
              <div class="element news">
                <div class="list-box-left" v-if="newsList && newsList.length > 0">
                  <img class="cover-pic" :src="newsList[0].coverPic" />
                </div>
                <div class="list-box-right">
                  <div
                    class="text"
                    v-for="item in newsList"
                    :key="item.id"
                    @click="routerJump(`newDetail?id=${item.id}`)"
                  >
                    <div class="title">{{ item.title }}</div>
                    <div class="time">{{ item.releaseTime }}</div>
                  </div>
                </div>
              </div>
            </ElTabPane>
            <ElTabPane label="政策法规" name="政策法规">
              <div class="element">
                <div class="policy-list" v-for="item in policyList" :key="item.id">
                  <div class="title">
                    {{ item.title }}
                  </div>
                  <div class="time">
                    <span> {{ item.publicityTime }}</span>
                    <span>更多</span>
                  </div>
                </div>
              </div>
            </ElTabPane>
            <ElTabPane label="水库概况" name="水库概况">水库概况</ElTabPane>
            <ElTabPane label="建设历程" name="建设历程">建设历程</ElTabPane>
            <ElTabPane label="安置概况" name="安置概况">安置概况</ElTabPane>
            <ElTabPane label="水库风采" name="水库风采">水库风采</ElTabPane>
          </ElTabs>
        </div>
        <div class="common-color">
          <div class="data-left-header-tab" @click="handleClickItem(5)">
            <div class="data-left-header-tab">
              <div class="flex">
                <div class="line"></div>
                <div class="strong">消息反馈</div></div
              >
            </div>
            <div class="toMore aliam-center">
              <div>查看更多</div>
              <Icon icon="ant-design:right-outlined" />
            </div>
          </div>
          <div class="th-title">
            <div>问题内容</div>
            <div>提交人</div>
            <div>提交时间</div>
          </div>
          <div class="question-list">
            <div class="item" v-for="item in questionList" :key="item.id">
              <div class="name">{{ item.name }}</div>
              <div class="time">{{ item.createTime }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右边内容 -->
      <div class="data-right data-common common-hegiht">
        <div class="common-color">
          <div class="data-left-header-tab" @click="handleClickItem(2)">
            <div class="flex">
              <div class="line"></div>
              <div class="strong">资金管理</div></div
            >
            <div class="toMore aliam-center">
              <div>查看更多</div>
              <Icon icon="ant-design:right-outlined" />
            </div>
          </div>

          <!-- <div class="data-left-header-tab">
            <div v-for="item in fundList" :key="item.id" class="fund-list flex">
              <img :src="item.icon" alt="背景图" />
              <div>
                <div>{{ item.title }}</div>
                <div>{{ item.price }}</div>
              </div>
            </div>
          </div>
          <div class="flex" style="flex-flow: row wrap">
            <div v-for="item in fundTitleList" :key="item.id">
              <div>{{ item.name }}</div>
              <div>{{ item.price }}</div>
            </div></div
          > -->
          <div class="content-1 land land-fill">
            <div class="item">
              <img class="img" src="@/assets/imgs/home/icon_gszj.png" />
              <div class="content">
                <div class="sub-title">概算资金(万元)</div>
                <div class="amount">642,103</div>
              </div>
            </div>
            <div class="item" style="background-color: white">
              <img class="img" src="@/assets/imgs/icon_Hydrograph.png" />
              <div class="content">
                <div class="sub-title">累计使用(万元)</div>
                <div class="amount">380,000</div>
              </div>
            </div>
          </div>
          <div class="content-2">
            <!-- <div class="chart-1">
              <img class="img" src="@/assets/imgs/home/chart_sbt.png" />
            </div> -->
            <div class="chart-2">
              <div class="sub-title">本年计划资金(万元)</div>
              <div class="amount">100,000</div>
              <div class="sub-title">本年使用资金(万元)</div>
              <div class="amount">98,000</div>
            </div>
            <div class="chart-3 land land-fill">
              <div class="sub-title">概算内(万元)</div>
              <div class="amount">642,103</div>
              <div class="line"></div>
              <div class="sub-title">概算外(万元)</div>
              <div class="amount">80,000</div>
            </div>
          </div>
        </div>
        <div class="common-color" style="height: 480px">
          <div class="data-left-header-tab" @click="handleClickItem(3)">
            <div class="data-left-header-tab">
              <div class="flex">
                <div class="line"></div>
                <div class="strong">进度管理</div></div
              >
            </div>
            <div class="toMore aliam-center">
              <div>查看更多</div>
              <Icon icon="ant-design:right-outlined" />
            </div>
          </div>
          <!-- <div class="center">
            <div>实际进度</div>
            <div>计划进度</div>
          </div>
          <div v-for="item in scheduleList" :key="item.id" class="schedule">{{ item.name }} </div> -->
          <Echart :options="impProgressOption" :height="300" />
        </div>
        <div class="common-color" style="height: 120px" @click="handleClickItem(6)">
          <img :src="Reports" alt="背景图" />
        </div>
        <div class="common-color" @click="handleClickItem(1)" style="height: 120px">
          <img :src="Analysis" alt="背景图" />
        </div>
      </div>
    </div>
    <div> <bottomTarg /></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import fund from '@/assets/imgs/icon_fund.png'
// import Hydrograph from '@/assets/imgs/icon_Hydrograph.png'
import Analysis from '@/assets/imgs/Big_Data_Analysis.png'
import Reports from '@/assets/imgs/Smart_Reports.png'
import qiye from '@/assets/imgs/qiye.png'
// import ren from '@/assets/imgs/ren.png'
import gongshang from '@/assets/imgs/gongshang.png'
import station from '@/assets/imgs/station.png'
import tankuang from '@/assets/imgs/tankuang.png'
import VR from '@/assets/imgs/VR.png'
import { useRouter } from 'vue-router'
import Echart from '@/components/Echart/src/Echart.vue'
// import newsDef from '@/assets/imgs/home/news_def.png'
import bottomTarg from '../Home/components/bottomTarg.vue'
import {
  getLeadershipScreen,
  feedbackList,
  getVillageList
} from '@/api/AssetEvaluation/leader-side'
import { ElTabs, ElTabPane, ElSelect, ElOption } from 'element-plus'
import { getNewsList, getPolicyListApi } from '@/api/home'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const reason = ref()
const activeName2 = ref('水库要闻')
const newsList = ref<any>([])
const policyList = ref<any>([])
const leadershipScreenList = ref<any>({})
const populationScreenDtoList = ref<any>([])
const landScreenDtoList = ref<any>([])
const landScreenDtoListObj = ref<any>({})
const landScreenDtoListObjs = ref<any>({})
const paramsValue = ref<any>({})
const arr = ref<any>([])
const goLink = () => {
  let url = 'http://test-jinglingtoc.jldt.top/'
  window.open(url)
}
// 路由跳转
const routerJump = (path: string) => {
  push(path)
}
// const golink = () => {
//   push({
//     name: 'NewsList'
//   })
// }
// 点击新闻跳转
const newsHandleClick = () => {}
// 初始化获取新闻通知 -- 水库要闻列表数据
const initNewsData = () => {
  getNewsList({ size: 9999, sort: ['releaseTime', 'desc'], type: '1' }).then((res: any) => {
    newsList.value = res.content
    newsList.value.forEach((item: any) => {
      item.coverPic = item.coverPic ? JSON.parse(item.coverPic)[0].url : ''
    })
    // console.log('newsList：', newsList.value)
  })
}
// 初始化获取新闻通知 -- 政策法规列表数据
const initPolicyData = () => {
  getPolicyListApi({ size: 9999 }).then((res: any) => {
    policyList.value = res.content
    // policyList.value.forEach((item) => {
    //   item.coverPic = item.coverPic ? JSON.parse(item.coverPic)[0].url : ''
    // })
  })
}
const getList = async () => {
  if (reason.value) {
    paramsValue.value = { code: reason.value }
    const list = await getLeadershipScreen(paramsValue.value)
    leadershipScreenList.value = list
    const planList = ref<any>([])
    const actualList = ref<any>([])
    arr.value = []
    planList.value = []
    actualList.value = []
    list.progressManagementDto.forEach((item) => {
      arr.value.push(item.name)
      planList.value.push(item.plan)
      actualList.value.push(item.actual)
    })
    console.log(arr.value, planList.value, '111')
    impProgressOption.value.yAxis.data = arr.value
    impProgressOption.value.series[1].data = planList.value
    impProgressOption.value.series[0].data = actualList.value
    const professionalList = ref<any>([])
    const companyDtoList = ref<any>([])
    const houseScreenDtoList = ref<any>([])
    professionalList.value = Object.values(list.professionalProjectsDto)
    companyDtoList.value = Object.values(list.companyDto)
    houseScreenDtoList.value = Object.values(list.houseScreenDto)
    populationScreenDtoList.value = Object.values(list.populationScreenDto)

    landScreenDtoListObj.value = JSON.parse(JSON.stringify(list.landScreenDto))
    landScreenDtoListObjs.value = JSON.parse(JSON.stringify(list.landScreenDto))
    delete landScreenDtoListObjs.value.overview

    delete landScreenDtoListObjs.value.totalArea

    landScreenDtoList.value = Object.values(landScreenDtoListObjs.value)
    console.log(landScreenDtoList.value, '11111111111111')
    professionalList.value.forEach((item, index) => {
      projectsList.value[index].num = item
    })
    companyDtoList.value.forEach((item, index) => {
      delete companyDtoList.value[4]
      institutionsList.value[index].num = item
    })
    houseScreenDtoList.value.forEach((item, index) => {
      delete houseScreenDtoList.value[3]
      houseList.value[index].num = item
    })
    landScreenDtoList.value.forEach((item, index) => {
      delete landScreenDtoList.value[0]
      delete landScreenDtoList.value[4]
      landList.value[index].num = item
    })
  }
}

const feedback = async () => {
  const list = await feedbackList({})
  // console.log(list, '测试问题反馈列表')
  if (list.content.length > 0) {
    list.content.forEach((item, index) => {
      // questionList.value[i.value++].name = item.remark
      if (questionList.value[index]) {
        questionList.value[index].name = item.remark
      }
    })
  }
}
const villageLists = ref<any>([])
const villageList = async () => {
  villageLists.value = await getVillageList({})
}
const tabVillage = async () => {
  console.log(reason.value, '选中的code')
  appStore.setVillageCoder(reason.value)
  getList()
}
const clearInput = async () => {
  const list = await getLeadershipScreen({ code: undefined })
  leadershipScreenList.value = list
  const planList = ref<any>([])
  const actualList = ref<any>([])
  arr.value = []
  planList.value = []
  actualList.value = []
  list.progressManagementDto.forEach((item) => {
    arr.value.push(item.name)
    planList.value.push(item.plan)
    actualList.value.push(item.actual)
  })
  console.log(arr.value, planList.value, '111')
  impProgressOption.value.yAxis.data = arr.value
  impProgressOption.value.series[1].data = planList.value
  impProgressOption.value.series[0].data = actualList.value
  const professionalList = ref<any>([])
  const companyDtoList = ref<any>([])
  const houseScreenDtoList = ref<any>([])
  professionalList.value = Object.values(list.professionalProjectsDto)
  companyDtoList.value = Object.values(list.companyDto)
  houseScreenDtoList.value = Object.values(list.houseScreenDto)
  populationScreenDtoList.value = Object.values(list.populationScreenDto)
  landScreenDtoListObj.value = JSON.parse(JSON.stringify(list.landScreenDto))
  landScreenDtoListObjs.value = JSON.parse(JSON.stringify(list.landScreenDto))
  delete landScreenDtoListObjs.value.overview
  delete landScreenDtoListObjs.value.totalArea
  landScreenDtoList.value = Object.values(landScreenDtoListObjs.value)
  console.log(landScreenDtoList.value, '11111111111111')
  professionalList.value.forEach((item, index) => {
    projectsList.value[index].num = item
  })
  companyDtoList.value.forEach((item, index) => {
    delete companyDtoList.value[4]
    institutionsList.value[index].num = item
  })
  houseScreenDtoList.value.forEach((item, index) => {
    delete houseScreenDtoList.value[3]
    houseList.value[index].num = item
  })
  landScreenDtoList.value.forEach((item, index) => {
    delete landScreenDtoList.value[0]
    delete landScreenDtoList.value[4]
    if (landList.value[index]) {
      landList.value[index].num = item
    }
  })
}
onMounted(() => {
  clearInput()
  initNewsData()
  initPolicyData()
  feedback()
  villageList()
})

const impProgressOption = ref({
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
    left: '3%',
    right: '4%',
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
    data: []
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
      data: []
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
      data: []
    }
  ]
})
const { push } = useRouter()

const handleClickItem = (type: number) => {
  const pathMap = {
    1: 'adminSecondHome', // 大数据分析
    2: 'adminhomefund', //资金管理
    3: 'adminhomeprogress', //进度管理 //新闻管理
    4: 'Project', //新闻管理
    5: 'Feedback', //反馈管理
    6: 'SmartReport' // 智慧报表
  }
  console.log(pathMap[type], '测试')
  push({ name: pathMap[type] })
}
// const agricultureList = ref<any>([
//   {
//     id: 1,
//     name: '农业',
//     num: ''
//   },
//   {
//     id: 2,
//     name: '非农业',
//     num: ''
//   }
// ])
const landList = ref<any>([
  {
    id: 1,
    name: '水库淹没区',
    num: ''
  },
  {
    id: 2,
    name: '枢纽工程建设区',
    num: ''
  },
  {
    id: 3,
    name: '翰水工程建设区',
    num: ''
  }
])
const houseList = ref<any>([
  {
    id: 1,
    name: '总房屋面积',
    num: ''
  },
  {
    id: 2,
    name: '住宅房屋',
    num: ''
  },
  {
    id: 3,
    name: '村集体房屋',
    num: ''
  }
])
const projectsList = ref<any>([
  {
    id: 1,
    name: '四级公路',
    num: ''
  },
  {
    id: 2,
    name: '35KV电力线路',
    num: ''
  },
  {
    id: 3,
    name: '电信杆路',
    num: ''
  },
  {
    id: 4,
    name: '移动杆路',
    num: ''
  },
  {
    id: 5,
    name: '联通杆路',
    num: ''
  },
  {
    id: 6,
    name: '铁塔基站',
    num: ''
  },
  {
    id: 7,
    name: '广电杆路',
    num: ''
  },
  {
    id: 8,
    name: '溪西水文站',
    num: ''
  },
  {
    id: 9,
    name: '县级文保点',
    num: ''
  },
  {
    id: 10,
    name: '宗教设施',
    num: ''
  }
])
// const fundList = [
//   {
//     id: 1,
//     icon: fund,
//     title: '概算资金(万元)',
//     price: '500,000'
//   },
//   {
//     id: 2,
//     icon: Hydrograph,
//     title: '累计使用(万元)',
//     price: '380,000'
//   }
// ]
// const fundTitleList = [
//   {
//     id: 1,
//     name: '本年计划资金(万元)',
//     price: '1000,000'
//   },
//   {
//     id: 1,
//     name: '本年计划资金(万元)',
//     price: '1000,000'
//   },
//   {
//     id: 1,
//     name: '本年计划资金(万元)',
//     price: '1000,000'
//   },
//   {
//     id: 1,
//     name: '本年计划资金(万元)',
//     price: '1000,000'
//   }
// ]
// 新闻&法规 tab切换数据列表
// const newsTabList = [
//   { title: '水库要闻', value: 1 },
//   { title: '水库概况', value: 2 },
//   { title: '政策法规', value: 3 },
//   { title: '建设历程', value: 4 },
//   { title: '安置概况', value: 5 },
//   { title: '水库风采', value: 6 }
// ]

const institutionsList = ref<any>([
  {
    title: '企业',
    num: 4,
    icon: 'ph:buildings-fill',
    color: '#97b7ff',
    background: '#e3f0ff',
    url: qiye
  },
  {
    title: '水电站',
    num: 9,
    icon: 'solar:buildings-3-bold',
    color: '#fd8746',
    background: '#ffefea',
    url: station
  },
  {
    title: '个体工商户',
    num: 476,
    icon: 'icon-park-solid:building-four',
    color: '#fd8746',
    background: '#fff4d9',
    url: gongshang
  },
  {
    title: '探矿权',
    num: 2,
    icon: 'fluent:building-mosque-48-filled',
    color: '#1ac5ab',
    background: '#d8f4ee',
    url: tankuang
  }
])
// const newsList = [
//   {
//     id: 1,
//     title: '投资超125亿！镜岭水库移民安置规划公布，1.2万余人将被安置',
//     url: newsDef,
//     createTime: '2023/4/28'
//   },
//   {
//     id: 2,
//     title: '浙江镜岭水库工程建设征地移民安置规划，通过审查！',
//     url: newsDef,
//     createTime: '2023/3/2'
//   },
//   {
//     id: 3,
//     title: '浙江镜岭水库工程是国家2023年计划开工的60项重点水利工程之一',
//     url: newsDef,
//     createTime: '2023/2/20'
//   }
// ]
const questionList = ref<any>([
  {
    id: 1,
    name: '关于零星林果木补偿费谈判遇阻',
    createTime: '2023/4/1'
  },
  {
    id: 2,
    name: '少算坟墓补助',
    createTime: '2023/2/20'
  },
  {
    id: 3,
    name: '建房困难补助怎么算',
    createTime: '2023/2/11'
  },
  {
    id: 4,
    name: '我投靠亲友怎么算钱',
    createTime: '2023/2/1'
  },
  {
    id: 5,
    name: '能不能选两个安置点',
    createTime: '2023/1/1'
  }
])
</script>
<style lang="less" scoped>
@import '../Home/Index.less';

.data-left-header-tab {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
}

.data-left-header-tab-c {
  display: flex;
  justify-content: space-between;
}

.arround {
  display: flex;
  justify-content: space-around;
}

.common-hegiht {
  // height: 105vh;
  // overflow: auto;
}

.common-color {
  width: 98%;
  padding: 10px;
  margin: 10px auto;
  cursor: pointer;
  background-color: aliceblue;
  border-radius: 5px;
}

.flex {
  display: flex;
  align-items: center;
}

.toMore {
  color: #666666;
}

.center {
  display: flex;
  justify-content: center;
}

.aliam-center {
  display: flex;
  align-items: center;
}

.title-padding {
  padding: 18px 2px;
  font-size: 14px;
}

.data-fill {
  display: flex;
  width: 100%;
  margin: 0 auto;
  justify-content: space-between;
  // height: 120vh;
  .data-common {
    width: 35%;
    // background-color: aquamarine;
  }

  .land {
    background-color: rgba(231, 237, 253, var(--tw-bg-opacity));
    // padding: 16px;
    border-radius: 2px;
  }
}

.strong {
  font-weight: bolder;
}

.schedule {
  padding: 8px 0;
}

.icon-back {
  display: flex;
  width: 50px;
  height: 50px;
  margin-right: 8px;
  justify-content: center;
  align-items: center;
}

.back-color-o {
  background-color: #e3f0ff;
}

.back-color-t {
  background-color: #ffefea;
}

.back-color-s {
  background-color: #fff4d9;
}

.back-color-f {
  background-color: #d8f4ee;
}

.line {
  width: 4px;
  height: 14px;
  margin-right: 8px;
  background: #3e73ec;
}

.tab-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;

  .tab-item {
    font-size: 14px;
    color: #666666;
    cursor: pointer;

    &.active {
      color: #0a54ff;
      border-bottom: 2px solid #0a54ff;
    }
  }
}

.news-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 418px;

  .list-item {
    display: flex;
    width: 418px;
    padding: 4px 0;
    border-bottom: 1px solid #ebebeb;
    box-sizing: border-box;
    align-items: center;

    .cover-img {
      width: 80px;
      height: 50px;
      margin-right: 10px;
    }

    .content {
      width: 328px;

      .news-title {
        width: 328px;
        overflow: hidden;
        font-size: 16px;
        color: #333;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .news-time {
        height: 23px;
        font-size: 14px;
        color: #999;
      }
    }
  }
}

.th-title {
  display: flex;
  height: 36px;
  padding: 0 10px;
  font-weight: bold;
  background: #f2f6ff;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
}

.question-list {
  .item {
    display: flex;
    height: 44px;
    padding: 0 10px;
    border-bottom: 1px solid #ebebeb;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;

    .name {
      font-size: 14px;
      color: #131313;
    }

    .time {
      font-size: 14px;
      color: rgba(19, 19, 19, 0.4);
    }
  }
}

.content-1 {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .item {
    display: flex;
    width: 50%;
    height: 90px;
    padding: 15px;
    // background: #f2f6ff;
    border-radius: 4px;
    box-sizing: border-box;
    align-items: center;

    .img {
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }

    .amount {
      padding-top: 10px;
      font-size: 30px;
      color: #333;
    }

    .content {
      .sub-title {
        font-size: 14px;
        line-height: 1;
        color: #666666;
      }
    }
  }
}

.content-2 {
  display: flex;
  height: 140px;
  padding: 0 14px;
  margin-top: 20px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;

  .chart-1 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 102px;
    height: 100%;

    .img {
      width: 102px;
      height: 102px;
    }
  }

  .chart-2 {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 140px;
    height: 100%;
    margin: 0 14px;

    .sub-title {
      font-size: 14px;
      line-height: 1;
      color: #666666;
    }

    .amount {
      font-size: 24px;
      color: #333;
    }
  }

  .chart-3 {
    width: 150px;
    height: 100%;
    padding: 14px 30px;
    // background: #f3f7ff;
    border-radius: 4px;
    box-sizing: border-box;

    .sub-title {
      margin-bottom: 5px;
      font-size: 14px;
      line-height: 1;
      color: #666666;
    }

    .amount {
      font-family: DIN-Regular, DIN;
      font-size: 18px;
      color: #1d2129;
    }

    .line {
      width: 80px;
      height: 1px;
      margin: 10px 0;
      background: #dddddd;
    }
  }
}

.sub-title {
  font-size: 14px;
  line-height: 1;
  color: #666666;
}

.sub-num {
  padding-top: 10px;
  font-size: 18px;
  color: #333;
}

.amount {
  font-size: 24px;
  color: #333;
}

.icon-l {
  width: 44px;
  height: 44px;
  background: linear-gradient(180deg, #ff6e65 0%, #ffc165 0%, #fc4444 100%);
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
  box-shadow: 0px 6px 12px -5px rgba(255, 46, 46, 0.38);
}

.icon-r {
  width: 44px;
  height: 44px;
  background-color: #840aff;
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
}

.icon-s {
  width: 44px;
  height: 44px;
  background: linear-gradient(180deg, #5cebff 0%, #3c74f6 100%);
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
  box-shadow: 0px 6px 9px -4px rgba(10, 84, 255, 0.39);
}

.num-color {
  font-size: 24px;
  color: #3e73ec;
}

.land-list {
  display: flex;
  // background-color: rgba(231, 237, 253, var(--tw-bg-opacity));
  width: calc((100%) / 5); // 这里的10px = (分布个数3-1)*间隙5px, 可以根据实际的分布个数和间隙区调整
  height: 80px;
  // max-width: calc((100%) / 5); // 加入这两个后每个item的宽度就生效了
  min-width: calc((100%) / 5); // 加入这两个后每个item的宽度就生效了
  // padding-left: 10px;
  margin-bottom: 8px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // border-right: 1px solid gray;
}

.direction {
  overflow: hidden; //超出隐藏
  font-size: 14px;
  color: #666666;
  text-indent: 2em;
  text-overflow: ellipsis; //超出显示...
  white-space: wrap; //设置文字不换行
}

.height-fill {
  height: 253px;
}
</style>
