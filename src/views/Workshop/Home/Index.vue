<template>
  <div class="home-wrap">
    <!-- <ScaleBox> -->
    <div class="big-box big-box-1 bg-white">
      <div
        class="big-box-container"
        v-for="item in statisticsData"
        :key="item.type"
        @click="toLink(item.type)"
      >
        <div class="content-box-left">
          <div class="ft-16">
            {{
              item.type == 'PeasantHousehold'
                ? '居民户'
                : item.type == 'Company'
                ? '企业'
                : item.type == 'IndividualHousehold'
                ? '个体工商'
                : '村集体'
            }}
          </div>
          <div>
            <span class="ft-32">{{ item.totalNum }}</span> <span class="ft-16">户</span>
          </div>
        </div>

        <div class="content-box-right">
          <div class="text-box">
            <div class="ft-14">已报</div>
            <div class="ft-20">{{ item.reportNum }}</div>
          </div>
          <div class="text-box">
            <div class="ft-14">未报</div>
            <div class="ft-20">{{ item.unReportNum }}</div>
          </div>
          <div class="text-box">
            <div class="ft-14" style="margin-right: 0">我的</div>
            <div class="ft-20">{{ item.submitNum }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="big-box big-box-2">
      <div class="echart-box">
        <div class="echart-title">
          <img src="@/assets/imgs/Icon_workteam.png" width="15" />
          <div class="text">工作组TOP5</div>
        </div>
        <div class="demo-tabs tabs-wrapper top5" style="padding-top: 10px">
          <ElButton
            class="mright"
            :class="activeName3 === '累计' ? 'is-active' : ''"
            @click="handleClick2('累计')"
            >累计</ElButton
          >
          <ElButton :class="activeName3 === '今日' ? 'is-active' : ''" @click="handleClick2('今日')"
            >今日</ElButton
          >
        </div>
        <Echart :options="workOption" :height="250" />
      </div>

      <div class="echart-box">
        <div class="echart-title">
          <img src="@/assets/imgs/Icon_resident.png" width="15" />
          <span class="text">居民户分布</span>
        </div>
        <div style="margin-top: 30px">
          <Echart :options="residentOption" :height="190" />
        </div>
      </div>

      <div class="report-box bg-white">
        <div class="echart-title">
          <img src="@/assets/imgs/Icon_report.png" width="15" />
          <span class="text">报告展示</span>
        </div>
        <ElTabs
          v-model="activeName"
          type="card"
          class="demo-tabs tabs-wrapper"
          @tab-click="handleClick"
          :lazy="false"
        >
          <ElTabPane label="报告归集" name="报告归集">
            <div class="tabs-box">
              <view class="tabs-box-left">
                <div
                  class="tabs-content-box"
                  @click="routerJump(`/workshop/report?type=${ReportTypes.Outline}&title=调查大纲`)"
                >
                  <img
                    v-if="reportResult.Outline"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>调查大纲</span>
                  <img
                    v-if="!reportResult.Outline"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="routerJump(`/workshop/report?type=${ReportTypes.Report}&title=调查报告`)"
                >
                  <img
                    v-if="reportResult.Report"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>调查报告</span>
                  <img
                    v-if="!reportResult.Report"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(
                      `/workshop/report?type=${ReportTypes.PlanningOutline}&title=规划大纲`
                    )
                  "
                >
                  <img
                    v-if="reportResult.PlanningOutline"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>规划大纲</span>
                  <img
                    v-if="!reportResult.PlanningOutline"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(`/workshop/report?type=${ReportTypes.PlanningReport}&title=规划报告`)
                  "
                >
                  <img
                    v-if="reportResult.PlanningReport"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>规划报告</span>
                  <img
                    v-if="!reportResult.PlanningReport"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(
                      `/workshop/changeReport?type=${ReportTypes.Change}&title=设计变更报告`
                    )
                  "
                >
                  <img
                    v-if="reportResult.Change"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>设计变更报告</span>
                  <img
                    v-if="!reportResult.Change"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
              </view>
              <view class="middle" />
              <view class="tabs-box-right">
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(
                      `/workshop/report?type=${ReportTypes.Models}&title=导截流验收设计报告`
                    )
                  "
                >
                  <img
                    v-if="reportResult.Models"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>导截流验收设计报告</span>
                  <img
                    v-if="!reportResult.Models"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(
                      `/workshop/report?type=${ReportTypes.WaterStorage}&title=蓄水验收设计报告`
                    )
                  "
                >
                  <img
                    v-if="reportResult.WaterStorage"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>蓄水验收设计报告</span>
                  <img
                    v-if="!reportResult.WaterStorage"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(
                      `/workshop/report?type=${ReportTypes.Completion}&title=竣工验收设计报告`
                    )
                  "
                >
                  <img
                    v-if="reportResult.Completion"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>竣工验收设计报告</span>
                  <img
                    v-if="!reportResult.Completion"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
              </view>
            </div>
          </ElTabPane>
          <ElTabPane label="其他报告" name="其他报告">
            <div class="tabs-box">
              <div class="tabs-box-left">
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(
                      `/workshop/report?type=${ReportTypes.SocialStability}&title=社稳报告`
                    )
                  "
                >
                  <img
                    v-if="reportResult.SocialStability"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>社稳报告</span>
                  <img
                    v-if="!reportResult.SocialStability"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(`/workshop/report?type=${ReportTypes.Disaster}&title=地灾评估`)
                  "
                >
                  <img
                    v-if="reportResult.Disaster"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>地灾评估</span>
                  <img
                    v-if="!reportResult.Disaster"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="routerJump(`/workshop/report?type=${ReportTypes.Site}&title=安置点祥归`)"
                >
                  <img
                    v-if="reportResult.Site"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>安置点祥归</span>
                  <img
                    v-if="!reportResult.Site"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(`/workshop/report?type=${ReportTypes.Enterprise}&title=企事业单位`)
                  "
                >
                  <img
                    v-if="reportResult.Enterprise"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>企(事)业单位</span>
                  <img
                    v-if="!reportResult.Enterprise"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(
                      `/workshop/professionalReport?type=${ReportTypes.ProfessionalProject}&title=专业项目`
                    )
                  "
                >
                  <img
                    v-if="reportResult.ProfessionalProject"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>专业项目</span>
                  <img
                    v-if="!reportResult.ProfessionalProject"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
              </div>
              <div class="middle"></div>
              <div class="tabs-box-right">
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(
                      `/workshop/professionalReport?type=${ReportTypes.Clean}&title=库底清理`
                    )
                  "
                >
                  <img
                    v-if="reportResult.Clean"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>库底清理</span>
                  <img
                    v-if="!reportResult.Clean"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="routerJump(`/workshop/report?type=${ReportTypes.Land}&title=土地报批`)"
                >
                  <img
                    v-if="reportResult.Land"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>土地报批</span>
                  <img
                    v-if="!reportResult.Land"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(`/workshop/report?type=${ReportTypes.Woodland}&title=林地可研`)
                  "
                >
                  <img
                    v-if="reportResult.Woodland"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>林地可研</span>
                  <img
                    v-if="!reportResult.Woodland"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
                <div
                  class="tabs-content-box"
                  @click="routerJump(`/workshop/report?type=${ReportTypes.Other}&title=其他`)"
                >
                  <img
                    v-if="reportResult.Other"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>其他</span>
                  <img
                    v-if="!reportResult.Other"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
              </div>
            </div>
          </ElTabPane>
          <ElTabPane label="实物成果" name="实采批复">
            <div class="tabs-box">
              <div class="tabs-box-left">
                <div
                  class="tabs-content-box"
                  @click="
                    routerJump(
                      `/workshop/report?type=${ReportTypes.ConfirmPhysicalApproval}&title=实物采集确认批复`
                    )
                  "
                >
                  <img
                    v-if="reportResult.ConfirmPhysicalApproval"
                    src="@/assets/imgs/Icon_Report_abled.png"
                    width="15"
                  />
                  <img v-else src="@/assets/imgs/Icon_Report_disabled.png" width="15" />
                  <span>实物成果确认函</span>
                  <img
                    v-if="!reportResult.ConfirmPhysicalApproval"
                    src="@/assets/imgs/Icon_Upload.png"
                    width="15"
                    class="img_r"
                  />
                </div>
              </div>
              <div class="middle"></div>
              <div class="tabs-box-right"></div>
            </div>
          </ElTabPane>
        </ElTabs>
      </div>
    </div>

    <div class="big-box big-box-3">
      <div class="left bg-white">
        <div class="echart-title w-729">
          <img src="@/assets/imgs/Icon_collect.png" width="15" />
          <span class="text">采集进度</span>
        </div>
        <Echart :options="gatherOption" :height="192" />
      </div>
      <div class="right bg-white">
        <div class="echart-title w-613">
          <img src="@/assets/imgs/Icon_news.png" width="15" />
          <span class="text">新闻通知</span>
        </div>
        <ElTabs v-model="activeName2" class="demo-tabs news" @tab-click="newsHandleClick">
          <ElTabPane
            v-for="(item, index) in newsTypes"
            :label="item.label"
            :key="index"
            :name="item.value"
          />
        </ElTabs>
        <div class="news_info" v-loading="panelLoading">
          <div v-for="item in newsList" :key="item.id" class="news_li" @click="checkNews(item)">
            <div class="news_li_l">
              <div class="li_l_top">{{ item.title }}</div>
              <div class="li_l_bom">{{ item.releaseTime.replace(/-/g, '/') }}</div>
            </div>
            <div class="news_li_logo">
              <img v-if="item.url" class="cover-pic" :src="item.url" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ElDialog
      :title="dialogTitle"
      v-model="contentDialog"
      :width="800"
      @close="contentDialog = false"
      alignCenter
      appendToBody
    >
      <div v-html="content"></div>
    </ElDialog>
  </div>
</template>
<script lang="ts" setup>
// import ScaleBox from './ScaleBox.vue'
import { ElTabs, ElTabPane, ElButton, ElDialog } from 'element-plus'
import Echart from '@/components/Echart/src/Echart.vue'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { listDictDetailApi } from '@/api/sys/index'

// computed
import { ref, onMounted } from 'vue'
import {
  getTopTen,
  homeStatistics,
  homeProgress,
  homeDistribution,
  getNewsList,
  getPolicyListApi,
  getReportNumber
} from '@/api/home'
import { ReportTypes } from './type'
import Rank_1 from '@/assets/imgs/Rank_1.png'
import Rank_2 from '@/assets/imgs/Rank_2.png'
import Rank_3 from '@/assets/imgs/Rank_3.png'
import Rank_4 from '@/assets/imgs/Rank_4.png'
import Rank_5 from '@/assets/imgs/Rank_5.png'
import { useAppStore } from '@/store/modules/app'

const { push } = useRouter()
const dictName = 'news' // 字典名称
const appStore = useAppStore()
const newsList = ref<any>([])
const policyList = ref<any>([])
const activeName = ref('报告归集')
const activeName2 = ref('水库要闻')
const activeName3 = ref('累计')
const reportData = ref<any>([]) // 报告列表
const newsTypes = ref<any[]>([])
const panelLoading = ref<boolean>(false)
const contentDialog = ref<boolean>(false)
const content = ref<string>() // 文章内容
const dialogTitle = ref<string>('')

const reportResult = ref<any>({
  Outline: false,
  Report: false,
  PlanningOutline: false,
  PlanningReport: false,
  Change: false,
  ChangeSon: false,
  Models: false,
  WaterSotrage: false,
  Completion: false,
  SocialStability: false,
  Disaster: false,
  Site: false,
  Enterprise: false,
  Land: false,
  WoodLand: false,
  Other: false,
  ProfessionalProject: false,
  Clean: false,
  ConfirmPhysicalApproval: false
})

// 初始化获取新闻通知 -- 水库要闻列表数据
const initNewsData = (type = '1') => {
  panelLoading.value = true
  getNewsList({ size: 9999, sort: ['releaseTime', 'desc'], type }).then(
    (res: any) => {
      newsList.value = res.content
      newsList.value.forEach((item: any) => {
        item.coverPic = item.coverPic ? JSON.parse(item.coverPic)[0].url : ''
      })
      panelLoading.value = false
    },
    (err) => {
      console.log('err', err)
      panelLoading.value = false
    }
  )
}

const checkNews = (item: any) => {
  content.value = item.content
  dialogTitle.value = item.title
  contentDialog.value = true
}

const getNewsDict = async () => {
  const res = await listDictDetailApi({
    name: dictName,
    projectId: appStore.getCurrentProjectId
  })
  if (res && res.dictValList) {
    newsTypes.value = res.dictValList
    activeName2.value = newsTypes.value[0]?.value // 默认选中
  }
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

// 初始化获取统计数据
const initHomeStatisticsData = () => {
  homeStatistics().then((res: any) => {
    statisticsData.value = res
  })
}

// 居民户分布图表初始化数据
const residentOption = ref({
  // title: {
  //   text: 'Referer of a Website',
  //   subtext: 'Fake Data',
  //   left: 'center'
  // },
  tooltip: {
    trigger: 'item'
  },
  // legend: {
  //   orient: 'vertical',
  //   left: 'left'
  // },
  series: [
    {
      name: '居民户分布',
      type: 'pie',
      radius: ['40%', '80%'],
      data: [
        { value: 735, name: '淹没区' },
        { value: 580, name: '建设区' },
        { value: 484, name: '影响区' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        normal: {
          show: true,
          formatter: '{b}\n{d}%'
        }
      }
    }
  ]
})
// 点击新闻跳转
const newsHandleClick = (pane: any, _ev?: Event) => {
  initNewsData(pane.props.name)
}

const statisticsData = ref<any>([])
// 获取前十的数据
const seriesdata = ref<any>([])
const seriesdata2 = ref<any>([])
const ydataName = ref<any>([])
const initTopTenData = async () => {}
const handleClick2 = (type: string) => {
  activeName3.value = type
  if (type == '今日') {
    onToday()
    workOption.value.series[0].name = '今日'
  } else {
    onAll()
    workOption.value.series[0].name = '累计'
  }
}

// 工作组TOP5图表初始化数据
const workOption = ref({
  grid: {
    left: '32%',
    top: '2%'
  },
  tooltip: {
    trigger: 'item'
  },
  xAxis: {
    show: false,
    type: 'value'
  },
  yAxis: [
    {
      type: 'category',
      inverse: true,
      axisLabel: {
        verticalAlign: 'middle',
        formatter: function (p, v) {
          if (p) {
            return `{img${v}|}{name|${p}}`
          }
        },
        rich: {
          img0: {
            backgroundColor: {
              image: Rank_1
            },
            width: 20,
            height: 20
          },
          img1: {
            backgroundColor: {
              image: Rank_2
            },
            width: 20,
            height: 20
          },
          img2: {
            backgroundColor: {
              image: Rank_3
            },
            width: 20,
            height: 20
          },
          img3: {
            backgroundColor: {
              image: Rank_4
            },
            width: 20,
            height: 20
          },
          img4: {
            backgroundColor: {
              image: Rank_5
            },
            width: 20,
            height: 20
          },
          name: {
            width: 80,
            fontSize: 14
          }
        },
        textStyle: {
          margin: 15,
          color: 'rgba(51, 51, 51, 1)',
          fontSize: '12'
        }
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      data: ['陈汉林', '梁柏林', '董化杰', '潘永浩', '董羽坤'],
      max: 4
    }
  ],
  series: [
    {
      name: '累计',
      type: 'bar',
      symbol: 'triangle',
      color: {
        type: 'linear',
        x: 0, //右
        y: 0, //下
        x2: 1, //左
        y2: 0, //上
        colorStops: [
          {
            offset: 0,
            color: 'rgba(255, 197, 61, 0.30)' // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(250, 173, 20, 1)' // 100% 处的颜色
          }
        ]
      },
      barWidth: 10,
      data: [85, 74, 50, 45, 30],
      label: {
        show: true,
        position: 'right',
        valueAnimation: true
      }
    }
  ]
})

homeDistribution().then((res: any) => {
  let data: any = []
  res.forEach((item: any) => {
    data.push({ name: item.name, value: item.number })
  })
  residentOption.value.series[0].data = data
})

// 采集进度图标初始化数据
const gatherOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    //   指示框名字  注意！要和下方series中的name一起改
    data: ['未采集', '已采集'],
    // 指示框位置  距离上下左右多少
    right: '10%',
    top: '5%',
    textStyle: {
      color: '#4F4F4F' //字体颜色
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['行政村甲', '行政村乙', '行政村丙', '行政村丁', '行政村戊', '行政村己', '行政村庚']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '已采集',
      data: [100, 120, 300, 200, 150, 210, 230],
      type: 'bar',
      barWidth: 45,
      stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: 'rgba(113, 182, 185, 1)' // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(37, 197, 102, 1)' // 100% 处的颜色
          }
        ]
      }
    },
    {
      name: '未采集',
      data: [120, 130, 250, 210, 180, 110, 290],
      type: 'bar',
      barWidth: 45,
      stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: 'rgba(22, 208, 255, 1)' // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(0, 102, 255, 1)' // 100% 处的颜色
          }
        ]
      }
    }
  ]
})

// 初始化获取采集进度数据
const initGatherProgressData = () => {
  homeProgress().then((res: any) => {
    let xData: any = []
    let series_0: any = []
    let series_1: any = []
    res.forEach((item: any) => {
      xData.push(item.villageName)
      series_0.push(item.reportNum)
      series_1.push(item.unReportNum)
    })
    gatherOption.value.xAxis.data = xData
    gatherOption.value.series[0].data = series_0
    gatherOption.value.series[1].data = series_1
  })
}

// 初始化获取报告展示数据（报告是否上传及个数）
const initReportData = () => {
  getReportNumber().then((res: any) => {
    reportData.value = res
    getReportResult()
  })
}

/**
 * 是否有报告
 * @param type 报告类型
 */
const getReportResult = () => {
  if (reportData.value && reportData.value.length > 0) {
    reportData.value.map((item: any) => {
      if (item.number > 0) {
        reportResult.value[item.type] = true
      } else {
        reportResult.value[item.type] = false
      }
    })
  }
}

const handleClick = (val: any) => {
  console.log(val)
}

// 路由跳转
const routerJump = (path: string) => {
  push(path)
}

let metype = ref('')

// 统计数据页面跳转
const toLink = (type: string) => {
  const permissionStore = usePermissionStore()
  permissionStore.getRouters?.map((item) => {
    if (item.path === '/WorkshopCheck' || item.path === '/Workshop') {
      metype.value = item.path
    }
  })
  if (type === 'PeasantHousehold') {
    if (metype.value === '/Workshop') {
      routerJump('/Workshop/Landlord')
    } else {
      routerJump('/WorkshopCheck/LandlordCheck')
    }
  } else if (type === 'Company') {
    if (metype.value === '/Workshop') {
      routerJump('/Workshop/Enterprise')
    } else {
      routerJump('/WorkshopCheck/EnterpriceCheck')
    }
  } else if (type === 'IndividualHousehold') {
    if (metype.value === '/Workshop') {
      routerJump('/Workshop/IndividualB')
    } else {
      routerJump('/WorkshopCheck/IndividualBCheck')
    }
  } else {
    // routerJump('/Workshop/villageInfoC')
    if (metype.value === '/Workshop') {
      routerJump('/Workshop/VillageCollective')
    } else {
      routerJump('/WorkshopCheck/VillageCollectiveCheck')
    }
  }
}

onMounted(async () => {
  onAll()
  getNewsDict()
  initHomeStatisticsData()
  initTopTenData()
  initGatherProgressData()
  initReportData()
  initNewsData()
  initPolicyData()
})
const onToday = async () => {
  let data2: any = []

  data2 = await getTopTen('today')
  ydataName.value = []
  seriesdata2.value = []
  data2.forEach((item: any, index: number) => {
    if (index <= 4) {
      ydataName.value.push(item.name)
      seriesdata2.value.push(item.number)
    }
  })
  workOption.value.series[0].data = seriesdata2.value
  workOption.value.yAxis[0].data = ydataName.value
}
const onAll = async () => {
  let data: any = []

  data = await getTopTen('')
  ydataName.value = []
  seriesdata.value = []
  data.forEach((item: any, index: number) => {
    if (index <= 4) {
      ydataName.value.push(item.name)
      seriesdata.value.push(item.number)
    }
  })
  workOption.value.series[0].data = seriesdata.value
  workOption.value.yAxis[0].data = ydataName.value
}
</script>
<style lang="less" scoped>
@import './Index.less';

.home-wrap {
  margin: -6px 0 -16px;
}

:deep(.rounded-8px) {
  border-radius: 0;
}

.is-active {
  color: #2f72fe !important;
  background: #f2f6ff;
  border: 1px solid #2f72fe !important;
}

.mright {
  margin-right: -4px;
}
.news_info {
  display: flex;
  flex-wrap: wrap;

  .news_li:nth-of-type(1) {
    margin-top: 16px;
    margin-bottom: 28px;
  }

  .news_li:nth-of-type(2) {
    margin-top: 16px;
    margin-bottom: 28px;
  }

  .news_li {
    display: flex;
    flex: 1;

    .li_l_top {
      width: 158px;
      height: 40px;
      margin-bottom: 5px;
      font-size: 14px;

      font-weight: 500;
      color: #333333;
    }

    .li_l_bom {
      font-size: 14px;

      font-weight: 400;
      line-height: 20px;
      color: #999999;
    }

    .news_li_logo {
      width: 99px;
      height: 65px;
      // background: red;
      margin-left: 10px;

      .cover-pic {
        width: 99px;
        height: 65px;
      }
    }
  }
}
</style>
