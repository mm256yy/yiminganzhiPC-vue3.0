<template>
  <WorkContentWrap>
    <!-- 相关手续 -->
    <div class="table-wrap !py-12px !mt-0px">
      <ElTable :data="tableData" style="width: 100%" empty-text="该户无自谋职业安置">
        <ElTableColumn label="序号" width="80" type="index" align="center" header-align="center" />
        <ElTableColumn label="办理项目" prop="name" align="center" header-align="center" />
        <ElTableColumn label="办理状态" prop="isComplete" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.needHandle === '0' ? '无须办理' : row.isComplete === '1' ? '已办理' : '未办理' }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="完成时间" prop="completeDate" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.completeDate ? dayjs(row.completeDate).format('YYYY-MM-DD') : '' }}
          </template>
        </ElTableColumn>

        <ElTableColumn label="操作" width="220" align="center" header-align="center" fixed="right">
          <template #default="{ row }">
            <ElButton type="primary" @click="handleClick(row, '1')">办理</ElButton>
            <ElButton type="default" @click="handleClick(row, '0')">无须办理</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <!-- 办理 -->
    <Handle :show="dialog" :row="currentRow" :door-no="props.doorNo" @close="close" />
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElButton, ElMessage, ElTable, ElTableColumn } from 'element-plus'
import dayjs from 'dayjs'
import Handle from './Handle.vue'
import { WorkContentWrap } from '@/components/ContentWrap'
import { getProceduresApi, saveProceduresApi } from '@/api/immigrantImplement/procedures/service'

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
  getProceduresApi(props.doorNo).then((res) => {
    if (res && res.length) {
      tableData.value = res
    }
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
const handleClick = (row: any, isComplete: string) => {
  if (isComplete === '1') {
    currentRow.value = { ...row }
    dialog.value = true
  } else {
    submit(row)
  }
}

onMounted(() => {
  getList()
})

const submit = (row: any) => {
  saveProceduresApi({
    doorNo: props.doorNo, // 户号
    type: row.type, // 字典373
    needHandle: '0', // 是否需要办理01
    isComplete: '1',
    id: row.id ? row.id : null,
    uid: row.uid ? row.uid : null
  }).then(() => {
    ElMessage.success('操作成功！')
    getList()
  })
}
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
