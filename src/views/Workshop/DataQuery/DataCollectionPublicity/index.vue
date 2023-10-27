<template>
  <WorkContentWrap v-loading="exportLoading">
    <div class="flex items-center">
      <ElButton
        @click="onBack"
        :icon="BackIcon"
        type="default"
        class="px-9px py-0px !h-28px mr-8px !text-12px"
      >
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">数据查询</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">{{ initNavMsg() }}</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <div class="data-head">
      <!-- Tabs -->
      <div class="tabs-wrapper">
        <div
          :class="['tab-item', tabCurrentId === item.id ? 'active' : '']"
          v-for="item in TabDatas"
          :key="item.id"
          @click="onTabClick(item)"
        >
          <Icon :icon="item.icon" color="#3E73EC" />
          <div class="title">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <div class="data-body">
      <!-- 人口房屋公示 -->
      <PopulationHousing v-if="tabCurrentId === TabDataIds[0]" @export="onExport" />

      <!-- 附属物公示 -->
      <Accessory v-else-if="tabCurrentId === TabDataIds[1]" @export="onExport" />

      <!-- 零星(林)果木公示 -->
      <FruitWood v-else-if="tabCurrentId === TabDataIds[2]" @export="onExport" />

      <!-- 村集体公示 -->
      <VillageCollective v-else-if="tabCurrentId === TabDataIds[3]" @export="onExport" />

      <!-- 土地公示 -->
      <Land v-else-if="tabCurrentId === TabDataIds[4]" @export="onExport" />

      <!-- 坟墓公示 -->
      <Grave v-else-if="tabCurrentId === TabDataIds[5]" @export="onExport" />

      <!-- 实物成果汇总表列表 -->
      <Achievements v-else-if="tabCurrentId === TabDataIds[6]" @export="onExport" />
    </div>

    <!-- 数据导出 -->
    <ElDialog
      class="data-export-dialog"
      title="数据导出"
      alignCenter
      appendToBody
      destroy-on-close
      :model-value="visible"
      :width="400"
      :closeOnClickModal="false"
      @close="onClose"
    >
      <div class="tree-wrapper">
        <div class="label">所属区域</div>
        <el-tree-select
          class="village-tree"
          v-model="villageCode"
          :data="villageTree"
          multiple
          :props="treeProps"
          :render-after-expand="false"
        />
      </div>
      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onConfirm">确认</ElButton>
      </template>
    </ElDialog>
  </WorkContentWrap>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElDialog,
  ElMessage,
  ElTreeSelect
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useIcon } from '@/hooks/web/useIcon'
import { TabDataIds, TabDatas, exportTypes } from './config'

import PopulationHousing from './PopulationHousing/Index.vue' // 人口房屋公示
import Accessory from './Accessory/Index.vue' // 附属物公示
import FruitWood from './FruitWood/Index.vue' // 零星(林)果木公示
import VillageCollective from './VillageCollective/Index.vue' // 村集体公示
import Land from './Land/Index.vue' // 土地公示
import Grave from './Grave/Index.vue' // 坟墓公示
import Achievements from './Achievements/Index.vue' //  实物成果汇总表列表

import { exportPublicityApi } from '@/api/workshop/dataQuery/common-service'

const treeProps = {
  label: 'name',
  value: 'code'
}

const { back } = useRouter()
const tabCurrentId = ref<number>(TabDataIds[0])

const visible = ref<boolean>(false)
const villageTree = ref<any[]>([])
const villageCode = ref<string>('')
const type = ref<string>(exportTypes.house) // 导出类型
const exportLoading = ref<boolean>(false)

const BackIcon = useIcon({ icon: 'iconoir:undo' })

// 初始化导航信息
const initNavMsg = () => {
  return '实采数据公示'
}

/**
 * 点击 tab 切换
 * @param tabItem tab 当前项信息
 */
const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
}

/**
 * 数据导出
 * @param{Object} data 行政村相关数据
 */
const onExport = async (data: any, exportType: string) => {
  villageTree.value = data
  visible.value = true
  type.value = exportType
}

/**
 * 导出文件
 * @param{Object} result 文件对象
 */
const exportFile = (result: any) => {
  let filename = result.headers
  filename = filename['content-disposition']
  filename = filename.split(';')[1].split('filename=')[1]
  filename = decodeURIComponent(filename)
  let elink = document.createElement('a')
  document.body.appendChild(elink)
  elink.style.display = 'none'
  elink.download = filename
  let blob = new Blob([result.data])
  const URL = window.URL || window.webkitURL
  elink.href = URL.createObjectURL(blob)
  elink.click()
  document.body.removeChild(elink)
  URL.revokeObjectURL(elink.href)
  exportLoading.value = false
}

// 确认
const onConfirm = async () => {
  visible.value = false
  exportLoading.value = true
  if (!villageCode.value || villageCode.value.length === 0) {
    exportLoading.value = false
    ElMessage.warning('请选择所属区域')
    return
  }
  console.log('111')
  const res = await exportPublicityApi({
    villageCode: villageCode.value,
    exportType: type.value
  }).catch(() => {
    exportLoading.value = false
  })
  exportFile(res)
}

// 取消
const onClose = () => {
  visible.value = false
  villageCode.value = ''
  type.value = exportTypes.house
}

// 返回
const onBack = () => {
  back()
}
</script>

<style lang="less" scoped>
.data-head {
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

  .tabs-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .tab-item {
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

      .title {
        margin-left: 6px;
      }

      &.active {
        color: var(--el-color-primary);
        background: #e9f0ff;
        border: 1px solid var(--el-color-primary);
      }
    }
  }
}

.data-body {
  padding-top: 10px;
  margin-top: -10px;
  background-color: #fff;
}

.data-export-dialog {
  .el-dialog__body {
    padding: 16px 40px !important;
  }

  .data-export-content {
    padding: 22px 55px;
    margin: 0 auto;
    background: #f5f7fa;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}

.el-divider--horizontal {
  margin: 8px 0 24px;
}

.tree-wrapper {
  display: flex;
  align-items: center;

  .label {
    margin-right: 10px;
    font-size: 14px;
    color: #666;
  }

  .village-tree {
    width: 280px;
  }
}
</style>
