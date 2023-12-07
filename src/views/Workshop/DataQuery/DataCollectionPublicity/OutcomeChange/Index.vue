<template>
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
    <!-- 按实物变动 -->
    <ChangeIndex v-if="tabCurrentId === 0" />
    <!-- 按人口变动 -->
    <Population v-if="tabCurrentId === 1" />
    <!-- 按房屋变动 -->
    <House v-if="tabCurrentId === 2" />
    <!-- 按附属物变动 -->
    <Appendant v-if="tabCurrentId === 3" />
    <!-- 按零星果木变动 -->
    <FruitTree v-if="tabCurrentId === 4" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElButton } from 'element-plus'
import { getsummaryApi } from '@/api/workshop/dataQuery/fruitWood-service'
import ChangeIndex from './DataFill/ChangeIndex.vue'
import Appendant from './DataFill/Appendant.vue'
import FruitTree from './DataFill/FruitTree.vue'
import House from './DataFill/House.vue'
import Population from './DataFill/Population.vue'

const feeTableData = ref<any[]>([]) // 费用补偿情况列表
const tabCurrentId = ref<number>(0)

const tabsList = [
  {
    id: 0,
    name: '按实物变动'
  },
  {
    id: 1,
    name: '按人口变动'
  },
  {
    id: 2,
    name: '按房屋变动'
  },
  {
    id: 3,
    name: '按附属物变动'
  },
  {
    id: 4,
    name: '按零星果木变动'
  }
]

const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
}

// 获取费用补偿情况列表
const getRewardFeeList = () => {
  getsummaryApi({}).then((res: any) => {
    feeTableData.value = res
  })
}

onMounted(() => {
  getRewardFeeList()
})
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

:deep(.el-dialog__body) {
  padding-right: 60px;
  padding-left: 60px;
}

:deep(.el-form-item) {
  padding: 0 10px;
}

.title {
  margin: 5px 0;
  font-family: PingFang SC-Bold, PingFang SC;
  font-size: 16px;
  font-weight: bold;
  color: #171718;
}

.change-list {
  el-pagination {
    display: none !important;
  }
}

.text {
  font-family: PingFang SC-Regular, PingFang SC;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
}

:deep(.change-list .gray-row .el-table__cell) {
  background: #ebebeb;
}

:deep(.change-list .el-table .name-row) {
  border-right: none;
}

:deep(.change-list .el-table__body .el-table__row:nth-child(18) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.change-list .el-table__body .el-table__row:nth-child(21) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.change-list .el-table__body .el-table__row:nth-child(23) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.change-list .el-table--border::before) {
  background: #fff;
}

:deep(.change-list .el-table__border-left-patch) {
  width: 0;
}

:deep(.change-list .el-table--border::after) {
  background: #fff;
}

:deep(.change-list .el-table--border .el-table__inner-wrapper::after) {
  background: #fff;
}

.data-fill-body {
  padding-top: 10px;
  margin-top: -10px;
  background-color: #fff;
}
</style>
