<template>
  <div class="statistic">
    <div class="statistic-item">
      <div class="echart-title active">
        <img src="@/assets/imgs/icon_notice.png" class="icon" />
        <div>消息通知222</div>
        <!-- <div class="more-box">更多</div> -->
      </div>
      <!--消息通知-->
      <div>
        <div class="top-title">
          <div>
            <span class="title-index">序号</span>
            <span class="title-content">内容</span>
          </div>
          <span class="time">发送时间</span>
        </div>
        <div class="list">
          <!-- <div class="item-title">
            <div>
              <span class="item-index">1</span>
              <span class="item-content">您有5还有居民已严重滞后，请推进实施工作</span>
            </div>
            <span class="item-time">2023-05-11</span>
          </div>
          <div class="item-title">
            <div>
              <span class="item-index">2</span>
              <span class="item-content">您有2户居民未开始填报，请推进实施工作</span>
            </div>
            <span class="item-time">2023-05-11</span>
          </div>
          <div class="item-title">
            <div>
              <span class="item-index">3</span>
              <span class="item-content">您有2户居民未开始填报，请推进实施工作</span>
            </div>
            <span class="item-time">2023-05-11</span>
          </div>
          <div class="item-title">
            <div>
              <span class="item-index">4</span>
              <span class="item-content">您有2户居民未开始填报，请推进实施工作</span>
            </div>
            <span class="item-time">2023-05-11</span>
          </div>
          <div class="item-title">
            <div>
              <span class="item-index">5</span>
              <span class="item-content">您有2户居民未开始填报，请推进实施工作</span>
            </div>
            <span class="item-time">2023-05-11</span>
          </div> -->
        </div>
      </div>
    </div>
    <!--信息反馈-->
    <div class="statistic-item">
      <div class="echart-title active">
        <img src="@/assets/imgs/icon_feed.png" class="icon" />
        <div>信息反馈</div>
        <div class="more-box" @click="more">更多</div>
      </div>
      <div>
        <div class="top-title">
          <div>
            <span class="title-index">序号</span>
            <span class="title-content">内容</span>
          </div>
          <span class="time">提交时间</span>
        </div>
        <div class="list">
          <div
            class="item-title"
            v-for="(item, index) in messageList"
            :key="index"
            @click="handleItemClick(item)"
          >
            <div>
              <span class="item-index">{{ index + 1 }}</span>
              <span class="item-content">{{ item.remark }}</span>
            </div>
            <span class="item-time">{{ dayjs(item.createdDate).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getMessageFeedback } from '@/api/home-service'
import type { MessageDtoType } from '@/api/home-types'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const { push } = useRouter()
const messageList = ref<MessageDtoType[]>([])
const more = () => {
  push('/Feedback/FeedbackIndex')
}
// 获取消息
const getMessage = async () => {
  try {
    const result = await getMessageFeedback()
    messageList.value = result
  } catch (error) {
    console.log(error)
  }
}

const handleItemClick = (item: MessageDtoType) => {
  push(`/Feedback/FeedbackDetail?id=${item.id}`)
}

onMounted(() => {
  getMessage()
})
</script>

<style lang="less" scoped>
.more-box {
  margin-left: 251px;
  font-size: 17px;
  font-weight: 400;
  color: #171718;
  cursor: pointer;
}

.statistic {
  width: 456px;

  .statistic-item {
    height: 338px;
    padding: 10px;
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 8px;
  }
}

.echart-title {
  display: flex;
  height: 44px;
  padding-left: 10px;
  font-size: 20px;
  font-weight: 600;
  line-height: 44px;
  color: #3e73ec;
  background: #ffffff;
  align-items: center;
  border-radius: 8px;

  &.active {
    color: #ffffff;
    background: linear-gradient(135deg, #1a63ff 0%, rgba(255, 255, 255, 0) 100%);
  }

  .icon {
    width: 23px;
    height: 23px;
    margin-right: 10px;
    line-height: 21px;
  }

  .span {
    font-size: 10px;
    font-weight: 400;
  }
}

.top-title {
  display: flex;
  height: 44px;
  font-size: 14px;
  font-weight: 400;
  line-height: 44px;
  color: #171718;
  align-items: center;
  justify-content: space-between;

  .title-index {
    padding-right: 12px;
  }

  .title-content {
    padding-left: 12px;
  }

  .time {
    padding-right: 12px;
  }
}

.list {
  overflow-y: auto;
  background: #ffffff;

  .item-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    cursor: pointer;

    .item-index {
      width: 28px;
      height: 44px;
      padding-left: 10px;
      font-weight: 500;
      line-height: 44px;
      color: #131313;
      text-align: center;
    }

    .item-content {
      width: 154px;
      height: 44px;
      padding-left: 18px;
      font-weight: 500;
      color: #131313;
      text-align: left;
    }

    .item-time {
      padding-right: 12px;
      font-size: 14px;
      font-weight: 500;
      color: #131313;
    }
  }
}
</style>
