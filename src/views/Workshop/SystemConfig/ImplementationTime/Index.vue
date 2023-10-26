<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">系统配置</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">实施时间配置</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="table-wrap">
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />
        <ElTableColumn label="阶段" prop="type" align="center" header-align="center">
          <template #default="{ row }">
            {{ fmtDict(dictObj[391], row.type) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="预计开始时间" prop="startTime" align="center" header-align="center">
          <template #default="{ row }">
            <ElDatePicker
              v-model="row.startTime"
              type="date"
              class="!w-full"
              placeholder="请选择"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="预计完成时间" prop="endTime" align="center" header-align="center">
          <template #default="{ row }">
            <ElDatePicker v-model="row.endTime" type="date" class="!w-full" placeholder="请选择" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" :width="150" prop="" align="center" header-align="center">
          <template #default="{ row }">
            <ElButton link type="primary" @click="onSave(row)">保存</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElDatePicker,
  ElTable,
  ElTableColumn,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {
  getImplementationTimeListApi,
  saveImplementationTimeApi
} from '@/api/systemConfig/implementationTime-service'
import { ImplementationTimeDtoType } from '@/api/systemConfig/implementationTime-types'
import { fmtDict } from '@/utils'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const tableData = ref<any[]>([])

const initData = async () => {
  const result = await getImplementationTimeListApi({ projectId })
  if (result) {
    tableData.value = result.content
  }
}

// 保存
const onSave = (row: ImplementationTimeDtoType) => {
  saveImplementationTimeApi(row)
    .then((res) => {
      if (res) {
        ElMessage.success('操作成功')
        initData()
      }
    })
    .catch(() => {
      ElMessage.success('操作失败')
    })
}

onMounted(() => {
  initData()
})
</script>

<style lang="less" scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: right;
  margin-bottom: 10px;
}
</style>
