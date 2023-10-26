<template>
  <div class="app-container">
    <div class="section-detail">
      <div class="flex-row justify-between items-center group-detail">
        <div class="flex-row items-center">
          <div class="shrink-zero title-marker"></div>
          <span class="label-title">意见内容</span>
        </div>
      </div>
      <div class="item-input">
        <ElInput v-model="content" placeholder="请输入" :rows="8" type="textarea" />
      </div>
    </div>
    <!--底部固定区域-->
    <div class="footer">
      <div class="blue-btn" @click="onSubmit">提交</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElInput, ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { isEmpty } from '@/utils/is'
import { postFeedbackMessage } from './service'
const { back } = useRouter()
let route = useRoute()
const content = ref<string>('')

const onSubmit = () => {
  if (isEmpty(content)) {
    ElMessage.info('意见内容不能为空')
    return
  } else {
    postFeedbackMessages()
  }
}
let postFeedbackMessages = async () => {
  let data = await postFeedbackMessage({ feedbackId: route.query.id, remark: content.value })
  back()
  return data
}
</script>

<style lang="less" scoped>
.section-detail {
  padding: 24px 32px;
  margin: 30px;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 16px;
  filter: drop-shadow(0px 0px 14px #0000000d);

  .group-detail {
    padding-bottom: 16px;
    border-bottom: 2px solid #ebebeb;
  }

  .item-input {
    height: 350px;
    overflow-y: auto;
  }
}

.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: 128px;
  background: #ffffff;

  .blue-btn {
    height: 96px;
    margin: 16px 32px;
    font-size: 32px;
    line-height: 96px;
    color: #fff;
    text-align: center;
    background: linear-gradient(90deg, #3e73ec 0%, #3ea3ec 100%);
    border-radius: 16px;
  }
}
</style>
