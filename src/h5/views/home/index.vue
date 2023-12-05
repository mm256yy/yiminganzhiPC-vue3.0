<template>
  <div class="home-banner">
    <ElCarousel height="360px">
      <ElCarouselItem v-for="item in 3" :key="item">
        <ElImage :src="bannerBgSrc" fit="cover" />
      </ElCarouselItem>
    </ElCarousel>
  </div>
  <div class="flex-col justify-start relative section">
    <div class="flex-row equal-division">
      <div class="flex-col items-center menu-group-item" @click="toLink('announcement')">
        <ElImage class="image-menu" :src="iconAnnouncement" fit="cover" />
        <span class="menu-item-txt">通知公告</span>
      </div>
      <div class="flex-col items-center menu-group-item" @click="toLink('policies')">
        <ElImage class="image-menu" :src="iconLaws" fit="cover" />
        <span class="menu-item-txt">政策法规</span>
      </div>
      <div class="flex-col items-center menu-group-item" @click="toLink('appearance')">
        <ElImage class="image-menu" :src="iconFace" fit="cover" />
        <span class="menu-item-txt">水库面貌</span>
      </div>
      <div class="flex-col items-center menu-group-item" @click="toLink('situation')">
        <ElImage class="image-menu" :src="iconSituation" fit="cover" />
        <span class="menu-item-txt">水库概况</span>
      </div>
    </div>
  </div>
  <div class="rehouse-box" @click="toRehouse">
    <ElImage class="rehouse-section" :src="iconRehouseSrc" alt="安置概览" />
  </div>
  <div class="flex-col notice-section" style="max-height: 10rem; overflow: auto">
    <div class="flex-row justify-between items-center">
      <div class="flex-col items-start">
        <span class="label-txt">通知公告</span>
        <div class="shrink-zero gradient-bar"></div>
      </div>
      <span class="show-more" @click="toLink('announcement')">查看更多</span>
    </div>
    <div class="flex-col notice-group">
      <img class="notice-group-image" :src="imageBannerNotice" />
      <div
        class="flex-col notice-group-list"
        @click="toLink('announcementDetail', { id: item.id })"
        v-for="(item, index) in noticeList"
        :key="index"
      >
        <span class="notice-content-txt" v-html="item.title"></span>
        <span class="self-start time-txt">{{ item.releaseTime }}</span>
      </div>
    </div>
  </div>
  <div class="flex-col homesickness-group-list">
    <div class="flex-row justify-between items-center title-panel">
      <div class="flex-col items-start">
        <span class="label-txt">我的乡愁</span>
        <div class="shrink-zero gradient-bar"></div>
      </div>
      <span class="show-more" @click="toLink('homesickness')">查看更多</span>
    </div>
    <div class="flex-col group-image">
      <div
        class="flex-col justify-start items-center relative group-image-section"
        v-for="(item, index) in dataList"
        :key="index"
        @click="toLink('homesicknessDetail', { id: item.id })"
      >
        <img
          class="shrink-zero group-image-box"
          :src="item.coverPic ? JSON.parse(item.coverPic)[0].url : ''"
        />
        <div class="flex-col items-start group-image-txt">
          <span class="image-title">{{ item.title }}</span>
          <span class="image-sub-title">{{ item.author }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElCarousel, ElCarouselItem, ElImage } from 'element-plus'
import bannerBgSrc from '@/h5/assets/imgs/banner_bg.png'
import iconLaws from '@/h5/assets/imgs/icon_laws.png'
import iconAnnouncement from '@/h5/assets/imgs/icon_announcement.png'
import iconFace from '@/h5/assets/imgs/icon_face.png'
import iconSituation from '@/h5/assets/imgs/icon_general_situation.png'
import imageBannerNotice from '@/h5/assets/imgs/image_banner_notice.png'
import iconRehouseSrc from '@/h5/assets/imgs/icon_rehouse.png'
import { useRouter } from 'vue-router'
import { getNewsList, getHomesickness } from './service'
const { push } = useRouter()

const toLink = (routeName: string, query = {}) => {
  push({
    name: routeName,
    query
  })
}

const noticeList = ref<any>([
  {
    title: '浙江省镜岭水库第一次选房通知公告公示时间为2023年8月13日',
    time: '2023-04-11'
  },
  {
    title: '绍兴市镜岭水库建设运营中心取消2023年度第二次公开招聘高层次人才相关岗位的公告',
    time: '2023-04-11'
  }
])
let dataList: any = ref([])
let getNewsLists = async () => {
  let data = await getNewsList({ size: 9999, sort: ['releaseTime', 'desc'], type: '1' })
  noticeList.value = data.content
  if (noticeList.value.length > 3) {
    noticeList.value.length = 3
  }
}
let getHomesicknesss = async () => {
  let data = await getHomesickness()
  dataList.value = data.content
  if (dataList.value.length > 2) {
    dataList.value.length = 2
  }
}

// 安置概览
const toRehouse = () => {
  toLink('rehouse')
}

onMounted(() => {
  getNewsLists()
  getHomesicknesss()
})
</script>

<style lang="less" scoped>
.home-banner {
  height: 360px;
}

.banner-menu {
  display: flex;
  flex-direction: column;
}

.section {
  padding: 26px 0 16px;
  margin-top: -32px;
  overflow: hidden;
  background-image: linear-gradient(181deg, #f1fbff 2.8%, #eaf1ff 45.4%, #eaf1ff00 87.1%);
  border: solid 3px #ffffff;
  border-radius: 32px;
  border-image-slice: 1;

  .equal-division {
    padding: 0 12px;

    .menu-group-item {
      flex: 1 1 180px;
      padding: 0 0 15px 0;
    }

    .equal-division-item {
      padding: 8px 0;
    }

    .image-menu {
      width: 180px;
      height: 180px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .menu-item-txt {
      margin-top: -30px;
      font-size: 28px;
      color: #171718;
    }
  }
}

.rehouse-box {
  padding: 20px 30px;
  display: flex;
  justify-content: center;
  .rehouse-section {
    height: 140px;
  }
}

.notice-section {
  padding: 40px 32px 56px;
  margin: 0 30px;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 16px;
  filter: drop-shadow(0px 0px 14px #0000000d); // CSS 滤镜

  .notice-group {
    margin-top: 24px;

    & > *:not(:first-child) {
      margin-top: 22px;
    }

    .notice-group-image {
      width: 626px;
      height: 144px;
      border-radius: 8px;
    }

    .notice-group-list {
      padding-bottom: 24px;
      font-size: 30px;
      border-bottom: solid 2px #ebebeb80;
    }

    .notice-content-txt {
      font-size: 28px;
      line-height: 38px;
      color: #333333;
    }
  }
}

.label-txt {
  font-family: PingFang SC;
  font-size: 34px;
  font-weight: 700;
  line-height: 32px;
  color: #1e2226;
}

.homesickness-group-list {
  padding: 40px 32px 26px;
  margin: 22px 30px 140px;
  overflow: hidden;
  background-color: #ffffff;
  border: solid 2px #ffffff;
  border-radius: 16px;
  filter: drop-shadow(0px 0px 14px #0000000d);
  border-image-slice: 1;

  .title-panel {
    padding-bottom: 20px;
  }

  .group-image {
    margin-right: 8px;
    border-radius: 16px;
    filter: drop-shadow(0px 0px 14px #0000000d);

    & > *:not(:first-child) {
      margin-top: 16px;
    }

    .group-image-section {
      overflow: hidden;
      background-color: #ffffff;
      border-radius: 16px;

      .group-image-box {
        width: 626px;
        height: 300px;
      }

      .group-image-txt {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 24px 32px;
        overflow: hidden;
        background-image: linear-gradient(359.5deg, #131824cc 1.9%, #2f31386e 56.4%, #4f4f4f00 97%);

        .image-title {
          font-size: 32px;
          line-height: 32px;
          color: #ffffff;
        }

        .image-sub-title {
          margin-top: 10px;
          font-size: 24px;
          line-height: 22px;
          color: #ffffffb3;
        }
      }
    }
  }
}

.time-txt {
  margin-top: 10px;
  font-size: 30px;
  line-height: 20px;
  color: #13131366;
}

.gradient-bar {
  width: 86px;
  height: 12px;
  background-image: linear-gradient(90deg, #ec913e 0%, #ecb03e00 100%);
}

.show-more {
  font-size: 28px;
  line-height: 26px;
  color: #13131366;
}
</style>
