<template>
  <WorkContentWrap>
    <!-- 择址确认 —— 坟墓择址 -->
    <!-- graveNumber 坟墓数量，当坟墓数量大于0时显示坟墓列表 -->
    <div class="table-wrap !py-12px !mt-0px" v-if="baseInfo.graveNumber">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="onDocumentation"> 档案上传 </ElButton>
          <!-- <ElButton
            class="!bg-[#30A952] !border-[#30A952]"
            type="primary"
            :icon="printIcon"
            @click="onPrint"
          >
            打印报表
          </ElButton> -->
          <ElButton
            class="!bg-[#30A952] !border-[#30A952]"
            type="primary"
            :icon="saveIcon"
            @click="onSave"
          >
            保存
          </ElButton>
        </ElSpace>
      </div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" width="80" type="index" align="center" header-align="center" />
        <ElTableColumn
          label="坟墓与登记人关系"
          prop="relationText"
          align="center"
          header-align="center"
        />
        <ElTableColumn label="材料" prop="materialsText" align="center" header-align="center" />
        <ElTableColumn label="穴位" prop="graveTypeText" align="center" header-align="center" />
        <ElTableColumn label="数量" prop="number" align="center" header-align="center" />
        <ElTableColumn label="处理方式" prop="handleWayText" align="center" header-align="center" />
        <ElTableColumn
          label="安置公墓/择址地址"
          prop="handleWay"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <!-- handleWay 处理方式，1 择址地址 2 安置公墓 -->
            <ElInput v-if="row.handleWay == 1" placeholder="请输入" v-model="row.settingAddress" />
            <div v-else-if="row.handleWay == 2">{{ row.settingGraveText }}</div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="编号" prop="graveNo" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入" v-model="row.graveNo" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入" v-model="row.remark" />
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <div v-else class="table-wrap !py-12px !mt-0px no-data"> 该户无需办理坟墓择址 </div>

    <!-- 归档 -->
    <OnDocumentation :show="dialog" :doorNo="props.doorNo" @close="closeDocumentationDialog" />
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useIcon } from '@/hooks/web/useIcon'
import { ElInput, ElButton, ElSpace, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import OnDocumentation from './OnDocumentation.vue'
import {
  getGraveListApi,
  saveGraveApi
} from '@/api/immigrantImplement/siteConfirmation/tombSiteSel-service'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
// const printIcon = useIcon({ icon: 'ion:print-outline' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })

const tableData = ref<any[]>([])
const dialog = ref<boolean>(false)
const emit = defineEmits(['updateData'])

// 获取列表数据
const getList = () => {
  let params = {
    householdId: props.baseInfo.id,
    projectId: props.baseInfo.projectId,
    status: props.baseInfo.status,
    registrantDoorNo: props.doorNo
  }
  getGraveListApi(params).then((res: any) => {
    tableData.value = res.content
  })
}

// 归档
const onDocumentation = () => {
  dialog.value = true
}

// 打印报表
// const onPrint = () => {
//   console.log('打印报表')
// }

// 保存
const onSave = () => {
  saveGraveApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
    getList()
    emit('updateData')
  })
}

/**
 * 关闭归档弹窗
 * @param flag
 */
const closeDocumentationDialog = (flag: boolean) => {
  dialog.value = false
  if (flag == true) {
    getList()
    emit('updateData')
  }
}

onMounted(() => {
  getList()
})
</script>
<style lang="less" scoped>
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  font-size: 15px;
}

.btn-txt {
  color: red;
  cursor: pointer;
}
</style>
