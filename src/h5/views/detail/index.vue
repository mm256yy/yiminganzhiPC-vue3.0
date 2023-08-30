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
      <span class="self-center content-title">镜岭水库概况</span>
      <div class="flex-col">
        <span class="content-txt indent">
          镜岭水库工程任务为防洪、供水为主，结合灌溉、发电、改善流域水生态环境等综合利用。工程由枢纽工程和输水工程两部分组成。枢纽工程主要建筑物由拦河坝、泄水建筑物、发电引水建筑物、发电厂、过鱼建筑物、对外交通道路等组成。拦河坝主坝为混凝土重力坝，坝顶高程138.00m；副坝4座，均为混凝土重力坝。水库正常蓄水位128.00m，水库总库容为31273万m³。输水工程由分层进水口、输水管道、隧洞、出口能源回收电站、调节池等建筑物组成，输水管道自南向北经过新昌县、嵊州市至柯桥区兰若寺水库东侧的调节池，全长约75.45km。
          2022年03月16日，新昌县人民政府关于公布镜岭水库规划建设控制范围和要求的通告发布。12月7日上午，浙江镜岭水库先行工程（澄潭江上游分洪洞工程）动工仪式在新昌县举行。
          2023年4月9日—10日，根据水利部安排，水利部水利水电规划设计总院在北京召开会议，对《浙江镜岭水库工程可行性研究报告》进行复审。本次复审会议的召开标志着镜岭水库工程前期报批工作又向前迈进了关键性的一步。
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElCarousel, ElCarouselItem, ElImage } from 'element-plus'
import bannerBgSrc from '@/h5/assets/imgs/banner_bg.png'
import { useRoute } from 'vue-router'
const { meta } = useRoute()
// const { projectId} = currentRoute.value.query as any
console.log('meta', meta.name)
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
