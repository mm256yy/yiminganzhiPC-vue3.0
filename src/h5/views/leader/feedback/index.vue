<template>
  <div class="app-container">
    <div class="flex-col list">
      <div
        class="flex-col list-item"
        v-for="(item, index) in items"
        :key="index"
        @click="onItemClick(item)"
      >
        <div class="flex-col justify-start items-start text-wrapper">
          <span class="text-title">{{ item.remark }}</span>
        </div>
        <div class="flex-row items-center group-item">
          <div class="group-left">
            <div class="text-left">提交人</div>
            <div class="text-left">提交时间</div>
          </div>
          <div class="flex-col items-start">
            <div class="right-top">{{ item.creater }}</div>
            <div class="right-bottom">{{
              item.createdDate ? dayjs(item.createdDate).format('YYYY-MM-DD HH:mm:ss') : '-'
            }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFeedback } from './service'
import { useAppStore } from '@/store/modules/app'
import dayjs from 'dayjs'
const { push } = useRouter()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const toLink = (routeName: string, query = {}) => {
  push({
    name: routeName,
    query
  })
}

const items = ref<any[]>([
  {
    title: '关于零星林（果）木补偿费',
    submitter: '陈翰林',
    submitTime: '2023-12-22 10:30'
  },
  {
    title: '关于零星林（果）木补偿费',
    submitter: '陈翰林',
    submitTime: '2023-12-22 10:30'
  },
  {
    title: '关于零星林（果）木补偿费',
    submitter: '陈翰林',
    submitTime: '2023-12-22 10:30'
  }
])
let page = ref(0)
const onItemClick = (item: any) => {
  const name = 'feedbackDetail'
  toLink(name, { id: item.id })
  console.log('item', item.title)
}
let getFeedbacks = async () => {
  let data = await getFeedback({ projectId: projectId, size: 10, page: page.value })
  console.log(data)
  items.value = [...items.value, ...data.content]
  console.log(items.value)
}
const scroll = () => {
  const scrollHeight = document.documentElement.scrollHeight // 可滚动区域的高
  const scrollTop = document.documentElement.scrollTop // 已经滚动区域的高
  const clientHeight = document.documentElement.clientHeight // 可视区高度
  // 以滚动高度 + 当前视口高度  >= 可滚动高度 = 触底
  if (clientHeight + scrollTop >= scrollHeight) {
    // 此处可书写触底刷新代码
    page.value++
    console.log('触底', page.value)
    getFeedbacks()
  }
}
onUnmounted(() => window.removeEventListener('scroll', scroll))
onMounted(() => {
  items.value = []
  getFeedbacks()
  window.addEventListener('scroll', scroll)
})
</script>

<style lang="less" scoped>
.list {
  padding: 24px 30px 0;

  .list-item {
    padding: 24px 30px 0;
    margin: 8px 0;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 16px;

    .text-wrapper {
      padding: 8px 0 24px;
      border-bottom: solid 2px #ebebeb;

      .text-title {
        font-size: 32px;
        font-weight: 700;
        line-height: 30px;
        color: #131313;
      }
    }

    .group-item {
      padding: 16px;

      .group-left {
        width: 112px;
        margin-right: 32px;
        text-align: right;

        .text-left {
          height: 48px;
          font-size: 28px;
          line-height: 48px;
          color: #666666;
        }
      }
    }

    .right-top {
      height: 48px;
      font-size: 28px;
      font-weight: 400;
      line-height: 48px;
      color: #171718;
    }

    .right-bottom {
      height: 48px;
      font-size: 28px;
      font-weight: 500;
      line-height: 48px;
      color: #171718;
    }
  }
}
</style>
