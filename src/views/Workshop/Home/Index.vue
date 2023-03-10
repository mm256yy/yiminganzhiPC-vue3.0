<template>
  <WorkContentWrap>
    <div class="bigBox white">
      <ElRow :gutter="20">
        <ElCol :span="6" v-for="item in StatisticsData" :key="item.type">
          <div class="box">
            <div>
              <div class="ft21"
                >{{
                  item.type == 'PeasantHousehold'
                    ? '居民户'
                    : item.type == 'Company'
                    ? '企业'
                    : item.type == 'IndividualHousehold'
                    ? '个体工商'
                    : '村集体'
                }}总数</div
              >
              <div>
                <span class="ft43">{{ item.totalNum }}</span> <span>户</span></div
              >
            </div>
            <div class="shu"> </div>
            <div>
              <div
                >已上报<span class="red">{{ item.reportNum }}</span
                >户</div
              >
              <div
                >未上报<span class="red">{{ item.unReportNum }}</span
                >户</div
              >
              <div
                >我的上报<span class="red">{{ item.submitNum }}</span
                >户</div
              >
            </div>
          </div></ElCol
        >
      </ElRow>
    </div>

    <div class="bigBox" style="padding: 15px 0">
      <ElRow :gutter="20">
        <ElCol :span="8">
          <div class="echartBox">
            <div class="echartTitle">
              <img src="@/assets/imgs/Icon_workteam.png" alt="" width="24" />
              <span class="text">工作组TOP5</span>
            </div>
            <Echart :options="workOption" />
          </div>
        </ElCol>
        <ElCol :span="8">
          <div class="echartBox">
            <div class="echartTitle">
              <img src="@/assets/imgs/Icon_resident.png" alt="" width="24" />
              <span class="text">居民户分布</span>
            </div>
            <div style="margin-top: 50px">
              <Echart :options="residentOption" :height="268" />
            </div>
          </div>
        </ElCol>
        <ElCol :span="8">
          <div class="echartBox">
            <div class="echartTitle" style="margin-bottom: 10px">
              <img src="@/assets/imgs/Icon_report.png" alt="" width="24" />
              <span class="text">报告展示</span>
            </div>
            <ElTabs
              v-model="activeName"
              type="card"
              class="demo-tabs baogao"
              @tab-click="handleClick"
              :lazy="false"
            >
              <ElTabPane label="报告归集" name="报告归集">
                <div class="tabsBox">
                  <div class="tabsContentBox"
                    ><img src="@/assets/imgs/Icon_Report_disabled.png" alt="" width="24" />
                    <span>调查大纲</span>
                    <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r"
                  /></div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_abled.png" alt="" width="24" />
                    <span>蓄水验收设计报告</span>
                    <!-- <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" /> -->
                  </div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_abled.png" alt="" width="24" />
                    <span>调查报告</span>
                    <!-- <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" /> -->
                  </div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_abled.png" alt="" width="24" />
                    <span>规划报告</span>
                    <!-- <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" /> -->
                  </div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_abled.png" alt="" width="24" />
                    <span>导截流验收设计报告</span>
                    <!-- <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" /> -->
                  </div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_abled.png" alt="" width="24" />
                    <span>规划大纲</span>
                    <!-- <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" /> -->
                  </div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_abled.png" alt="" width="24" />
                    <span>设计变更报告</span>
                    <!-- <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" /> -->
                  </div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_disabled.png" alt="" width="24" />
                    <span>调查大纲</span>
                    <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" />
                  </div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_disabled.png" alt="" width="24" />
                    <span>调查大纲</span>
                    <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" />
                  </div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_disabled.png" alt="" width="24" />
                    <span>调查大纲</span>
                    <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" />
                  </div>
                </div>
              </ElTabPane>
              <ElTabPane label="数据归集" name="数据归集">
                <div class="tabsBox">
                  <div class="tabsContentBox"
                    ><img src="@/assets/imgs/Icon_Report_disabled.png" alt="" width="24" />
                    <span>调查大纲</span>
                    <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r"
                  /></div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_abled.png" alt="" width="24" />
                    <span>蓄水验收设计报告</span>
                    <!-- <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" /> -->
                  </div>
                </div></ElTabPane
              >
              <ElTabPane label="其他报告" name="其他报告">
                <div class="tabsBox">
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_abled.png" alt="" width="24" />
                    <span>蓄水验收设计报告</span>
                    <!-- <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" /> -->
                  </div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_abled.png" alt="" width="24" />
                    <span>调查大纲</span>
                    <!-- <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" /> -->
                  </div>
                  <div class="tabsContentBox" style="background: #f2f7ff"
                    ><img src="@/assets/imgs/Icon_Report_abled.png" alt="" width="24" />
                    <span>导截流验收设计报告</span>
                    <!-- <img src="@/assets/imgs/Icon_Upload.png" alt="" width="24" class="img_r" /> -->
                  </div>
                </div>
              </ElTabPane>
            </ElTabs>
          </div>
        </ElCol>
      </ElRow>
    </div>

    <div class="bigBox" style="padding: 15px 0">
      <ElRow :gutter="20">
        <ElCol :span="16">
          <div class="echartBox h400">
            <div class="echartTitle">
              <img src="@/assets/imgs/Icon_collect.png" alt="" width="24" />
              <span class="text">采集进度</span>
            </div>
            <Echart :options="gatherOption" :height="350" /> </div
        ></ElCol>
        <ElCol :span="8">
          <div class="echartBox h400">
            <div class="echartTitle">
              <img src="@/assets/imgs/Icon_news.png" alt="" width="24" />
              <span class="text">新闻通知</span>
            </div>
            <ElTabs v-model="activeName2" class="demo-tabs new" @tab-click="newhandleClick">
              <ElTabPane name="水库要闻" label="水库要闻">
                <div class="element">
                  <div class="listbox" v-for="item in newList" :key="item.id">
                    <img :src="item.coverPic" alt="" :width="107" style="height: 67px" />
                    <div class="text">
                      <div class="title">{{ item.title }}</div>
                      <div class="time">{{ item.releaseTime }}</div>
                    </div>
                  </div>
                  <div class="more">查看更多></div>
                </div>
              </ElTabPane>
              <ElTabPane label="政策法规" name="政策法规">
                <div class="element">
                  <div class="policylist" v-for="item in policyList" :key="item.id">
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
          </div></ElCol
        >
      </ElRow>
    </div>
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { ElRow, ElCol, ElTabs, ElTabPane } from 'element-plus'
import Echart from '@/components/Echart/src/Echart.vue'
// computed
import { ref } from 'vue'
import {
  getTOP10,
  homeStatistics,
  homeProgress,
  homeDistribution,
  getnewsList,
  getPolicyListApi
} from '@/api/home'
import Rank_1 from '@/assets/imgs/Rank_1.png'
import Rank_2 from '@/assets/imgs/Rank_2.png'
import Rank_3 from '@/assets/imgs/Rank_3.png'
import Rank_4 from '@/assets/imgs/Rank_4.png'
import Rank_5 from '@/assets/imgs/Rank_5.png'
// import { useDictStoreWithOut } from '@/store/modules/dict'
// const dictStore = useDictStoreWithOut()
// const dictObj = computed(() => dictStore.getDictObj)
const newList = ref<any>([])
const policyList = ref<any>([])
getnewsList({ size: 9999 }).then((res) => {
  console.log(res)

  newList.value = res.content
  newList.value.forEach((item) => {
    item.coverPic = item.coverPic ? JSON.parse(item.coverPic)[0].url : ''
  })
})
getPolicyListApi({ size: 9999 }).then((res) => {
  policyList.value = res.content
  // policyList.value.forEach((item) => {
  //   item.coverPic = item.coverPic ? JSON.parse(item.coverPic)[0].url : ''
  // })
})
const newhandleClick = () => {}

const StatisticsData = ref<any>([])
const top10List = ref<any>([])
getTOP10().then((res) => {
  top10List.value = res
  let ydata: any = []
  let seriesdata: any = []
  let seriesdata1: any = []
  res.forEach((item, index) => {
    if (index <= 4) {
      ydata.push(item.name)
      seriesdata.push(item.number)
      seriesdata1.push(item.todayNmber)
    }
  })
  workOption.value.yAxis[0].data = ydata
  workOption.value.series[0].data = seriesdata
  workOption.value.series[1].data = seriesdata1
})

homeStatistics().then((res) => {
  StatisticsData.value = res
})
const activeName = ref('报告归集')
const activeName2 = ref('水库要闻')
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
const workOption = ref({
  grid: {
    left: '15%',
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
        formatter: function (p, v) {
          console.log(v)

          if (p) {
            return `{img${v}|}` + p
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
          num: {
            width: 16,
            fontSize: 16,
            fontWeight: 800
          },
          name: {
            width: 16,
            fontSize: 16
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
      max: 5
    }
  ],
  series: [
    {
      name: '总上报',
      type: 'bar',

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
      barCateGoryGap: 11,
      data: [85, 74, 50, 45, 30],
      label: {
        show: true,
        position: 'right',
        valueAnimation: true
      }
    },
    {
      name: '今日上报',
      type: 'bar',

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
      barCateGoryGap: 11,
      data: [5, 3, 7, 4, 4],
      label: {
        show: true,
        position: 'right',
        valueAnimation: true
      }
    }
  ]
})

homeDistribution().then((res) => {
  let data: any = []
  res.forEach((item) => {
    data.push({ name: item.name, value: item.number })
  })
  residentOption.value.series[0].data = data
})

homeProgress().then((res) => {
  let xData: any = []
  let series0: any = []
  let series1: any = []
  res.forEach((item) => {
    xData.push(item.villageName)
    series0.push(item.totalNum)
    series1.push(item.reportNum)
  })
  gatherOption.value.xAxis.data = xData
  gatherOption.value.series[0].data = series0
  gatherOption.value.series[1].data = series1
})
// const progressData = ref({})
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
  xAxis: {
    type: 'category',
    data: ['行政村甲', '行政村乙', '行政村丙', '行政村丁', '行政村戊', '行政村己', '行政村庚']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '未采集',
      data: [100, 100, 50, 40, 30, 120, 140],
      type: 'bar',
      color: {
        type: 'linear',
        x: 0, //右
        y: 0, //下
        x2: 0, //左
        y2: 1, //上
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
    },
    {
      name: '已采集',
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      color: {
        type: 'linear',
        x: 0, //右
        y: 0, //下
        x2: 0, //左
        y2: 1, //上
        colorStops: [
          {
            offset: 0,
            color: 'rgba(113, 242, 185, 1)' // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(37, 197, 102, 1)' // 100% 处的颜色
          }
        ]
      }
    }
  ]
})
const handleClick = (val) => {
  console.log(val)
}
</script>
<style lang="less" scoped>
@import './Index.less';
</style>
