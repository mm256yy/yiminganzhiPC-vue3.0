<template>
  <WorkContentWrap>
    <!-- 生产安置 —— 养老保险 -->
    <div class="table-wrap !py-12px !mt-0px">
      <ElTable :data="tableData" style="width: 100%" empty-text="该户无养老保险安置">
        <ElTableColumn label="序号" width="80" type="index" align="center" header-align="center" />
        <ElTableColumn label="姓名" prop="name" align="center" header-align="center" />
        <ElTableColumn
          label="与户主关系"
          prop="relationText"
          align="center"
          header-align="center"
        />
        <ElTableColumn label="身份证号" prop="card" align="center" header-align="center" />
        <ElTableColumn label="性别" prop="sexText" align="center" header-align="center" />
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
        <ElTableColumn label="安置方式" prop="settingWay" align="center" header-align="center">
          <template #default="scope">
            {{ scope.row.settingWay == '2' ? '养老保险' : '' }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="完成时间"
          prop="productionCompleteTime"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            {{
              row.productionCompleteTime
                ? dayjs(row.productionCompleteTime).format('YYYY-MM-DD')
                : ''
            }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="办理状态"
          prop="productionStatus"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            {{ row.productionStatus === '1' ? '已办理' : '未办理' }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="120" align="center" header-align="center" fixed="right">
          <template #default="{ row }">
            <ElButton type="primary" @click="handleClick(row)" v-if="row.productionStatus !== '1'"
              >办理</ElButton
            >
            <div v-else>-</div>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <!-- 办理 -->
    <Handle :show="dialog" :row="currentRow" voucherType="insure" @close="close" />
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import dayjs from 'dayjs'
import { WorkContentWrap } from '@/components/ContentWrap'
import Handle from './Handle.vue'
import { getDemographicListApi } from '@/api/workshop/population/service'

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
    status: props.baseInfo.status,
    page: 0,
    size: 50,
    doorNo: props.doorNo,
    settingWay: '2', // 养老保险 安置方式
    isDelete: '0'
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
