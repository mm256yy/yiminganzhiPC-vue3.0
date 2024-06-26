<template>
  <ElDialog
    title="付款对象选择"
    :model-value="props.show"
    :width="1200"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <div v-if="props.type == true">
      <ElButton @click="addDemo" type="primary" style="float: right; margin-bottom: 10px"
        >添加</ElButton
      >
      <ElTable :data="tableDatas" style="width: 100%" class="mb-20" :border="true" row-key="id">
        <ElTableColumn
          label="序号"
          align="center"
          width="80"
          type="index"
          header-align="center"
          prop="index"
        />
        <ElTableColumn label="支付对象" align="center" prop="payObject" header-align="center">
          <template #default="{ row }">
            <ElSelect class="w-350px" v-model="row.contractId">
              <ElOption
                v-for="item in dictObj[393]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="申请金额" prop="contractName" align="center" header-align="center">
          <!-- <ElInputNumber class="!w-200px" /> -->
          <template #default="{ row }">
            <ElInputNumber class="!w-200px" v-model="row.amount" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="操作"
          prop="contractName"
          align="center"
          header-align="center"
          width="80"
        >
          <template #default="{ row }">
            <ElButton @click="delDemo(row)" type="primary" style="float: right; margin-bottom: 10px"
              >删除</ElButton
            >
          </template>
        </ElTableColumn>
      </ElTable>

      <div>合计金额:{{ amountPricess }}元</div>
    </div>
    <div v-else>
      <div
        style="
          display: flex;
          align-items: baseline;
          font-size: 12px;
          justify-content: space-between;
        "
      >
        <div style="display: flex; align-items: baseline">
          <span style="margin-right: 10px">区域:</span>
          <!-- <ElInput type="primary" style="width: 240px; margin-bottom: 10px" v-model="code" /> -->
          <ElTreeSelect
            v-model="code"
            :data="districtTree"
            :props="{ value: 'code', label: 'name' }"
            check-strictly
          />
        </div>
        <div style="display: flex; align-items: baseline">
          <span style="margin-right: 10px">关键字:</span>
          <ElInput type="primary" style="width: 240px; margin-bottom: 10px" v-model="search" />
        </div>

        <ElButton type="primary" style="margin-bottom: 10px" @click="searchClick">搜索</ElButton>
      </div>

      <ElTable
        :data="tableData"
        style="width: 100%"
        class="mb-20"
        :border="true"
        v-if="props.type == false"
        row-key="id"
      >
        <ElTableColumn label="序号" align="center" width="50" type="index" header-align="center" />
        <ElTableColumn label="专项名称" align="center" prop="projectName" header-align="center" />
        <ElTableColumn label="合同名称" prop="contractName" align="center" header-align="center" />
        <ElTableColumn label="合同编号" prop="contractCode" align="center" header-align="center" />
        <ElTableColumn
          label="合同金额(元)"
          prop="contractAmount"
          align="center"
          header-align="center"
        />
        <ElTableColumn
          label="支付节点"
          prop="paymentNode"
          align="center"
          header-align="center"
          width="400"
        >
          <template #default="{ row }">
            <ElCheckboxGroup
              v-model:model-value="check"
              @change="
                (val) => {
                  checkList(val, row, row.id)
                }
              "
            >
              <div style="height: 40px" v-for="item in row.nodeDtoList" :key="item.id">
                <ElCheckbox
                  :label="item.id"
                  :disabled="item.payStatus == '2' || item.amount == item.payedAmount"
                  >{{
                    formatDate(item.paymentDate) +
                    ' ' +
                    '金额:' +
                    item.amount +
                    '元' +
                    `,已支付金额 :` +
                    (item.payedAmount || 0) +
                    '元'
                  }}</ElCheckbox
                >
                <div style="color: red; height: 20px; font-size: 12px" v-if="item.payStatus == '2'">
                  *（该节点存在审批中申请，无法再次提交申请）
                </div>
              </div>
            </ElCheckboxGroup>
          </template>
        </ElTableColumn>

        <ElTableColumn label="申请金额" align="center" header-align="center" width="200">
          <template #default="{ row }">
            <div style="height: 40px" v-for="item in row.nodeDtoList" :key="item.id">
              <ElInputNumber
                v-model="item.amounts"
                :disabled="item.payStatus == '2' || item.amount == item.payedAmount"
                :max="item.amount - (item.payedAmount || 0)"
              />
            </div>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <template #footer>
      <ElButton @click="onClose(false)">取消</ElButton>
      <ElButton type="primary" @click="addSubmit(false)">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElDialog,
  ElButton,
  ElSelect,
  ElOption,
  ElInputNumber,
  ElMessage,
  ElCheckboxGroup,
  ElCheckbox,
  ElInput,
  ElTreeSelect
} from 'element-plus'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getPaymentApplicationPpsList } from '@/api/fundManage/paymentApplication-service'
import { formatDate } from '@/utils/index'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
interface PropsType {
  show: any
  type: any
  selence?: any
  tableList?: any
}
// const formRef = ref<any>()
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict', 'objlist', 'tableList'])
// const payObject = ref()
// 关闭弹窗
const onClose = (flag: boolean) => {
  check.value = []
  tableDatas.value = []
  emit('close', flag)
}
const addSubmit = (flag: boolean) => {
  tableObj.value = tableData.value.reduce((pre, item) => {
    let nevArr = item.nodeDtoList.filter(
      (res) => check.value.indexOf(res.id) != -1 && res.amounts > 0
    )

    if (nevArr.length > 0) {
      pre.push({ ...item, nodeDtoList: nevArr })
    }
    return pre
  }, [])

  emit('objlist', tableDatas.value)
  emit('tableList', tableObj.value)
  emit('close', flag)
}
const dataId = ref<number>(0)
const amountPrice = ref<number>(0)
const check = ref<any>()
const tableData = ref<any[]>([])
const tableObj = ref<any[]>([]) //付款对象集合
const vals = ref<any[]>([]) //付款对象ID
const checkList = (res: any, row: any, val: any) => {
  // vals.value.push(val)
  console.log(res, row, val)
  console.log(tableObj.value, '测试传递的数据')
}
const tableDatas = ref<any[]>([])
const addDemo = () => {
  const d = {
    index: dataId.value++,
    contractId: '',
    amount: ''
  }
  tableDatas.value.push(d)
  amountPrice.value = tableDatas.value.reduce((c, item) => c + item.amount * 1, 0)
  console.log(tableDatas.value, amountPrice.value, '打印传递的计算值')
}
let amountPricess = computed(() => {
  return tableDatas.value.reduce((c, item) => c + item.amount * 1, 0)
})
const delDemo = (row: any) => {
  tableDatas.value.splice(row.index, 1)
  ElMessage.success('删除成功！')
}

const findRecursion = (data, code, callback) => {
  if (!data || !Array.isArray(data)) return null
  data.forEach((item, index, arr) => {
    if (item.code === code) {
      return callback(item, index, arr)
    }
    if (item.children) {
      return findRecursion(item.children, code, callback)
    }
  })
}
const getParamsKey = (key: string) => {
  const map = {
    Country: 'areaCode',
    Township: 'townCode',
    Village: 'villageCode', // 行政村 code
    NaturalVillage: 'virutalVillageCode' // 自然村 code
  }
  return map[key]
}
const ppsList = (e) => {
  getPaymentApplicationPpsList(e).then((res: any) => {
    if (res) {
      tableData.value = res
      console.log(tableData.value, '付款对象数据')
    }
  })
}
let search = ref('')
let searchClick = () => {
  let params: any = { code: code.value, keywords: search.value }
  if (code.value) {
    findRecursion(districtTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
    })
    delete params.code
  }
  ppsList(params)
}
let districtTree: any = ref([])
let code = ref('')
const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}
watch(
  () => props.show,
  () => {
    if (props.show) {
      check.value = props.selence
      getdistrictTree()
      let params: any = { code: code.value, keywords: search.value }
      ppsList(params)
    }
    tableDatas.value = []
    console.log('Tbb', tableDatas.value)
    check.value = []
  },
  { deep: true, immediate: true }
)
// onMounted(() => {
//   let params: any = { code: code.value, keywords: search.value }
//   ppsList(params)
// })
</script>

<style lang="less">
.el-checkbox:last-of-type {
  margin-right: 30px;
}

.filling-btn {
  display: flex;
  width: 80px;
  height: 28px;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  background: #e9f3ff;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}

.red {
  color: #ff3939;
}

.status {
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;

  &.status-err {
    background-color: #ff3939;
  }

  &.status-suc {
    background-color: #0cc029;
  }
}
</style>
