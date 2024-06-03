<template>
  <WorkContentWrap>
    <!-- 择址确认 —— 坟墓择址 -->
    <!-- graveNumber 坟墓数量，当坟墓数量大于0时显示坟墓列表 -->
    <div class="table-wrap !py-12px !mt-0px" v-if="baseInfo.graveNumber">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton
            type="primary"
            @click="() => openurl({ doorNo, type: 'household_address_grave' }, handelurl)"
          >
            查看历史签字
          </ElButton>
          <ElButton type="primary" @click="onDocumentation"> 进度上报 </ElButton>
          <ElButton type="primary" @click="comdbe"> 打印 </ElButton>
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
    <div style="position: fixed; left: -1000px; width: 210mm; padding: 0 40px 0 40px" id="anztable">
      <h1 style="font-size: 24px; font-weight: bold; text-align: center">坟墓择址确认单</h1>
      <div
        style="
          display: flex;
          margin: 20px 0 20px 0;
          font-size: 18px;
          justify-content: space-between;
        "
      >
        <div>
          {{ `${baseInfo.areaCodeText}${baseInfo.townCodeText}${baseInfo.villageText}` }}
          <span style="text-decoration-line: underline"> {{ baseInfo.name }} </span>
          户号 <span style="text-decoration-line: underline">{{ baseInfo.showDoorNo }}</span>
        </div>

        <div>{{ data }}</div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        header-cell-class-name="table-headers"
        cell-class-name="table-cellss"
      >
        <el-table-column prop="relation" width="130" label="坟墓与登记人关系" align="center">
          <template #default="{ row }">
            {{ dictFmt(row.relation, 307) }}
          </template>
        </el-table-column>
        <el-table-column prop="number" label="数量" width="50" align="center" />
        <el-table-column prop="handleWayText" label="处理方式" width="80" align="center" />
        <el-table-column prop="settingGrave" label="安置公墓/择址地址" width="130" align="center">
          <template #default="{ row }">
            <!-- handleWay 处理方式，1 择址地址 2 安置公墓 -->
            <dib v-if="row.handleWay == 1">{{ row.settingAddress }}</dib>
            <div v-else-if="row.handleWay == 2">{{ row.settingGraveText }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="graveNo" label="编号" width="50" align="center" />
        <el-table-column label="备注" align="center">
          <template #default></template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: space-between; height: 50px">
        <div style="line-height: 50px; border: 1px solid black; border-top: 0px; flex: 1"
          >户主代表或收委托人(签名)：</div
        ><div style="line-height: 50px; border: 1px solid black; border-top: 0px; flex: 1">
          联系移民干部(签名)：</div
        >
      </div>
    </div>
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useIcon } from '@/hooks/web/useIcon'
import { ElInput, ElButton, ElSpace, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import OnDocumentation from './OnDocumentation.vue'
import {
  getGraveListApi,
  saveGraveApi
} from '@/api/immigrantImplement/siteConfirmation/tombSiteSel-service'
import { debounce, openurl } from '@/utils/index'
import dayjs from 'dayjs'
import { htmlToPdf } from '@/utils/ptf'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { handelurl } from '@/api/immigrantImplement/common-service'

interface PropsType {
  doorNo: string
  baseInfo: any
  householdId: any
}
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

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
  // tableData.value.forEach((item) => {
  //   item.villageDoorNo = props.doorNo
  //   item.villageId = props.householdId
  // })
  let parmas = { immigrantGraveList: tableData.value, peasantHouseholdId: props.householdId }

  saveGraveApi(parmas).then(() => {
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
let data = ref()
let comdbe = () => {
  data.value = dayjs(new Date()).format('YYYY年MM月DD日')
  debounce(() => {
    // ElMessage.error('待业主提供模板')

    htmlToPdf('#anztable', '坟墓择址确认单')
  })
}

const dictFmt = (value, index) => {
  if (value && dictObj.value[index] && dictObj.value[index].length > 0) {
    const item = dictObj.value[index].find((item: any) => item?.value === value)
    return item ? item.label : value
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

#anztable {
  :deep(.table-headers) {
    font-size: 12px;
    font-weight: bold;
    background: none;
  }

  .el-table {
    --el-table-border-color: black;
    --el-table-border: 1px solid black;
  }

  :deep(.table-cellss) {
    .cell {
      font-size: 10px;
      background: none;
    }
  }
}
</style>
