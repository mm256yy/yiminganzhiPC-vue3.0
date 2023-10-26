<template>
  <div class="flex-col page">
    <div class="header-region">
      <ElCarousel height="360px">
        <ElCarouselItem v-for="item in 3" :key="item">
          <ElImage :src="bannerBgSrc" fit="cover" />
        </ElCarouselItem>
      </ElCarousel>
    </div>
    <div class="flex-col relative section-content">
      <span class="self-center content-title">{{ dataList.title }}</span>
      <div class="flex-col">
        <span class="content-txt indent" v-html="dataList.content"> </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElCarousel, ElCarouselItem, ElImage } from 'element-plus'
import bannerBgSrc from '@/h5/assets/imgs/banner_bg.png'
import { useRoute } from 'vue-router'
import { getHomesicknessId } from './service'
import { onMounted, ref } from 'vue'
const { query } = useRoute()
// const { projectId} = currentRoute.value.query as any
// console.log('meta', query.id)
let dataList: any = ref({})
let getHomesicknessIds = async () => {
  let data = await getHomesicknessId()
  console.log(data)
  dataList.value = data
}
onMounted(() => {
  getHomesicknessIds()
})
</script>

<style lang="less" scoped>
.page {
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #eaf1ff;

  .header-region {
    height: 360px;
  }

  .section-content {
    padding: 40px 36px 112px 48px;
    margin-top: -52px;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 32px 32px 0px 0px;
    filter: drop-shadow(0px 8px 5px #0000000a);

    .content-title {
      font-size: 36px;
      font-weight: 700;
      line-height: 34px;
      color: #171718;
    }

    .content-txt {
      margin-top: 24px;
      font-size: 28px;
      line-height: 42px;
      color: #333333;

      &.indent {
        text-indent: 56px;
      }
    }
  }
}
</style>
