<template>
  <div style="position: relative; width: 1000px; margin: 10px auto">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">新闻详情</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="box">
      <div class="back" @click="goback"> <img src="./icon_fh.png" alt="" /> 返回上一页</div>
      <div class="title">{{ data.title }}</div>
      <div class="annotate">
        <div style="margin-right: 30px">
          <span>作者 :&nbsp;</span> <span>{{ data.author }}</span></div
        >
        <div style="margin-right: 30px">
          <span>发布部门 :&nbsp;</span> <span>{{ data.typeText }}</span></div
        >
        <div>
          <span>发布时间 :&nbsp;</span> <span>{{ data.releaseTime }}</span></div
        >
      </div>
      <img :src="img" alt="" />
      <div class="content">
        <div v-html="data.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { useRouter } from 'vue-router'
import { detail } from '@/api/home'

const { currentRoute, go } = useRouter()

const { id } = currentRoute.value.query as any
const data = ref<any>({})
const img = ref<any>()
onMounted(() => {
  detail(id).then((res: any) => {
    data.value = res
    console.log(JSON.parse(res.coverPic)[0].url)

    img.value = JSON.parse(res.coverPic)[0].url
  })
})
const goback = () => {
  go(-1)
}
</script>

<style lang="less" scoped>
.box {
  position: relative;
  width: 1000px;
  padding: 80px 100px;
  margin: 10px auto;
  background-color: white;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;

  .back {
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    color: rgba(23, 23, 24, 0.4);
    cursor: pointer;
    align-items: center;
  }

  .title {
    height: 42px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-size: 30px;
    font-weight: bold;
    line-height: 35px;
    color: #171718;
    text-align: center;
  }

  .annotate {
    display: flex;
    height: 20px;
    margin: auto 0;
    margin-top: 25px;
    margin-bottom: 35px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    color: #171718;
    text-align: center;
    justify-content: center;
  }
}
</style>
