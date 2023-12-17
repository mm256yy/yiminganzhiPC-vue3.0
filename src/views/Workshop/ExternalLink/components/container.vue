<!--
 * @Author: baike
 * @LastEditors: baike
-->
<template>
  <div class="container_box">
    <div class="cin_top">
      <div class="seach_select">
        <ElSelect placeholder=" " clearable filterable v-model="reason" class="s_full">
          <ElOption v-for="item in option" :key="item.code" :label="item.name" :value="item.code" />
        </ElSelect>
      </div>
      <div class="search">
        <ElInput v-model="input" class="ipt" />
        <div class="seach_icon" @click="goLink"></div>
      </div>
      <div @click="goLink" class="screen"></div>
    </div>
    <div class="con_box">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/news.png" alt="" />
        </template>
        <template #info>
          <view @click="handleClickItem(4)" class="right_slot">
            <view class="right_text">查看更多</view>
            <view>
              <img class="look_icon" src="../../../../assets/imgs/homes/icon.png" alt=""
            /></view>
          </view>
        </template>
      </Label>
      <div class="news_box">
        <ElTabs v-model="activeName2" class="demo-tabs news" @tab-click="newsHandleClick">
          <ElTabPane name="水库要闻" label="水库要闻">
            <div></div>
          </ElTabPane>
          <ElTabPane label="政策法规" name="政策法规">
            <div></div>
          </ElTabPane>
          <ElTabPane label="水库概况" name="水库概况"><div></div></ElTabPane>
          <ElTabPane label="建设历程" name="建设历程"><div></div></ElTabPane>
          <ElTabPane label="安置概况" name="安置概况"><div></div></ElTabPane>
          <ElTabPane label="水库风采" name="水库风采"><div></div></ElTabPane>
        </ElTabs>
        <div class="news_info">
          <div v-for="item in newsList" :key="item.id" class="news_li">
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
    <div class="con_bom">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/xx.png" alt="" />
        </template>
        <template #info>
          <view @click="handleClickItem(5)" class="right_slot">
            <view class="right_text">查看更多</view>
            <view>
              <img class="look_icon" src="../../../../assets/imgs/homes/icon.png" alt=""
            /></view>
          </view>
        </template>
      </Label>
      <div class="table_box">
        <div class="th-title">
          <div>问题内容</div>
          <div>提交人</div>
          <div>提交时间</div>
        </div>
        <div class="question-list">
          <div
            class="item"
            v-for="item in questionList"
            :key="item.id"
            @click="onViewFeedBack(item)"
          >
            <div class="name">{{ item.remark }}</div>
            <div class="names">{{ item.creater }}</div>
            <div class="time">
              {{ dayjs(item.createdDate).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Label from './label.vue'
import { ref, onMounted } from 'vue'
import { ElTabs, ElSelect, ElOption, ElTabPane, ElInput } from 'element-plus'

import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { feedbackList } from '@/api/AssetEvaluation/leader-side'
import { getNewsList, getPolicyListApi } from '@/api/home'
import { getTokenApi } from '@/api/common/index'

const { push } = useRouter()

const questionList = ref<any>([])
const activeName2 = ref('水库要闻')
const newsList = ref<any>([])
const option = ref<any>([])

const input = ref('')
const reason = ref('')
const tokenStr = ref<string>('')

onMounted(() => {
  initNewsData()
  feedback()
})

const feedback = async () => {
  const list = await feedbackList({})
  list.content.sort(function (a, b) {
    return b.createdDate < a.createdDate ? -1 : 1
  })
  questionList.value = list.content
}
// 点击新闻跳转
const newsHandleClick = () => {}

// 初始化获取新闻通知 -- 水库要闻列表数据
const initNewsData = () => {
  getNewsList({ size: 9999, sort: ['releaseTime', 'desc'], type: '1' }).then((res: any) => {
    newsList.value = res.content.map((item: any) => {
      if (item.coverPic) {
        item.url = JSON.parse(item.coverPic)[0].url
      } else {
        item.url = ''
      }
      return item
    })
  })
}

const onViewFeedBack = (item: any) => {
  push(`/Feedback/FeedbackDetail?id=${item.id}`)
}
// 路由跳转
const routerJump = (path: string) => {
  push(path)
}

const goLink = async () => {
  try {
    const result = await getTokenApi()
    tokenStr.value = result.token
    let url = `http://test-jingling.jldt.top?token=${tokenStr.value}`
    window.location.href = url
  } catch {}
}

const handleClickItem = (type: number) => {
  const pathMap = {
    1: 'adminSecondHome', // 大数据分析
    2: 'adminhomefund', //资金管理
    3: 'adminhomeprogress', //进度管理 //新闻管理
    4: 'Project', //新闻管理
    5: 'Feedback', //反馈管理
    6: 'SmartReport' // 智慧报表
  }
  push({ name: pathMap[type] })
}
</script>

<style lang="less" scoped>
.container_box {
  .xm_img {
    width: 74px;
    height: 15px;
    // margin-top: 2px;
  }
  .right_text {
    font-size: 14px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
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
  .cin_top {
    width: 620px;
    height: 360px;
    background: url('../../../../assets/imgs/homes/ym_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    border-radius: 8px 8px 8px 8px;
    margin-bottom: 12px;
    display: flex;
    padding: 16px 24px;
    position: relative;
    .screen {
      width: 31px;
      height: 30px;
      background: url('../../../../assets/imgs/homes/qb.png');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      position: absolute;
      right: 9px;
      bottom: 9px;
      cursor: pointer;
    }
    .seach_select {
      width: 96px;
      height: 40px;
      background: url('../../../../assets/imgs/homes/seach_select.png');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      .s_full {
        /deep/ .el-input__wrapper {
          background: #3578f2 !important;
          padding: 4px 11px !important;
          font-weight: 500;
          border-color: #3578f2;
          outline: none;
          box-shadow: none;
        }
        /deep/ .el-input__inner {
          color: #ffffff !important;
          outline: none;
          box-shadow: none;
        }
        /deep/ .el-icon svg {
          color: #ffffff;
          font-weight: bold;
        }
      }
    }
    .search {
      width: 476px;
      height: 40px;
      background: url('../../../../assets/imgs/homes/seach.png');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      margin-left: -2px;
      position: relative;
      .ipt {
        width: 476px;
        height: 40px;
      }
      .seach_icon {
        width: 21px;
        height: 20px;
        background: url('../../../../assets/imgs/homes/search_icon.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        position: absolute;
        right: 16px;
        top: 10px;
        cursor: pointer;
      }
    }
  }
  .con_box {
    width: 620px;
    height: 298px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    margin-bottom: 12px;
    box-sizing: border-box;
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 2px solid rgba(62, 115, 236, 0.7);
    .news_box {
      padding: 0 26px;
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
            margin-bottom: 5px;
            width: 158px;
            height: 40px;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #333333;
          }
          .li_l_bom {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 20px;
          }

          .news_li_logo {
            width: 99px;
            height: 65px;
            .cover-pic {
              width: 99px;
              height: 65px;
            }
            // background: red;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .con_bom {
    width: 620px;
    height: 268px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    box-sizing: border-box;
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 2px solid rgba(62, 115, 236, 0.7);

    .table_box {
      padding: 8px 16px;
      .th-title {
        display: flex;
        height: 36px;
        padding: 0 10px;
        // font-weight: bold;
        background: #f2f6ff;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;

        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #171718;
        line-height: 36px;
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
            width: 70px;
            overflow: hidden;
            font-size: 14px;
            font-weight: 500;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #333333;
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap;
          }

          .names {
            margin-left: 70px;
            overflow: hidden;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #666666;
          }

          .time {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: rgba(19, 19, 19, 0.4);
          }
        }
      }
    }
  }
}
</style>
