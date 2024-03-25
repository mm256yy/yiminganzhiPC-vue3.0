<template>
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
      <ElBreadcrumbItem class="text-size-12px"> 档案管理 </ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px"> {{ breadcrumbTitles[type] }} </ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>

  <div class="data-fill-head">
    <!--基础信息-->
    <BaseInfo
      :doorNo="doorNo"
      :baseInfo="baseInfo"
      :householdId="Number(householdId)"
      :type="type"
    />
    <div class="head-top">
      <div class="tabs">
        <div
          :class="['tab-item', tabCurrentId == item.id ? 'active' : '']"
          v-for="item in getTabsByType(type)"
          :key="item.id"
          @click="onTabClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>

  <div class="data-fill-body">
    <!-- <Enclosure v-if="showEnclosure" :doorNo="doorNo" :householdId="householdId" /> -->
    <UploadField
      v-if="showUploadField || showUpload"
      :type="type"
      :tabIndex="tabCurrentId"
      :doorNo="doorNo"
    />
    <div v-else v-loading="loading" class="flex-display">
      <div
        v-for="(item, index) in fileList"
        :key="index"
        class="image-wrapper"
        @click="onImageClick(item)"
      >
        <ElImage style="width: 50px; height: 50px" :src="documentSrc" fit="cover" />
        <div class="image-txt">{{ item.name }}</div>
      </div>
    </div>
  </div>

  <!-- 图片查看弹框 -->
  <PictureDialog :isShow="dialogShow" :title="dialogTitle" :files="files" @close="onDialogClose" />
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElImage } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { getFileMangeList } from '@/api/fileMng/service'
import type { FileMngDtoType, FileDtoType } from '@/api/fileMng/types'
import documentSrc from '@/assets/imgs/icon_document.png'
import { useRouter } from 'vue-router'
import PictureDialog from './components/PictureDialog/Index.vue'
import UploadField from './components/UploadField/Index.vue'
import Enclosure from '@/views/Workshop/FileMng/DataFill/components/Enclosure/Index.vue' // 附件上传
import BaseInfo from './components/BaseInfo.vue'
import {
  getLandlordByIdApi,
  getProfessionalDetailByIdApi
} from '@/api/putIntoEffect/putIntoEffectDataFill/service'
import {
  breadcrumbTitles,
  houseHoldTabs,
  commonTabs,
  professionTabs,
  fileLandNoMoveTabs
} from './config'

const { currentRoute, back } = useRouter()
const tabCurrentId = ref<number>(1)
const { householdId, doorNo, type, setTop } = currentRoute.value.query as any
const BackIcon = useIcon({ icon: 'iconoir:undo' })

const getTabsByType = (type) => {
  const map = {
    0: houseHoldTabs,
    1: commonTabs,
    2: commonTabs,
    3: commonTabs,
    4: professionTabs, // 专业项目
    5: fileLandNoMoveTabs // 只征地不搬迁
  }
  return map[type]
}
onMounted(() => {
  tabCurrentId.value = setTop
})
const dialogShow = ref<boolean>(false)
const fileList = ref<FileDtoType[]>([])
const dialogTitle = ref<string>('')
const files = ref<string>('')
const loading = ref<boolean>(false)
const baseInfo = ref<any>({}) // 基础信息
const requestType = ref<number>(1) // 请求类型

// 是否专业项目
const isProfessional = computed(() => {
  return type === '4'
})

const showEnclosure = computed(() => {
  return type !== '4' && tabCurrentId.value === 3
})

// 显示上传模块
const showUploadField = computed(() => {
  return type === '4' ? tabCurrentId.value > 1 : tabCurrentId.value === 4
})

const showUpload = computed(() => {
  return type === '5' && tabCurrentId.value === 3
})

const getLandlordInfo = () => {
  if (!householdId) return

  if (isProfessional.value) {
    getProfessionalDetailByIdApi(householdId).then((res) => {
      baseInfo.value = { ...res }
    })
  } else {
    getLandlordByIdApi(householdId).then((res) => {
      baseInfo.value = { ...res }
    })
  }
}

getLandlordInfo()

const onImageClick = (item: FileDtoType) => {
  dialogTitle.value = item.name
  files.value = item.files
  dialogShow.value = true
}

const requestFileMngList = (type) => {
  const params: FileMngDtoType = {
    id: isProfessional.value ? householdId : undefined,
    doorNo,
    type
  }

  loading.value = true

  getFileMangeList(params).then(
    (res) => {
      loading.value = false
      fileList.value = res
    },
    (err) => {
      console.log(err)
      loading.value = false
    }
  )
}

const chooseType = (type: string) => {
  // 一户一档
  // console.log('chooseTypeTag', tabCurrentId.value)

  if (type === '0') {
    requestType.value = tabCurrentId.value
  } else if (type === '1') {
    // 企业
    requestType.value = tabCurrentId.value === 1 ? 4 : 5
  } else if (type === '2') {
    // 个体户
    requestType.value = tabCurrentId.value === 1 ? 4 : 5
  } else if (type === '3') {
    // 村集体
    requestType.value = tabCurrentId.value === 1 ? 6 : 7
  } else if (type === '4') {
    // 专业项目
    requestType.value = tabCurrentId.value === 1 ? 8 : 1
  } else {
    // 只征地不搬迁
    requestType.value = tabCurrentId.value === 1 ? 9 : 10
  }

  if (tabCurrentId.value === 3) {
    requestType.value = 11
  }
  requestFileMngList(requestType.value)
}

chooseType(type)

const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
  chooseType(type)
}

const onDialogClose = () => {
  dialogShow.value = false
}

const onBack = () => {
  back()
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
    margin-top: 20px;
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
    }

    &.active {
      color: var(--el-color-primary);
      background: #e9f0ff;
      border: 1px solid var(--el-color-primary);
    }
  }
}

.data-fill-body {
  min-height: 300px;
  background-color: #fff;

  .flex-display {
    display: flex;
    flex-wrap: wrap;
    padding: 40px;

    .image-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 40px;
      cursor: pointer;

      .image-txt {
        font-size: 14px;
        color: #171718;
      }
    }
  }
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

<style lang="less">
.el-divider--horizontal {
  margin: 8px 0 24px;
}

.report-dialog {
  .el-dialog__body {
    padding: 16px 40px !important;
  }
}

.datafill-content {
  padding: 12px 16px 16px;
  background: #ffffff;
  border-radius: 4px;
}
</style>
