<template>
  <div class="home-wrapper">
    <div class="home-main">
      <div class="col">
        <div class="row row-1">
          <div class="title"> <div class="line"></div>移民概况 </div>
          <div class="list">
            <div class="item">
              <img src="@/assets/imgs/home/icon_jmh.png" class="icon" />
              <div class="content">
                <div class="num">4,961<span class="unit">户</span></div>
                <div class="sub-title">居民户</div>
              </div>
            </div>
            <div class="item">
              <img src="@/assets/imgs/home/icon_ymrk.png" class="icon" />
              <div class="content">
                <div class="num">12065<span class="unit">人</span></div>
                <div class="sub-title">移民人口</div>
              </div>
            </div>
            <div class="item">
              <img src="@/assets/imgs/home/icon_gth.png" class="icon" />
              <div class="content">
                <div class="num">476<span class="unit">个</span></div>
                <div class="sub-title">个体户</div>
              </div>
            </div>
            <div class="item">
              <img src="@/assets/imgs/home/icon_qsydw.png" class="icon" />
              <div class="content">
                <div class="num">15<span class="unit">个</span></div>
                <div class="sub-title">企(事)业单位</div>
              </div>
            </div>
            <div class="item">
              <img src="@/assets/imgs/home/icon_jmh.png" class="icon" />
              <div class="content">
                <div class="num">10<span class="unit">个</span></div>
                <div class="sub-title">村集体</div>
              </div>
            </div>
            <div class="item">
              <img src="@/assets/imgs/home/icon_jmh.png" class="icon" />
              <div class="content">
                <div class="num">7<span class="unit">项</span></div>
                <div class="sub-title">专业项目</div>
              </div>
            </div>
          </div>
        </div>

        <div class="row row-2">
          <div class="sub-title">移民/企业/行政村/乡镇/区县</div>
          <div class="search-box">
            <input type="text" class="txt" placeholder="请输入搜素内容" />
            <img src="@/assets/imgs/icon_search.png" class="icon" />
          </div>
        </div>

        <div class="row row-3">
          <div class="title"> <div class="line"></div>实施进度 </div>
          <Echart :options="impProgressOption" :height="260" />
        </div>

        <div class="row row-4">
          <div class="title"> <div class="line"></div>新闻&法规 </div>
          <div class="tab-list">
            <div
              v-for="item in newsTabList"
              :key="item.value"
              :class="['tab-item', newsTabVal === item.value ? 'active' : '']"
            >
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
          </div>
          <div class="more">查看更多&gt;</div>
        </div>
      </div>

      <div class="col">
        <div class="row row-5">
          <div class="radar-title">
            <div class="left"> <div class="line"></div>进度雷达 </div>
            <div class="right" @click="radarMoreClick">更多&gt;</div>
          </div>
          <Echart :options="scheduleOption" :height="276" />
        </div>

        <div class="row row-6">
          <div class="title"> <div class="line"></div>移民一张图 </div>
          <div class="content">
            <el-image class="img" :src="img_ymyzt" fit="cover" />
          </div>
          <div class="tab-list">
            <div
              :class="['item', migrateTabVal === item.value ? 'active' : '']"
              v-for="item in migrateTabsList"
              :key="item.value"
            >
              {{ item.title }}
            </div>
          </div>
        </div>

        <div class="row row-7">
          <div class="title"> <div class="line"></div>问题反馈 </div>
          <div class="th-title">
            <div>问题内容</div>
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

      <div class="col right">
        <div class="row row-8">
          <div class="title"> <div class="line"></div>资金管理 </div>
          <div class="content-1">
            <div class="item">
              <img class="img" src="@/assets/imgs/home/icon_gszj.png" />
              <div class="content">
                <div class="sub-title">概算资金(万元)</div>
                <div class="amount">642,103</div>
              </div>
            </div>
            <div class="item">
              <img class="img" src="@/assets/imgs/home/icon_ljsy.png" />
              <div class="content">
                <div class="sub-title">累计使用(万元)</div>
                <div class="amount">380,000</div>
              </div>
            </div>
          </div>
          <div class="content-2">
            <div class="chart-1">
              <img class="img" src="@/assets/imgs/home/chart_sbt.png" />
            </div>
            <div class="chart-2">
              <div class="sub-title">本年计划资金(万元)</div>
              <div class="amount">100,000</div>
              <div class="sub-title">本年使用资金(万元)</div>
              <div class="amount">98,000</div>
            </div>
            <div class="chart-3">
              <div class="sub-title">概算内(万元)</div>
              <div class="amount">642,103</div>
              <div class="line"></div>
              <div class="sub-title">概算外(万元)</div>
              <div class="amount">80,000</div>
            </div>
          </div>
        </div>

        <div class="row row-9">
          <div class="title"> <div class="line"></div>工作组比拼晾晒 </div>
          <div class="tab-list">
            <div
              v-for="item in rankTabList"
              :class="['tab-item', rankTabVal === item.value ? 'active' : '']"
              :key="item.value"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="echart-wrap">
            <div class="echart-item" v-for="item in workGroupOptions" :key="item.index">
              <div class="echart-item-lt">
                <img class="top-img" :src="item.url" />
                <span class="user-name">{{ item.name }}</span>
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

        <div class="row row-10">
          <div class="title"> <div class="line"></div> {{ appearanceTab.name }} </div>
          <div class="list" v-if="appearanceTab.id === 1">
            <div class="item" v-for="item in appearanceList" :key="item.id">
              <el-image class="img" :src="item.url" fit="cover" />
            </div>
          </div>
          <div class="list" v-else-if="appearanceTab.id === 2">
            <div class="item" v-for="item in appearanceList2" :key="item.id">
              <el-image class="img" :src="item.url" fit="cover" />
            </div>
          </div>
          <div class="tab-wrap">
            <div
              class="tab-item"
              :class="{ active: item.id === appearanceTab.id }"
              @click="appearanceTabChange(item)"
              v-for="item in appearanceTabList"
              :key="item.id"
              >{{ item.name }}</div
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ElImage } from 'element-plus'
import Echart from '@/components/Echart/src/Echart.vue'
import newsDef from '@/assets/imgs/home/news_def.png' // 引入新闻&法规默认图
import img_sk_1 from '@/assets/imgs/home/img_sk_1.png' // 引入形象面貌图片1
import img_sk_2 from '@/assets/imgs/home/img_sk_2.png' // 引入形象面貌图片2
import img_ymyzt from '@/assets/imgs/home/img_ymyzt.png' // 引入移民一张图
import icon_first from '@/assets/imgs/home/icon_first.png' // 引入工作粗比拼晾晒 No.1 icon
import icon_second from '@/assets/imgs/home/icon_second.png' // 引入工作粗比拼晾晒 No.2 icon
import icon_third from '@/assets/imgs/home/icon_third.png' // 引入工作粗比拼晾晒 No.3 icon
import icon_four from '@/assets/imgs/home/icon_four.png' // 引入工作粗比拼晾晒 No.4 icon
import icon_five from '@/assets/imgs/home/icon_five.png' // 引入工作粗比拼晾晒 No.5 icon
import { useRouter } from 'vue-router'

// 实施进度图表配置项
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
    data: [
      '其他手续',
      '搬迁安置',
      '生产安置',
      '房屋(青苗)腾空',
      '移民建卡',
      '协议签订',
      '安置确认',
      '模拟安置',
      '资格认定',
      '资产评估'
    ]
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
      data: [50, 50, 30, 60, 70, 20, 40, 50, 60, 45]
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
      data: [80, 70, 50, 70, 90, 60, 70, 80, 75, 65]
    }
  ]
})

// 新闻&法规 tab切换数据列表
const newsTabList = [
  { title: '水库要闻', value: 1 },
  { title: '水库概况', value: 2 },
  { title: '政策法规', value: 3 },
  { title: '建设历程', value: 4 },
  { title: '安置概况', value: 5 },
  { title: '水库风采', value: 6 }
]

// 新闻&法规数据列表
const newsList = [
  {
    id: 1,
    title: '投资超125亿！镜岭水库移民安置规划公布，1.2万余人将被安置',
    url: newsDef,
    createTime: '2023/4/28'
  },
  {
    id: 2,
    title: '浙江镜岭水库工程建设征地移民安置规划，通过审查！',
    url: newsDef,
    createTime: '2023/3/2'
  },
  {
    id: 3,
    title: '浙江镜岭水库工程是国家2023年计划开工的60项重点水利工程之一',
    url: newsDef,
    createTime: '2023/2/20'
  }
]

// 进度雷达数据
const scheduleData = [
  { name: '资产评估', max: 100 },
  { name: '其他手续', max: 100 },
  { name: '生产安置', max: 100 },
  { name: '搬迁安置', max: 100 },
  { name: '房屋(青苗)腾空', max: 100 },
  { name: '移民建卡', max: 100 },
  { name: '协议签订', max: 100 },
  { name: '择房择址', max: 100 },
  { name: '安置确认', max: 100 },
  { name: '资格认定', max: 100 }
]

// 进度雷达图表配置
const scheduleOption = ref({
  title: {
    text: ''
  },
  legend: {
    show: false
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      let str = ''
      params.value &&
        params.value.map((item, index) => {
          str = str.concat(`
            <div>
              ${scheduleData[index].name}：${item ? item : 0}%
            </div>
          `)
        })
      return str
    },
    confine: true
  },
  radar: {
    shape: 'react',
    indicator: scheduleData
  },
  series: [
    {
      name: '进度雷达',
      type: 'radar',
      data: [
        {
          value: [40, 70, 65, 0, 70, 50, 80, 70, 60, 50],
          areaStyle: {
            color: 'rgba(62, 115, 236, 0.7)'
          },
          tooltip: {
            trigger: 'item'
          }
        }
      ]
    }
  ]
})

const { push } = useRouter()

// 点击雷达图更多按钮跳转至二级页面
const radarMoreClick = () => {
  push({ path: 'adminSecondHome' })
}

const newsTabVal = ref<number>(1) // 新闻&法规 tab 选中值
const migrateTabVal = ref<number>(1) // 移民一张图 tab 选中值
const rankTabVal = ref<number>(1) // 工作组比拼晾晒图 tab 选中值

// 问题反馈数据列表
const questionList = [
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
]

// 移民一张图 tab 数据列表
const migrateTabsList = [
  { title: '安置去向', value: 1 },
  { title: '专业项目', value: 2 },
  { title: '土地利用图', value: 3 }
]

// 工作组比拼晾晒图 tab 列表
const rankTabList = [
  { name: '资格认定', value: 1 },
  { name: '模拟安置', value: 2 },
  { name: '安置确认', value: 3 },
  { name: '协议签订', value: 4 },
  { name: '房屋腾空', value: 5 },
  { name: '青苗腾空', value: 6 },
  { name: '自(统)建房', value: 7 },
  { name: '生产安置', value: 8 },
  { name: '相关手续', value: 9 }
]

// 工作组比拼晾晒图表数据列表
const workGroupOptions = [
  { index: 1, name: '陈汉林', progress: 100, number: 125, url: icon_first },
  { index: 2, name: '梁柏林', progress: 90, number: 115, url: icon_second },
  { index: 3, name: '董化杰', progress: 80, number: 105, url: icon_third },
  { index: 4, name: '潘永浩', progress: 70, number: 98, url: icon_four },
  { index: 5, name: '董羽坤', progress: 65, number: 85, url: icon_five }
]

// 形象面貌数据列表
const appearanceList = ref([
  { id: 1, url: img_sk_1 },
  { id: 2, url: img_sk_2 }
])

const appearanceList2 = ref([
  { id: 1, url: img_sk_2 },
  { id: 2, url: img_sk_1 }
])
// 形象面貌 tabs
const appearanceTabList = ref([
  {
    id: 1,
    name: '我的乡愁'
  },
  {
    id: 2,
    name: '形象面貌'
  }
])

const appearanceTab = ref(appearanceTabList.value[0])

// 形象面貌 tab 切换
const appearanceTabChange = (item: any) => {
  appearanceTab.value = item
}
</script>
<style lang="less">
.home-wrapper {
  display: flex;
  width: 100%;
  margin-top: 10px;
  justify-content: center;

  .home-main {
    display: flex;
    align-items: center;
    width: 1440px;
    overflow-x: scroll;

    .col {
      display: flex;
      flex-wrap: wrap;
      width: 450px;
      margin-right: 16px;

      &.right {
        width: 480px;
        margin-right: 0;
      }

      .row {
        width: 100%;
        padding: 0 16px 14px 16px;
        margin-bottom: 13px;
        background: linear-gradient(360deg, #ffffff 0%, rgba(255, 255, 255, 0.73) 100%);
        border-radius: 4px;
        box-sizing: border-box;

        .title {
          display: flex;
          width: 100%;
          height: 46px;
          font-size: 16px;
          font-weight: bold;
          color: #171718;
          align-items: center;

          .line {
            width: 4px;
            height: 14px;
            margin-right: 8px;
            background: #3e73ec;
          }
        }

        .radar-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 46px;

          .left {
            display: flex;
            font-size: 16px;
            font-weight: bold;
            color: #171718;
            align-items: center;

            .line {
              width: 4px;
              height: 14px;
              margin-right: 8px;
              background: #3e73ec;
            }
          }

          .right {
            font-size: 14px;
            font-weight: bold;
            color: #999;
            cursor: pointer;
          }
        }

        &.row-1 {
          height: 266px;

          .list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            padding: 0 25px;
            box-sizing: border-box;

            .item {
              display: flex;
              align-items: center;
              width: 160px;
              height: 56px;
              margin-bottom: 14px;

              .icon {
                width: 44px;
                height: 44px;
                margin-right: 8px;
              }

              .content {
                .num {
                  display: flex;
                  font-family: PingFang SC-Semibold, PingFang SC;
                  font-size: 24px;
                  font-weight: bold;
                  line-height: 1;
                  color: #171718;
                  align-items: center;

                  .unit {
                    font-size: 14px;
                  }
                }

                .sub-title {
                  font-size: 14px;
                  color: rgba(19, 19, 19, 0.4);
                }
              }
            }
          }
        }

        &.row-2 {
          height: 104px;
          padding: 16px;
          box-sizing: border-box;

          .sub-title {
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1;
            color: #171718;
          }

          .search-box {
            display: flex;
            height: 44px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            align-items: center;
            justify-content: space-between;

            .txt {
              width: 350px;
              height: 30px;
              margin-left: 12px;
              font-size: 14px;
              color: #333;
              border: none;
              outline: none;
            }

            .icon {
              width: 20px;
              height: 20px;
              margin-right: 12px;
              cursor: pointer;
            }
          }
        }

        &.row-3 {
          height: 330px;
        }

        &.row-4 {
          height: 300px;

          .tab-list {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 32px;

            .tab-item {
              font-size: 14px;
              color: #666;
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

          .more {
            margin-top: 14px;
            font-size: 14px;
            color: #999;
            text-align: right;
          }
        }

        &.row-5 {
          height: 322px;
        }

        &.row-6 {
          height: 392px;

          .content {
            width: 404px;
            height: 264px;
            background: linear-gradient(360deg, #ffffff 0%, rgba(255, 255, 255, 0.73) 100%);
            border: 1px solid #ebebeb;
            border-radius: 4px;

            .img {
              width: 400px;
              height: 260px;
              border-radius: 2px;
            }
          }

          .tab-list {
            display: flex;
            padding: 0 60px;
            margin-top: 30px;
            box-sizing: border-box;
            align-items: center;
            justify-content: space-between;

            .item {
              display: flex;
              width: 90px;
              height: 30px;
              font-size: 14px;
              font-weight: bold;
              color: #3e73ec;
              border: 1px solid #3e73ec;
              border-radius: 4px;
              align-items: center;
              justify-content: center;

              &.active {
                color: #fff;
                background: #3e73ec;
              }
            }
          }
        }

        &.row-7 {
          height: 300px;

          .th-title {
            display: flex;
            height: 36px;
            padding: 0 10px;
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
        }

        &.row-8 {
          height: 322px;

          .content-1 {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .item {
              display: flex;
              width: 213px;
              height: 90px;
              padding: 15px;
              background: #f2f6ff;
              border-radius: 4px;
              box-sizing: border-box;
              align-items: center;

              .img {
                width: 60px;
                height: 60px;
                margin-right: 10px;
              }

              .content {
                .sub-title {
                  font-size: 14px;
                  line-height: 1;
                  color: #666;
                }

                .amount {
                  font-size: 30px;
                  color: #333;
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
                color: #666;
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
              background: #f3f7ff;
              border-radius: 4px;
              box-sizing: border-box;

              .sub-title {
                margin-bottom: 5px;
                font-size: 14px;
                line-height: 1;
                color: #4e5969;
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
        }

        &.row-9 {
          height: 340px;

          .tab-list {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            .tab-item {
              display: flex;
              width: 80px;
              height: 32px;
              margin: 0 5px 10px 0;
              font-size: 14px;
              color: #666;
              cursor: pointer;
              background: #f2f6ff;
              border-radius: 4px;
              align-items: center;
              justify-content: center;

              &.active {
                color: #fff;
                background: #2f72fe;
              }
            }
          }

          .echart-wrap {
            display: flex;
            flex-direction: column;
            width: 436px;
            height: 185px;
            padding: 0 10px;
            box-sizing: border-box;

            .echart-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-direction: row;
              width: 100%;
              height: 37px;

              .echart-item-lt {
                display: flex;
                align-items: center;
                flex-direction: row;

                .top-img {
                  width: 26px;
                  height: 20px;
                  margin-right: 10px;
                }

                .user-name {
                  width: 42px;
                  overflow: hidden;
                  font-size: 14px;
                  color: #333;
                  text-overflow: ellipsis;
                  word-break: keep-all;
                }
              }

              .echart-item-ct {
                display: flex;
                align-items: center;
                width: 278px;
                margin-left: 16px;

                .progress {
                  height: 9px;
                  background: linear-gradient(90deg, rgba(255, 197, 61, 0.3) 0%, #faad14 100%);
                  transform: skewX(-30deg);
                  transform-origin: 0% 0%;
                }
              }

              .echart-item-rt {
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .txt {
                  font-size: 14px;
                  color: #333;
                }
              }
            }
          }
        }

        &.row-10 {
          height: 352px;

          .list {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 16px;
            box-sizing: border-box;

            .item {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 192px;
              height: 214px;
              background: linear-gradient(360deg, #ffffff 0%, rgba(255, 255, 255, 0.73) 100%);
              border: 1px solid #ebebeb;
              border-radius: 4px;

              .img {
                width: 188px;
                height: 210px;
                border-radius: 2px;
              }
            }
          }

          .tab-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 16px 20px;

            .tab-item {
              display: flex;
              height: 30px;
              padding: 0 10px;
              margin-right: 10px;
              font-size: 14px;
              font-weight: 500;
              color: #3e73ec;
              cursor: pointer;
              border: 1px solid #3e73ec;
              border-radius: 4px 4px 4px 4px;
              opacity: 1;
              user-select: none;
              align-items: center;
              justify-content: center;

              &:last-child {
                margin-right: 0;
              }

              &.active {
                color: #ffffff;
                background: #3e73ec;
              }
            }
          }
        }
      }
    }
  }
}
</style>
