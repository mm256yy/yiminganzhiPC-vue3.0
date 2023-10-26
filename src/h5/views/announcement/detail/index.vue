<template>
  <div class="flex-col app-container">
    <div class="flex-col flex-auto group-detail">
      <div class="flex-col section">
        <span class="section-title">{{ dataList.title }}</span>
        <span class="self-start section-time">{{ dataList.releaseTime }}</span>
        <div class="flex-col group-content">
          <img
            class="image-detail"
            :src="dataList.coverPic ? JSON.parse(dataList.coverPic)[0].url : ''"
          />
          <span class="section-content" v-html="dataList.content"> </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getNewsListId } from '../../home/service'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
let Route = useRoute()
let dataList: any = ref({})
let getNewsListIds = async () => {
  let data = await getNewsListId(Route.query.id)
  console.log(JSON.parse(data.coverPic)[0].url)
  dataList.value = data
  return data
}
onMounted(() => {
  getNewsListIds()
})
</script>

<style lang="less" scoped>
.group-detail {
  padding-top: 24px;
  overflow-y: auto;

  .section {
    padding: 32px 20px 32px 32px;
    background-color: #ffffff;

    .section-title {
      font-size: 36px;
      font-weight: 700;
      line-height: 44px;
      color: #333333;
    }

    .section-content {
      margin-top: 16px;
      font-family: PingFang SC;
      font-size: 28px;
      line-height: 48px;
      line-height: 40px;
      color: #666666;
    }

    .section-time:extend(.section-content) {
      font-family: PingFang SC;
      font-size: 28px;
      line-height: 48px;
      color: #666666;
    }

    .group-content {
      margin-top: 32px;

      .image-detail {
        width: 682px;
        height: 382px;
        margin-right: 16px;
        margin-left: 4px;
      }
    }
  }
}
</style>
