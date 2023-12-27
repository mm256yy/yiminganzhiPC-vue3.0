<template>
  <WorkContentWrap>
    <MigrateCrumb :titles="titles" />
    <div class="data-fill-head">
      <div class="head-top">
        <div class="tabs">
          <div
            :class="['tab-item', tabCurrentId === item.id ? 'active' : '']"
            v-for="item in tabsList"
            :key="item.id"
            @click="onTabClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="data-fill-body">
      <!-- 按户查询 -->
      <Query v-if="tabCurrentId === 1" />

      <!-- 区域报表 -->
      <Region v-else />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Query from './Query.vue' // 按户查询
import Region from './Region.vue' // 区域报表
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'

const tabCurrentId = ref<number>(1)
const tabsList = [
  {
    id: 1,
    name: '按户查询'
  },
  {
    id: 2,
    name: '区域报表'
  }
]
const titles = ['智能报表', '实物成果', '居民户', '附属物']

const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
}
</script>
<style lang="less" scoped>
.data-fill-head {
  position: relative;
  padding: 14px 16px;
  margin-top: 6px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 4px 6px 0px rgba(33, 63, 98, 0.17);

  .head-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tabs {
    display: flex;
    align-items: center;

    .tab-item {
      display: flex;
      height: 32px;
      padding: 0 20px;
      margin-right: 4px;
      font-size: 14px;
      color: #000;
      cursor: pointer;
      background: #f0f2f7;
      border-radius: 10px 10px 0px 0px;
      align-items: center;

      &.active {
        color: #fff;
        background-color: var(--el-color-primary);
      }
    }
  }
}

.report-tabs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .report-tab-item {
    display: flex;
    height: 32px;
    padding: 0 16px;
    margin: 14px 8px 0 0;
    font-size: 14px;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    align-items: center;

    .tit {
      margin-left: 6px;
      // user-select: none;
    }

    &.active {
      color: var(--el-color-primary);
      background: #e9f0ff;
      border: 1px solid var(--el-color-primary);
    }
  }
}

.data-fill-body {
  padding-top: 10px;
  margin-top: -10px;
  background-color: #fff;
}

.report-dialog {
  .report-cont {
    padding: 22px 55px;
    margin: 0 auto;
    background: #f5f7fa;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .report-item {
      display: flex;
      height: 32px;
      font-size: 14px;
      line-height: 32px;
      align-items: center;

      .report-tit {
        margin-right: 16px;
        color: rgba(19, 19, 19, 0.6);
        text-align: right;
      }

      .report-txt {
        font-weight: 500;
        color: var(--text-color-1);
      }
    }
  }

  .tips {
    display: flex;
    align-items: center;
    margin-top: 16px;
    font-size: 14px;
    color: var(--text-color-1);
  }
}
</style>
