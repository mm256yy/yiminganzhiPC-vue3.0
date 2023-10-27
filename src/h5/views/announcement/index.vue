<template>
  <div class="flex-col app-container">
    <div class="flex-col flex-auto group-announcement">
      <div class="flex-col section" style="overflow: auto">
        <div class="flex-col">
          <div
            class="flex-col list-item"
            v-for="(item, index) in items"
            :key="index"
            @click="toLink('announcementDetail', { id: item.id })"
          >
            <span class="item-title" v-html="item.content"></span>
            <span class="self-start item-time">{{ item.releaseTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNewsList } from '../home/service'
const { push } = useRouter()

const items = ref<any>([
  {
    title: '浙江省镜岭水库第一次选房通知公告公示时间为2023年8月13日',
    time: '2023-04-11'
  },
  {
    title: '浙江省镜岭水库第一次选房通知公告公示时间为2023年8月13日',
    time: '2023-04-11'
  },
  {
    title: '浙江省镜岭水库第一次选房通知公告公示时间为2023年8月13日',
    time: '2023-04-11'
  },
  {
    title: '浙江省镜岭水库第一次选房通知公告公示时间为2023年8月13日',
    time: '2023-04-11'
  }
])

const toLink = (routeName: string, query = {}) => {
  push({
    name: routeName,
    query
  })
}
let getNewsLists = async () => {
  let data = await getNewsList({ size: 9999, sort: ['releaseTime', 'desc'], type: '1' })
  console.log(data)
  items.value = data.content
}
onMounted(() => {
  getNewsLists()
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
