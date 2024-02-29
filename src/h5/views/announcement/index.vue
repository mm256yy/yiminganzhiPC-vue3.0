<template>
  <div class="flex-col app-container">
    <div class="flex-col flex-auto group-announcement">
      <div class="flex-col section" style="overflow: auto">
        <div v-if="items && items.length > 0" class="flex-col">
          <div
            class="flex-col list-item"
            v-for="(item, index) in items"
            :key="index"
            @click="toLink('announcementDetail', { id: item.id })"
          >
            <span class="item-title" v-html="item.title"></span>
            <span class="self-start item-time">{{ item.releaseTime }}</span>
          </div>
        </div>
        <Empty v-else title="暂无数据" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNewsList } from '../home/service'
import Empty from '@/h5/components/Empty/index.vue'
const { push } = useRouter()
const pageLoading = ref<boolean>(false)

const items = ref<any>([])

const toLink = (routeName: string, query = {}) => {
  push({
    name: routeName,
    query
  })
}
let getNewsLists = async () => {
  pageLoading.value = true
  try {
    let data = await getNewsList({ size: 9999, sort: ['releaseTime', 'desc'], type: '1' })
    items.value = data.content
    pageLoading.value = false
  } catch {
    pageLoading.value = false
    items.value = []
  }
}
onMounted(() => {
  getNewsLists()
  window.scrollTo(0, 0) // 将页面滚动至顶部
})
</script>

<style lang="less" scoped>
.group-announcement {
  padding-top: 34px;
  overflow-y: auto;

  .section {
    padding: 32px 32px 60px;
    margin: 0 30px;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 16px;
    filter: drop-shadow(0px 0px 14px #0000000d);

    .list-item {
      padding-bottom: 24px;
      border-bottom: solid 2px #ebebeb80;

      .item-title {
        padding-top: 10px;
        font-family: PingFang SC;
        font-size: 30px;
        line-height: 38px;
        color: #333333;
      }

      .item-time {
        margin-top: 16px;
        font-family: Roboto;
        font-size: 28px;
        line-height: 20px;
        color: #13131366;
      }
    }
  }
}
</style>
