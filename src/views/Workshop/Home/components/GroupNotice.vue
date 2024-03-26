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
          <div class="item-title" v-for="(item, index) in notifyList" :key="index">
            <div>
              <span class="item-index">{{ index + 1 }}</span>
              <span class="item-content">{{ item.title }}</span>
            </div>
            <span class="item-time">{{ dayjs(item.createdDate).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--问题列表-->
    <div class="statistic-item" v-if="false">
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
import { ref, onMounted, computed } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import { getMessageFeedback, getNotify } from '@/api/home-service'
import type { MessageDtoType } from '@/api/home-types'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const userInfo = computed(() => appStore.getUserInfo)
const messageList = ref<MessageDtoType[]>([])
const notifyList = ref<any[]>([])
const role = ref<RoleCodeType>(RoleCodeType.other)
const currentProjectId = appStore.currentProjectId

// 获取消息
const getMessage = async () => {
  try {
    const result = await getMessageFeedback()
    messageList.value = result
  } catch (error) {
    console.log(error)
  }
}

// 角色代码
enum RoleCodeType {
  implementation = 'implementation', // 移民实施
  assessor = 'assessor', // 房屋评估
  assessorland = 'assessorland', // 土地评估
  other = 'other', // 其他 注意不是字典 用作区别 领导角色的,
  implementleader = 'implementleader' //实施组长
}

/**
 * 判断角色
 */
const getRole = () => {
  if (userInfo.value) {
    const project = userInfo.value.projectUsers.find((x: any) => x.projectId === currentProjectId)
    const role =
      project && project.roles && project.roles.length
        ? (project.roles[0].code as RoleCodeType)
        : RoleCodeType.other
    // 默认用户拥有一个角色 角色选择先不考虑
    return role
  }
  return RoleCodeType.other
}
// 获取消息通知
const getNotifyList = async () => {
  try {
    const result = await getNotify()
    // notifyList.value = result.content
    if (role.value == RoleCodeType.implementation || role.value == RoleCodeType.implementleader) {
      console.log('实施阶段')
      notifyList.value = result.content.filter(
        (item: any) => item.type == 'implementation,implementleader'
      )
    } else if (role.value == RoleCodeType.assessor || role.value == RoleCodeType.assessorland) {
      console.log('土地或者房屋阶段')
      notifyList.value = result.content.filter(
        (item: any) => item.type != 'implementation,implementleader'
      )
    }
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  // getMessage()
  getNotifyList()
  role.value = getRole()
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
    height: 610px;
    padding: 10px;
    margin-top: 20px;
    overflow: auto;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: auto;
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
