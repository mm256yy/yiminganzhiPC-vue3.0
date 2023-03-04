<template>
  <WorkContentWrap>
    <div class="bigBox white">
      <ElRow :gutter="20">
        <ElCol :span="6">
          <div class="box">
            <div>
              <div class="ft21">居民户总数</div>
              <div> <span class="ft43">860</span> <span>户</span></div>
            </div>
            <div class="shu"> </div>
            <div>
              <div>已上报<span class="red">300</span>户</div>
              <div>未上报<span class="red">560</span>户</div>
              <div>我的上报<span class="red">150</span>户</div>
            </div>
          </div></ElCol
        >
        <ElCol :span="6">
          <div class="box">
            <div>
              <div class="ft21">企业总数</div>
              <div> <span class="ft43">48</span> <span>户</span></div>
            </div>
            <div class="shu"> </div>
            <div>
              <div>已上报<span class="red">20</span>户</div>
              <div>未上报<span class="red">28</span>户</div>
              <div>我的上报<span class="red">15</span>户</div>
            </div>
          </div></ElCol
        >
        <ElCol :span="6">
          <div class="box">
            <div>
              <div class="ft21">个体户总数</div>
              <div> <span class="ft43">120</span> <span>户</span></div>
            </div>
            <div class="shu"> </div>
            <div>
              <div>已上报<span class="red">80</span>户</div>
              <div>未上报<span class="red">40</span>户</div>
              <div>我的上报<span class="red">25</span>户</div>
            </div>
          </div></ElCol
        >
        <ElCol :span="6">
          <div class="box">
            <div>
              <div class="ft21">村集体总数</div>
              <div> <span class="ft43">10</span> <span>户</span></div>
            </div>
            <div class="shu"> </div>
            <div>
              <div>已上报<span class="red">4</span>户</div>
              <div>未上报<span class="red">6</span>户</div>
              <div>我的上报<span class="red">2</span>户</div>
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
            <ElTabs v-model="activeName2" class="demo-tabs new" @tab-click="handleClick">
              <ElTabPane label="水库要闻" name="水库要闻">
                <div class="listbox">
                  <img src="@/assets/imgs/3.jpg" alt="" :width="107" style="height: 67px" />
                  <div class="text">
                    <div class="title"
                      >高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位</div
                    >
                    <div class="time">2023/2/28</div>
                  </div>
                </div>
                <div class="listbox">
                  <img src="@/assets/imgs/1.jpg" alt="" :width="107" style="height: 67px" />
                  <div class="text">
                    <div class="title"
                      >高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位</div
                    >
                    <div class="time">2023/2/28</div>
                  </div>
                </div>
                <div class="listbox">
                  <img src="@/assets/imgs/2.jpg" alt="" :width="107" style="height: 67px" />
                  <div class="text">
                    <div class="title"
                      >高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位高坪桥水库首次泄洪　腾出200万方库容稳水位库容稳水位</div
                    >
                    <div class="time">2023/2/28</div>
                  </div>
                </div>
                <div class="more">查看更多></div>
              </ElTabPane>
              <ElTabPane label="政策法规" name="政策法规">
                <div class="policylist">
                  <div class="title"> 图解《龙游县高坪桥水库工程移民后期扶持若干意见的通知》 </div>
                  <div class="time">
                    <span> 2023/2/28</span>
                    <span>更多</span>
                  </div>
                </div>
                <div class="policylist">
                  <div class="title"> 关于印发龙游县高坪桥水库工程移民后期扶持若干意见的通知 </div>
                  <div class="time">
                    <span> 2023/2/28</span>
                    <span>更多</span>
                  </div>
                </div>
                <div class="policylist">
                  <div class="title"> 龙游县高坪桥水库工程建设征地搬迁安置工作实施办法 </div>
                  <div class="time">
                    <span> 2023/2/28</span>
                    <span>更多</span>
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
import { ref } from 'vue'
import Rank_1 from '@/assets/imgs/Rank_1.png'
import Rank_2 from '@/assets/imgs/Rank_2.png'
import Rank_3 from '@/assets/imgs/Rank_3.png'
import Rank_4 from '@/assets/imgs/Rank_4.png'
import Rank_5 from '@/assets/imgs/Rank_5.png'

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
.shu {
  width: 2px;
  height: 55px;
  background: #ccdfff;
}

.box {
  display: flex;
  height: 150px;
  padding: 10px;

  font-family: PingFang SC-Medium, PingFang SC;
  background-image: url(@/assets/imgs/bg_databoard.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  justify-content: space-around;
  align-items: center;
  // background: white;
}

.echartBox {
  height: 450px;
  padding: 13px;
  background: white;
  border-radius: 11px 11px 11px 11px;
  opacity: 1;

  .echartTitle {
    display: flex;
    height: 59px;
    background: linear-gradient(135deg, #1a63ff 0%, rgba(255, 255, 255, 0) 100%);
    // border: 3px solid;
    border-image: linear-gradient(90deg, rgba(244, 247, 255, 1), rgba(244, 247, 255, 0)) 3 3;
    border-radius: 11px 11px 11px 11px;
    opacity: 1;
    align-items: center;

    img {
      margin: 0 8px;
    }

    .text {
      font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei;
      font-size: 27px;
      font-style: italic;
      font-weight: 600;
      line-height: 29px;
      color: #ffffff;
    }
  }
}

.h400 {
  height: 420px;
}

.red {
  height: 10px;
  color: red;
}

.bigBox {
  padding: 15px;
  border-radius: 11px 11px 11px 11px;
}

.white {
  background: white;
}

.ft19 {
  font-size: 19px;
}

.ft43 {
  font-size: 40px;
  font-weight: bold;
}

.ft21 {
  font-size: 19px;
  font-weight: 500;
}

.tabsBox {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap; /* 只要您把这个属性去掉,就不会自动换行了*/
  .tabsContentBox {
    position: relative;
    display: flex;
    width: 49.5%;
    height: 53px;
    padding-left: 8px;
    margin-bottom: 10px;
    background: #f5f5f5;
    border-radius: 5px;
    align-items: center;

    span {
      margin-left: 4px;
    }

    .img_r {
      position: absolute;
      right: 10px;
    }
  }
}

:deep(.el-progress-bar__inner) {
  background-color: red;
}

.new {
  :deep(.el-tabs--card > .el-tabs__header) {
    border: none !important;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 0;
  }
}

:deep(.el-tabs--card > .el-tabs__header) {
  border: none !important;
}

.baogao {
  :deep(.el-tabs__item) {
    width: 32%;
    height: 43px;
    color: #666666;
    text-align: center;
    background: #f2f7ff;
    border: none !important;
    border-radius: 5px 5px 5px 5px;
    opacity: 1;
  }

  :deep(.el-tabs__nav) {
    display: flex;
    width: 100%;
    border: none !important;
    justify-content: space-between;
  }

  :deep(.is-active) {
    color: #ffffff !important;
    background: #2f72fe;
    border-radius: 5px 5px 5px 5px;
    opacity: 1;
  }
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  min-height: 36px;
  border-radius: 4px;
}

.listbox {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #ebebeb;

  .text {
    margin-left: 10px;
    line-height: 30px;

    .title {
      width: 400px;
      overflow: hidden;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .time {
      color: rgba(153, 153, 153, 1);
    }
  }
}

.policylist {
  padding-left: 10px;
  border-bottom: 1px solid #ebebeb;

  .title {
    width: 450px;
    margin-top: 10px;
    overflow: hidden;
    font-weight: 600;
    color: #333333;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .time {
    display: flex;
    margin: 10px 0;
    color: rgba(153, 153, 153, 1);
    justify-content: space-between;
  }
}

.more {
  color: #999999;
  text-align: right;
}
</style>
