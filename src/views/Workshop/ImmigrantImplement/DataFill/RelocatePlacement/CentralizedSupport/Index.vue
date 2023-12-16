<template>
  <WorkContentWrap>
    <!-- 搬迁安置 —— 集中供养 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="sub-title">集中供养</div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" width="80" type="index" align="center" header-align="center" />
        <ElTableColumn label="姓名" prop="name" align="center" header-align="center" />
        <ElTableColumn
          label="与户主关系"
          prop="relationText"
          align="center"
          header-align="center"
        />
        <ElTableColumn label="身份证号" prop="card" align="center" header-align="center" />
        <ElTableColumn label="性别" prop="sex" align="center" header-align="center" />
        <ElTableColumn
          label="户籍类别"
          prop="censusTypeText"
          align="center"
          header-align="center"
        />
        <ElTableColumn
          label="人口性质"
          prop="populationNatureText"
          align="center"
          header-align="center"
        />
        <!-- <ElTableColumn
          label="安置方式"
          prop="settingWayText"
          align="center"
          header-align="center"
        /> -->
        <ElTableColumn
          label="完成时间"
          prop="relocateCompleteTime"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            {{
              row.relocateCompleteTime ? dayjs(row.relocateCompleteTime).format('YYYY-MM-DD') : '-'
            }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="办理状态" prop="relocateStatus" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.relocateStatus === '1' ? '已办理' : '未办理' }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="120" align="center" header-align="center" fixed="right">
          <template #default="{ row }">
            <ElButton type="primary" @click="handleClick(row)">办理</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <!-- 办理 -->
    <Handle :show="dialog" :row="currentRow" @close="close" />
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import dayjs from 'dayjs'
import { WorkContentWrap } from '@/components/ContentWrap'
import Handle from './Handle.vue'
import { getDemographicListApi } from '@/api/immigrantImplement/relocatePlacement/centralizedSupport-service'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()

const tableData = ref<any[]>([])
const dialog = ref<boolean>(false)
const currentRow = ref<any>({})

// 获取列表数据
const getList = () => {
  getDemographicListApi({
    projectId: props.baseInfo.projectId,
    page: 0,
    size: 50,
    doorNo: props.doorNo
  }).then((res) => {
    tableData.value = res.content
  })
}

// 关闭归档弹窗
const emit = defineEmits(['updateData'])
const close = () => {
  dialog.value = false
  getList()
  emit('updateData')
}

/**
 * 办理
 * @param row 当前行信息
 */
const handleClick = (row: any) => {
  currentRow.value = { ...row }
  dialog.value = true
}

onMounted(() => {
  getList()
})
</script>
<style lang="less" scoped>
.table-wrap {
  .sub-title {
    margin-bottom: 20px;
    font-size: 14px;
    color: #171718;
  }
}

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
