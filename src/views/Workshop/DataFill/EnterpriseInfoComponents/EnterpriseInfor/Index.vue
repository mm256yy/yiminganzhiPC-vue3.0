<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px" v-if="showBox">
      <div class="flex items-center justify-between pb-12px"> </div>

      <div class="emptyBox" v-if="emptyShow">
        <img src="@/assets/imgs/empty.png" alt="" width="400" />
        <span>
          当前企业未进行数据填报，请
          <span
            style="color: rgba(62, 115, 236, 1); cursor: pointer; border-bottom: 1px solid"
            @click="onAddRow"
          >
            点击填报
          </span>
        </span>
      </div>
    </div>

    <EditForm
      :householdId="props.householdId"
      :show="dialog"
      :actionType="actionType"
      :rowdata="tableObject.currentRow"
      :doorNo="props.doorNo"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { ref, onMounted } from 'vue'
import EditForm from './EditForm.vue'
import { useTable } from '@/hooks/web/useTable'
import { getCompanyListApi, delCompanyByIdApi } from '@/api/workshop/enterprise/service'

interface PropsType {
  doorNo: string
  householdId
}
const showBox = ref(true)

const emptyShow = ref<boolean>(false)
const props = defineProps<PropsType>()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型

//

const { tableObject, methods } = useTable({
  getListApi: getCompanyListApi,
  delListApi: delCompanyByIdApi
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo
}

onMounted(async () => {
  await getList()
  if (tableObject.total > 0) {
    emptyShow.value = false
    dialog.value = true
    tableObject.currentRow = tableObject.tableList[0]
    actionType.value = 'edit'
    showBox.value = false
  } else {
    dialog.value = false
    emptyShow.value = true
    actionType.value = 'add'
    showBox.value = true
  }
})

const onAddRow = () => {
  emptyShow.value = false
  dialog.value = true
  showBox.value = false
}
</script>
<style lang="less">
.emptyBox {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
