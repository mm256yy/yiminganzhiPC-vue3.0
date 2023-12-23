<!--
 * @Author: baike
 * @LastEditors: 1019314017@qq.com 1019314017@qq.com
-->
<template>
  <div class="container_box">
    <div class="cin_top" @click="goLink">
      <div class="seach_select">
        <ElSelect placeholder="请选择" clearable filterable v-model="reason" class="s_full">
          <ElOption v-for="item in option" :key="item.code" :label="item.name" :value="item.code" />
        </ElSelect>
      </div>
      <div class="search">
        <ElInput
          v-model="searchContent"
          class="ipt"
          placeholder="请输入搜索内容"
          @click.stop="() => {}"
        />
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
              <img class="look_icon" src="../../../../assets/imgs/homes/icon.png" alt="" />
            </view>
          </view>
        </template>
      </Label>
      <div class="news_box">
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
    <div class="con_bom">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/xx.png" alt="" />
        </template>
        <template #info>
          <view @click="handleClickItem(5)" class="right_slot">
            <view class="right_text">查看更多</view>
            <view>
              <img class="look_icon" src="../../../../assets/imgs/homes/icon.png" alt="" />
            </view>
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
    <ElDialog
      title="文章内容查看"
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
import Label from './label.vue'
import { ref, onMounted } from 'vue'
import { ElTabs, ElSelect, ElOption, ElTabPane, ElInput, ElDialog } from 'element-plus'

import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { feedbackList } from '@/api/AssetEvaluation/leader-side'
import { getNewsList } from '@/api/home'
import { listDictDetailApi } from '@/api/sys/index'
import { getTokenApi } from '@/api/common/index'
import { useAppStore } from '@/store/modules/app'

const { push } = useRouter()
const questionList = ref<any>([])
const activeName2 = ref('水库要闻')
const newsList = ref<any>([])
const option = ref<any>([])

const searchContent = ref('')
const reason = ref('移民户')
const tokenStr = ref<string>('')
const appStore = useAppStore()
const newsTypes = ref<any[]>([])
const dictName = 'news' // 字典名称
const panelLoading = ref<boolean>(false)
<<<<<<< HEAD
option.value = [
  {
    code: '1',
    name: '移民户'
  },
  {
    code: '2',
    name: '企事业单位'
  },
  {
    code: '3',
    name: '专业项目'
  },
  {
    code: '4',
    name: '分户土地'
  }
]
=======
const content = ref<string>() // 文章内容
const contentDialog = ref<boolean>(false)

>>>>>>> 52a55eb16e8dac78bf15c8a501e66c39fba5be95
const getNewsDict = async () => {
  const res = await listDictDetailApi({
    name: dictName,
    projectId: appStore.getCurrentProjectId
  })
  if (res && res.dictValList) {
    newsTypes.value = res.dictValList
  }
}

const feedback = async () => {
  const list = await feedbackList({})
  list.content.sort(function (a, b) {
    return b.createdDate < a.createdDate ? -1 : 1
  })
  questionList.value = list.content
}

const checkNews = (item: any) => {
  content.value = item.content
  contentDialog.value = true
}

// 点击新闻跳转
const newsHandleClick = (pane: any, ev: Event) => {
  console.log('ev', ev)
  requestNewsData(pane.props.name)
}

// 水库要闻
const requestNewsData = (type = '1') => {
  panelLoading.value = true
  getNewsList({ size: 9999, sort: ['releaseTime', 'desc'], type }).then(
    (res: any) => {
      newsList.value = res.content.map((item: any) => {
        if (item.coverPic) {
          item.url = JSON.parse(item.coverPic)[0].url
        } else {
          item.url = ''
        }
        return item
      })
      panelLoading.value = false
    },
    (err) => {
      console.log('err', err)
      panelLoading.value = false
    }
  )
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
    let url = `http://test-jingling.jldt.top?token=${tokenStr.value}&value=${searchContent.value}&callback=${window.location.href}`
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

onMounted(() => {
  requestNewsData()
  feedback()
  getNewsDict()
})
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

    font-weight: 400;
    line-height: 20px;
    color: #666666;
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
    position: relative;
    display: flex;
    width: 620px;
    height: 360px;
    padding: 16px 24px;
    margin-bottom: 12px;
    background: url('../../../../assets/imgs/homes/ym_bg.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 8px 8px 8px 8px;

    .screen {
      position: absolute;
      right: 9px;
      bottom: 9px;
      width: 31px;
      height: 30px;
      cursor: pointer;
      background: url('../../../../assets/imgs/homes/qb.png');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .seach_select {
      width: 96px;
      height: 40px;
      background: url('../../../../assets/imgs/homes/seach_select.png');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;

      .s_full {
        :deep(.el-input__wrapper) {
          padding: 4px 11px !important;
          font-weight: 500;
          background: #3578f2 !important;
          border-color: #3578f2;
          outline: none;
          box-shadow: none;
        }

        :deep(.el-input__inner) {
          color: #ffffff !important;
          outline: none;
          box-shadow: none;
        }

        :deep(.el-icon) svg {
          font-weight: bold;
          color: #ffffff;
        }
      }
    }

    .search {
      position: relative;
      width: 476px;
      height: 40px;
      margin-left: -2px;
      background: url('../../../../assets/imgs/homes/seach.png');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;

      .ipt {
        width: 476px;
        height: 40px;
      }

      .seach_icon {
        position: absolute;
        top: 10px;
        right: 16px;
        width: 21px;
        height: 20px;
        cursor: pointer;
        background: url('../../../../assets/imgs/homes/search_icon.png');
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }

  .con_box {
    width: 620px;
    height: 298px;
    margin-bottom: 12px;
    background: #ffffff;
    border: 2px solid rgba(62, 115, 236, 0.7);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    box-sizing: border-box;

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
    }
  }

  .con_bom {
    width: 620px;
    height: 268px;
    background: #ffffff;
    border: 2px solid rgba(62, 115, 236, 0.7);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    box-sizing: border-box;

    .table_box {
      padding: 8px 16px;

      .th-title {
        display: flex;
        height: 36px;
        padding: 0 10px;

        font-size: 14px;

        font-weight: 500;
        line-height: 36px;
        color: #171718;
        // font-weight: bold;
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
            width: 70px;
            overflow: hidden;
            font-size: 14px;

            font-weight: 500;
            color: #333333;
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap;
          }

          .names {
            margin-left: 70px;
            overflow: hidden;
            font-size: 14px;

            font-weight: 500;
            color: #666666;
          }

          .time {
            font-size: 14px;

            font-weight: 500;
            color: rgba(19, 19, 19, 0.4);
          }
        }
      }
    }
  }
}
</style>
