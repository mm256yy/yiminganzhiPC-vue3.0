<template>
  <div class="index">
    <div class="topBox">
      <ElButton
        @click="onBack"
        :icon="BackIcon"
        type="default"
        class="px-9px py-0px !h-28px mr-8px !text-12px"
      >
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">首页</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">工作台</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">更多</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="newsBox">
      <div class="title">{{ newsDetail.title }}</div>
      <div class="content">
        <div class="one mr-50">作者：{{ newsDetail.author }} </div>
        <!-- <div class="one">发布部门：运营部</div> -->
        <div class="one">发布时间：{{ newsDetail.releaseTime }}</div>
      </div>
      <div class="img">
        <img :src="img" alt="" />
      </div>
      <div class="contentHtml" v-html="newsDetail.content"> </div>
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
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { listDictDetailApi } from '@/api/sys/index'
import { useAppStore } from '@/store/modules/app'
import { detail } from '@/api/home'

const router = useRouter()
const route = useRoute()

const activeName2 = ref('水库要闻')
const pageNum = ref(0)
const totalNum = ref(0)
const img = ref('')
const newsDetail = ref<any>([])

const { back, push } = useRouter()
const onBack = () => {
  back()
}

// 新闻详情
const requestNewsData = (type = '1') => {
  detail(route.query.id).then(
    (res: any) => {
      console.log(1111, res)

      newsDetail.value = res
      if (res.coverPic) {
        img.value = JSON.parse(res.coverPic)[0].url
      }
    },
    (err) => {
      console.log('err', err)
    }
  )
}

onMounted(() => {
  requestNewsData()
})
</script>

<style lang="less" scoped>
.topBox {
  display: flex;
  align-items: center;
}
.newsBox {
  background: #fff;
  border-radius: 8px 8px 8px 8px;
  padding: 32px 100px;
  margin-top: 20px;

  .title {
    font-weight: bold;
    font-size: 30px;
    color: #171718;
    line-height: 35px;
    margin-bottom: 18px;
    text-align: center;
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    .one {
      font-weight: 400;
      font-size: 14px;
      color: #171718;
      line-height: 16px;
    }
    .mr-50 {
      padding-right: 50px;
    }
  }

  .img {
    width: 100%;
    margin: 40px auto 25px auto;
    display: flex;
    justify-content: center;
    img {
      max-width: 100%;
    }
  }

  .contentHtml {
    font-weight: 500;
    font-size: 14px;
    color: #171718;
    line-height: 24px;
  }
}
</style>
