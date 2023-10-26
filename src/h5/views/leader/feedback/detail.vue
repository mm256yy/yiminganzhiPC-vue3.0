<template>
  <div class="app-container">
    <div class="section-detail">
      <div class="flex-row justify-between items-center group-detail">
        <div class="flex-row items-center">
          <div class="shrink-zero title-marker"></div>
          <span class="label-title">问题详情</span>
        </div>
      </div>
      <div class="item-info">
        <div class="group-left">
          <div class="left-text">户主</div>
          <div class="left-text">工作阶段</div>
          <div class="left-text">提交时间</div>
          <div class="left-text">处理结果</div>
          <div class="left-text">问题描述</div>
        </div>
        <div class="group-right">
          <div class="right-text">{{ dataList.data.householder || '-' }}</div>
          <div class="right-text">{{ dataList.data.type || '-' }}</div>
          <div class="right-text">{{
            dataList.data.createdDate
              ? dayjs(dataList.data.createdDate).format('YYYY-MM-DD HH:mm:ss')
              : '-'
          }}</div>
          <div class="right-text blue">{{ dataList.data.status || '-' }}</div>
          <div class="multiline">{{ dataList.data.remark || '-' }}</div>
        </div>
      </div>
    </div>
    <div class="section-detail">
      <div class="flex-row justify-between items-center group-detail">
        <div class="flex-row items-center">
          <div class="shrink-zero title-marker"></div>
          <span class="label-title">领导意见</span>
        </div>
      </div>
      <div class="item-comments">
        <div class="list-item" v-for="(item, index) in list" :key="index">
          <div class="item-header">
            <div class="flex-row items-center">
              <ElImage :src="iconAvatar" class="image-avatar" />
              <div class="item-name">{{ item.creater }}</div>
            </div>
            <div class="item-time">{{
              item.createdDate ? dayjs(item.createdDate).format('YYYY-MM-DD HH:mm:ss') : '-'
            }}</div>
          </div>
          <div class="section-line">
            <div v-show="showVerticalLine(index)" class="vertical-line"></div>
            <div
              class="item-content"
              :style="{ marginLeft: showVerticalLine(index) ? '' : '32px' }"
            >
              {{ item.remark }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--底部固定区域-->
    <div class="footer">
      <div class="blue-btn" @click="onFillComments">
        <ElImage class="fill-out" :src="iconContribute" fit="fill" />
        <span> 填写意见 </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElImage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import iconAvatar from '@/h5/assets/imgs/icon_avatar.png'
import iconContribute from '@/h5/assets/imgs/icon_contribute.png'
import { getFeedbackId } from './service'
import dayjs from 'dayjs'

let route = useRoute()
const list = ref<any[]>([
  {
    name: '张三',
    time: '2023-04-07 12:00:05',
    content: '测试文本123测试文本123测试文本123测试文本123'
  },
  {
    name: '李四',
    time: '2023-04-07 12:00:05',
    content: '测试文本456测试文本456测试文本456测试文本456'
  }
])
let dataList: any = reactive({
  data: {}
})

// 是否显示垂直线
const showVerticalLine = (index: number) => {
  return list.value && list.value.length > 1 && index !== list.value.length - 1
}

const { push } = useRouter()

const toLink = (routeName: string, query = {}) => {
  push({
    name: routeName,
    query
  })
}

// const active = computed(() => {
//   return list.value.length
// })

const onFillComments = () => {
  const name = 'fillComments'
  toLink(name, { id: route.query.id })
}
let getFeedbackIds = async () => {
  let data = await getFeedbackId(route.query.id)
  console.log(data)

  dataList.data = data
  list.value = data.feedbackMessageList
}
onMounted(() => {
  getFeedbackIds()
})
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

  .item-info {
    display: flex;
    align-items: center;
    padding-top: 16px;

    .group-left {
      width: 112px;
      text-align: right;

      .left-text {
        height: 48px;
        font-size: 28px;
        line-height: 48px;
        color: #666666;
      }
    }

    .group-right {
      max-width: calc(100% - 144px);
      margin-left: 32px;

      .right-text {
        font-size: 28px;
        font-weight: 400;
        line-height: 48px;
        color: #171718;

        &.blue {
          color: #3e73ec;
        }
      }

      .multiline {
        display: -webkit-box;
        overflow: hidden;
        font-size: 28px;
        font-weight: 400;
        line-height: 48px;
        color: #171718;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
      }
    }
  }

  .item-comments {
    padding: 16px 0;

    .list-item {
      height: 364px;

      .item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .image-avatar {
          width: 64px;
          height: 64px;
        }

        .item-name {
          margin-left: 24px;
          font-size: 32px;
          font-weight: 500;
          line-height: 38px;
          color: #171718;
        }

        .item-time {
          font-size: 28px;
          font-weight: 500;
          line-height: 33px;
          color: #13131366;
        }
      }

      .section-line {
        display: flex;
        align-items: center;

        .vertical-line {
          width: 2px;
          height: 290px;
          margin: 0 32px 0 30px;
          background: #ebebeb;
        }

        .item-content {
          width: 542px;
          height: 264px;
          padding: 32px;
          margin-top: 20px;
          overflow-y: auto;
          font-size: 28px;
          font-weight: 400;
          line-height: 33px;
          color: #131313;
          background: #fafafa;
          border-radius: 8px;
        }
      }
    }
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
    display: flex;
    height: 96px;
    margin: 16px 32px;
    font-size: 32px;
    line-height: 96px;
    color: #fff;
    text-align: center;
    background: linear-gradient(90deg, #3e73ec 0%, #3ea3ec 100%);
    border-radius: 16px;
    justify-content: center;
    align-items: center;
  }

  .fill-out {
    width: 32px;
    height: 32px;
    margin-right: 16px;
  }
}

.desc {
  display: flex;
  align-items: center;
}
</style>
