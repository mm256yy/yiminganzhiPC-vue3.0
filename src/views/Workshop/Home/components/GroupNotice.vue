<template>
  <div class="statistic">
    <div class="statistic-item">
      <div class="echart-title active">
        <img src="@/assets/imgs/icon_notice.png" class="icon" />
        <div>消息通知</div>
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
          <div class="item-title">
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
          </div>
        </div>
      </div>
    </div>
    <!--问题列表-->
    <div class="statistic-item">
      <div class="echart-title active">
        <img src="@/assets/imgs/icon_feed.png" class="icon" />
        <div>问题列表</div>
      </div>
      <div>
        <ElTable :data="messageList" style="width: 100%">
          <ElTableColumn prop="name" align="householder" label="户主/企业名称" />
          <ElTableColumn prop="typeText" align="center" label="工作阶段" />
          <ElTableColumn prop="remark" align="center" label="反馈问题内容" />
          <ElTableColumn prop="createdDate" label="反馈时间" align="center">
            <template #createdDate="{ row }">
              {{ row.createdDate ? dayjs(row.createdDate).format('YYYY-MM-DD') : '-' }}
            </template>
          </ElTableColumn>
          <ElTableColumn prop="statusText" align="center" label="处理结果" />
        </ElTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import { getMessageFeedback } from '@/api/home-service'
import type { MessageDtoType } from '@/api/home-types'
import dayjs from 'dayjs'

const messageList = ref<MessageDtoType[]>([])

// 获取消息
const getMessage = async () => {
  try {
    const result = await getMessageFeedback()
    messageList.value = result
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getMessage()
})

// const tabChange = (id: number) => {
//   if (currentTab.value === id) {
//     return
//   }
//   currentTab.value = id
// }

// const handleItemClick = (index: number) => {
//   menuIndex.value = index
// }
</script>

<style lang="less" scoped>
.statistic {
  width: 700px;

  .statistic-item {
    height: 295px;
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
  height: 34px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 400;
  line-height: 34px;
  color: #171718;
  align-items: center;
  justify-content: space-between;

  .title-index {
    padding-right: 12px;
    flex: 1;
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

    .item-index {
      width: 28px;
      height: 34px;
      padding-left: 10px;
      font-weight: 500;
      line-height: 34px;
      color: #131313;
      text-align: center;
    }

    .item-content {
      flex: 1;
      height: 34px;
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
