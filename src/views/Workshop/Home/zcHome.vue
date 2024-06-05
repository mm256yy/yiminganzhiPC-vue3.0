<template>
  <div class="index">
    <div class="topBox">
      <ElButton @click="onBack" type="default" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">首页</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">工作台</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">更多</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="newsBox">
      <div class="tabs">
        <ElTabs v-model="activeName2" class="demo-tabs news" @tab-click="newsHandleClick">
          <ElTabPane
            v-for="(item, index) in newsTypes"
            :label="item.label"
            :key="index"
            :name="item.value"
          />
        </ElTabs>
      </div>

      <div class="itemBox">
        <div class="item" v-for="item in newsList" :key="item.id">
          <div class="title">{{ item.title }}</div>
          <div
            v-html="item.content"
            style="
              font-weight: 400;
              font-size: 14px;
              color: #666666;
              word-break: break-all;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            "
          ></div>
          <div class="b">
            <div class="time">{{ item.releaseTime.replace(/-/g, '/') }}</div>
            <div class="more" @click="goLink('zcDetail', { id: item.id })">查看详情</div>
          </div>
        </div>
      </div>

      <ElPagination
        layout="prev, pager, next"
        :page-size="10"
        :total="totalNum"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ElButton,
  ElTabs,
  ElTabPane,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElPagination
} from 'element-plus'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { listDictDetailApi } from '@/api/sys/index'
import { useAppStore } from '@/store/modules/app'
import { getNewsList } from '@/api/home'

const router = useRouter()

const activeName2 = ref('水库要闻')
const pageNum = ref(0)
const totalNum = ref(0)
const newsTypes = ref<any[]>([])
const dictName = 'news' // 字典名称
const appStore = useAppStore()
const newsList = ref<any>([])

const { back, push } = useRouter()
const onBack = () => {
  back()
}

const goLink = (routerName: string, query: any) => {
  if (!routerName) return

  // 修改跳转方式为本页跳转
  router.push({
    name: routerName,
    query: query
  })

  //window.open(linkObj.href, '_blank')
}

const getNewsDict = async () => {
  const res = await listDictDetailApi({
    name: dictName,
    projectId: appStore.getCurrentProjectId
  })
  console.log(res, 'res是什么？')
  if (res && res.dictValList) {
    newsTypes.value = res.dictValList
    activeName2.value = newsTypes.value[0]?.value // 默认选中
  }
}

// 点击新闻跳转
const newsHandleClick = (pane: any, _ev?: Event) => {
  pageNum.value = 0
  requestNewsData(pane.props.name)
}

// 新闻列表
const requestNewsData = (type = '1') => {
  getNewsList({ page: pageNum.value, size: 10, sort: ['releaseTime', 'desc'], type }).then(
    (res: any) => {
      totalNum.value = res.total
      newsList.value = res.content.map((item: any) => {
        if (item.coverPic) {
          item.url = JSON.parse(item.coverPic)[0].url
        } else {
          item.url = ''
        }
        return item
      })
      if (newsList.value.length > 4) {
        newsList.value.length = 4
      }
    },
    (err) => {
      console.log('err', err)
    }
  )
}

const handleCurrentChange = (val: number) => {
  pageNum.value = val * 1 - 1
  requestNewsData()
}

onMounted(() => {
  getNewsDict()
  requestNewsData()
})
</script>

<style lang="less" scoped>
.newsBox {
  background: #fff;
  border-radius: 8px 8px 8px 8px;
  padding: 14px 16px;
  margin-top: 20px;
}

.topBox {
  display: flex;
  align-items: center;
}

.itemBox {
  .item {
    margin: 0 16px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebebeb;
    .title {
      font-weight: bold;
      font-size: 20px;
      color: #333333;
      line-height: 23px;
      margin-bottom: 16px;
    }
    .con {
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 16px;
      margin-bottom: 16px;
    }
    .b {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .time {
        font-weight: 500;
        font-size: 14px;
        color: rgba(19, 19, 19, 0.4);
        line-height: 16px;
      }
      .more {
        font-weight: 500;
        font-size: 14px;
        color: #3e73ec;
        line-height: 16px;
        cursor: pointer;
      }
    }
  }
}
</style>
