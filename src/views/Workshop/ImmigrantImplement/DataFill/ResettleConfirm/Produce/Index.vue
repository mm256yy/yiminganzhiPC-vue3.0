<template>
  <WorkContentWrap>
    <!-- 安置确认 —— 生产安置 -->
    <div class="table-wrap !py-12px !mt-0px">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          label="序号"
          align="center"
          type="index"
          header-align="center"
          width="100"
        />
        <el-table-column prop="area" label="所在区域">
          <template #default="scope">
            {{ dictObj[326].filter((item) => item.value == scope.row.area)[0].label }}
          </template>
        </el-table-column>
        <el-table-column prop="inundationRange" label="淹没范围">
          <template #default="scope">
            {{ dictObj[346].filter((item) => item.value == scope.row.inundationRange)[0].label }}
          </template>
        </el-table-column>
        <el-table-column prop="sheetNumber" label="图幅号" />
        <el-table-column prop="landNumber" label="地块编号" />
        <el-table-column prop="landName" label="地名" />
        <el-table-column prop="rightHolder" label="使用权人" />
        <el-table-column prop="landNature" label="土地性质">
          <template #default="scope">
            {{ dictObj[222].filter((item) => item.value == scope.row.landNature)[0].label }}
          </template>
        </el-table-column>
        <el-table-column prop="landLevel" label="地类">
          <template #default="scope">
            {{ scope.row.landTypeText }}
          </template>
        </el-table-column>
        <el-table-column prop="shapeArea" label="面积(亩)" />
        <el-table-column prop="shapeLeng" label="周长(米)" />
        <el-table-column prop="remark" label="备注">
          <template #default="scope">
            {{ scope.row.remark != 'null' ? scope.row.remark : '-' }}
          </template>
        </el-table-column>
      </el-table>
      <div class="formBox mt-5">
        <ElForm
          :disabled="actionType === 'view'"
          class="form"
          ref="formRef"
          :model="form"
          label-width="100px"
          :label-position="'right'"
          :rules="rules"
        >
          <div class="titleBox">
            <span class="text">生产安置人数统计：</span>
          </div>
          <div style="display: flex">
            <ElFormItem label="家庭总人数" prop="familyNum" v-if="familyTotal">
              <div class="!w-100px">{{ baseInfo.familyNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="农村移民" v-if="baseInfo.ruralMigrantNum">
              <div class="!w-100px">{{ baseInfo.ruralMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="非农村移民" v-if="baseInfo.unruralMigrantNum">
              <div class="!w-100px">{{ baseInfo.unruralMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="农业随迁" prop="familyNum" v-if="baseInfo.farmingMigrantNum">
              <div class="!w-100px">{{ baseInfo.farmingMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="非农业随迁" prop="familyNum" v-if="baseInfo.unfarmingMigrantNum">
              <div class="!w-100px">{{ baseInfo.unfarmingMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="增计人口" prop="familyNum" v-if="baseInfo.addPopulationNum">
              <div class="!w-100px">{{ baseInfo.addPopulationNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
          </div>
          <div style="display: flex">
            <ElFormItem label="财产户" prop="familyNum" v-if="baseInfo.propertyNum">
              <div class="!w-100px">{{ baseInfo.propertyNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="其他人口" prop="familyNum" v-if="baseInfo.otherPopulationNum">
              <div class="!w-100px">{{ baseInfo.otherPopulationNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <!-- <ElFormItem label="安置总人数" prop="familyNum" v-if="form.familyNum">
              <div class="!w-100px">{{ form.familyNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem> -->
          </div>
        </ElForm>
      </div>

      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton
            type="primary"
            @click="() => openurl({ doorNo, type: 'household_placement_demographic' }, handelurl)"
            style="margin-top: 17px"
          >
            查看历史签字
          </ElButton>

          <ElButton type="primary" @click="comdbe" style="margin-top: 17px"> 打印 </ElButton>

          <ElButton type="primary" @click="onDocumentation" style="margin-top: 17px">
            进度上报
          </ElButton>
          <ElButton
            :icon="addIcon"
            type="primary"
            @click="onImportDataPre"
            style="margin-top: 17px"
          >
            导入模拟数据
          </ElButton>
          <ElButton :icon="saveIcon" type="primary" @click="onSave" style="margin-top: 17px">
            保存
          </ElButton>
        </ElSpace>
      </div>
      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        :pagination="{
          total: tableObject.total
        }"
        highlightCurrentRow
        @register="register"
      >
        <template #isProduction="{ row }">
          <el-select
            v-model="row.isProduction"
            placeholder="请选择"
            @change="isProductionType(row, $event)"
            clearable
          >
            <el-option
              v-for="item in isProductionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template #settingWay="{ row }">
          <el-select
            v-model="row.settingWay"
            placeholder="请选择"
            :key="row.id"
            :disabled="row.isProduction == '0' || !row.isProduction ? true : false"
          >
            <el-option
              v-for="item in filterWay(row)"
              :key="`${item.value}${row.id}`"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </template>
        <template #settingRemark="{ row }">
          <el-input v-model="row.settingRemark" placeholder="请输入" />
        </template>
      </Table>
    </div>

    <el-dialog title="提示" v-model="dialogVisible" width="500">
      <div style="display: flex; margin-bottom: 10px">
        导入模拟数据后，列表中的安置方式将被覆盖，请确认是否导入？
      </div>
      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit">确认</ElButton>
      </template>
    </el-dialog>

    <!-- 档案上传 -->
    <OnDocumentation :show="dialog" :door-no="props.doorNo" @close="closeDocumentation" />
    <div style="position: fixed; left: -1000px; width: 210mm; padding: 0 40px 0 40px" id="anztable">
      <h1 style="font-size: 24px; font-weight: bold; text-align: center">生产安置</h1>
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
      <div v-if="tableObject.tableList.filter((item) => item.isProduction == '1').length < 9">
        <el-table
          :data="tableObject.tableList.filter((item) => item.isProduction == '1')"
          style="width: 100%"
          border
          header-cell-class-name="table-headers"
          cell-class-name="table-cellss"
        >
          <el-table-column prop="name" label="姓名" width="60" align="center" />
          <el-table-column prop="relationText" label="与户主关系" width="90" align="center" />
          <el-table-column prop="card" label="身份证号" width="140" align="center" />
          <el-table-column prop="populationNatureText" label="人口性质" width="80" align="center" />
          <el-table-column prop="settingWay" label="安置类型" width="80" align="center">
            <template #default="{ row }">
              {{ filterWay(row).filter((item) => item.value === row.settingWay)[0]?.label }}
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="settingRemark">
            <template #default></template>
          </el-table-column>
        </el-table>
        <div style="display: flex; justify-content: space-between; height: 50px">
          <div style="line-height: 50px; border: 1px solid black; border-top: 0px; flex: 1">
            户主代表或收委托人(签名)：
          </div>
          <div style="line-height: 50px; border: 1px solid black; border-top: 0px; flex: 1">
            联系移民干部(签名)：
          </div>
        </div>
      </div>
      <div v-else>
        <el-table
          :data="tableObject.tableList.filter((item) => item.isProduction == '1').slice(0, 9)"
          style="width: 100%"
          border
          header-cell-class-name="table-headers"
          cell-class-name="table-cellss"
        >
          <el-table-column prop="name" label="姓名" width="60" align="center" />
          <el-table-column prop="relationText" label="与户主关系" width="90" align="center" />
          <el-table-column prop="card" label="身份证号" width="140" align="center" />
          <el-table-column prop="populationNatureText" label="人口性质" width="80" align="center" />
          <el-table-column prop="settingWay" label="安置类型" width="80" align="center">
            <template #default="{ row }">
              {{ filterWay(row).filter((item) => item.value === row.settingWay)[0]?.label }}
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="settingRemark">
            <template #default></template>
          </el-table-column>
        </el-table>
        <div style="display: flex; justify-content: space-between; height: 50px">
          <div style="line-height: 50px; border: 1px solid black; border-top: 0px; flex: 1">
            户主代表或收委托人(签名)：
          </div>
          <div style="line-height: 50px; border: 1px solid black; border-top: 0px; flex: 1">
            联系移民干部(签名)：
          </div>
        </div>
        <h1 style="font-size: 24px; font-weight: bold; text-align: center; margin-top: 50px"
          >生产安置</h1
        >
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
          :data="tableObject.tableList.filter((item) => item.isProduction == '1').slice(9)"
          style="width: 100%"
          border
          header-cell-class-name="table-headers"
          cell-class-name="table-cellss"
        >
          <el-table-column prop="name" label="姓名" width="60" align="center" />
          <el-table-column prop="relationText" label="与户主关系" width="90" align="center" />
          <el-table-column prop="card" label="身份证号" width="140" align="center" />
          <el-table-column prop="populationNatureText" label="人口性质" width="80" align="center" />
          <el-table-column prop="settingWay" label="安置类型" width="80" align="center">
            <template #default="{ row }">
              {{ filterWay(row).filter((item) => item.value === row.settingWay)[0]?.label }}
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="settingRemark">
            <template #default></template>
          </el-table-column>
        </el-table>
        <div style="display: flex; justify-content: space-between; height: 50px">
          <div style="line-height: 50px; border: 1px solid black; border-top: 0px; flex: 1">
            户主代表或收委托人(签名)：
          </div>
          <div style="line-height: 50px; border: 1px solid black; border-top: 0px; flex: 1">
            联系移民干部(签名)：
          </div>
        </div>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref, onMounted, computed } from 'vue'
import {
  ElButton,
  ElSpace,
  ElDialog,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElForm,
  ElMessage,
  ElTable,
  ElTableColumn
} from 'element-plus'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getProduceListApi,
  saveProduceListApi
} from '@/api/immigrantImplement/resettleConfirm/produce-service'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  getSimulateDemographicApi,
  getlandEstimatecApi
} from '@/api/workshop/datafill/mockResettle-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { cloneDeep } from 'lodash-es'
import OnDocumentation from './OnDocumentation.vue' // 引入档案上传组件
import { debounce, openurl } from '@/utils/index'
import { htmlToPdf } from '@/utils/ptf'
import { handelurl } from '@/api/immigrantImplement/common-service'
const tableData: any = ref([])

const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

dayjs.extend(relativeTime)

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const dialog = ref<boolean>(false)
const emit = defineEmits(['updateData'])
// 属实
const mockList = ref<any>([])

const { register, tableObject, methods } = useTable({
  getListApi: getProduceListApi
})
const { getList } = methods
const isProductionList = ref([
  {
    label: '是',
    value: '1'
  },
  {
    label: '否',
    value: '0'
  }
])
const flag = ref<boolean>(false)
const isProductionType = (rowData, event) => {
  console.log(event, rowData, '选择的值是什么')
  event == 0 ? (flag.value = true) : (flag.value = false)
  // console.log(flag.value, '开关')
  if (event == 0) {
    rowData.settingWay = ''
  }
}
// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo,
  projectId: props.baseInfo.projectId,
  status: props.baseInfo.status,
  populationNature: '5'
}

getList()

const form = ref<any>({})
const rules = ref<any>({})
const schema = reactive<CrudSchema[]>([
  {
    width: 80,
    type: 'index',
    field: 'index',
    label: '序号'
  },
  {
    field: 'name',
    label: '姓名',
    search: {
      show: false
    }
  },
  {
    field: 'relationText',
    label: '与户主关系',
    search: {
      show: false
    }
  },
  {
    field: 'sexText',
    label: '性别',
    search: {
      show: false
    }
  },

  {
    field: 'populationNatureText',
    label: '人口性质',
    search: {
      show: false
    }
  },
  {
    width: 180,
    field: 'card',
    label: '身份证号',
    search: {
      show: false
    }
  },
  {
    field: 'isProduction',
    label: '是否生产安置移民',
    search: {
      show: false
    }
  },
  {
    field: 'settingWay',
    label: '安置方式',
    search: {
      show: false
    }
  },
  {
    field: 'settingRemark',
    label: '备注',
    search: {
      show: false
    }
  }
])
const schemas = reactive<CrudSchema[]>([
  {
    width: 80,
    type: 'index',
    field: 'index',
    label: '序号'
  },
  {
    field: 'name',
    label: '姓名',
    search: {
      show: false
    }
  }
])
const { allSchemas } = useCrudSchemas(schema)
const dialogVisible = ref(false)

onMounted(() => {
  getMockList()
  getLandList()
})
const dictFmt = (value, index) => {
  if (value && dictObj.value[index] && dictObj.value[index].length > 0) {
    const item = dictObj.value[index].find((item: any) => item?.value === value)
    return item ? item.label : value
  }
}
/**
 * 安置方式过滤
 */
const filterWay = (data) => {
  const arr = cloneDeep(dictObj.value[375]).map((item) => {
    // 农村移民的 其他性质
    item.disabled = false
    const notFarmer = data.populationNature !== '1'
    if (notFarmer && item.value === '1') {
      item.disabled = true
    }
    if (item.value === '1' && data.isProductionLand != '1') {
      item.disabled = true
    }
    data.age = data.birthday ? parseInt(dayjs(data.birthday).fromNow().replace(/\D+/, '')) : 0
    if (data.age < 14 && item.value !== '3' && item.value != '1') {
      item.disabled = true
    }
    return item
  })
  return arr
}

// 获取模拟数据
const getMockList = async () => {
  const res = await getSimulateDemographicApi({
    doorNo: props.doorNo,
    projectId: props.baseInfo.projectId,
    status: props.baseInfo.status
  })
  if (res && res.content && res.content.length) {
    mockList.value = res.content
  }
}
//获取土地数据
const getLandList = async () => {
  const res = await getlandEstimatecApi({
    doorNo: props.doorNo,
    status: props.baseInfo.status
  })
  tableData.value = res
  console.log(res, '测试数据')
}
// 导入
const onImportDataPre = async () => {
  dialogVisible.value = true
}

// 导入数据
const onImportData = async () => {
  console.log('进入了')
  console.log(mockList.value, '模拟数据')
  // 拿到模拟安置的配置
  if (mockList.value && mockList.value.length) {
    // 模拟数据和当前数据做融合
    tableObject.tableList = tableObject.tableList.map((item) => {
      const current = mockList.value.find((mockItem) => mockItem.demographicId === item.id)
      if (current) {
        item.settingWay = current.settingWay
        item.settingRemark = current.settingRemark
        item.isProduction = current.isProduction
      }
      return item
    })
  }
}

// 打开档案上传弹窗
const onDocumentation = () => {
  dialog.value = true
}

// 关闭档案上传弹窗
const closeDocumentation = () => {
  dialog.value = false
  emit('updateData')
}

const onClose = () => {
  dialogVisible.value = false
}

const onSubmit = () => {
  dialogVisible.value = false
  onImportData()
}

const onSave = async () => {
  const item = tableObject.tableList.find((item) => !item.settingWay)
  const isNotProduction = tableObject.tableList.filter((item) => !item.isProduction)
  // if (item && item.isProduction == '1') {
  //   ElMessage.info('请选择安置方式')
  //   return
  // }
  console.log(isNotProduction)

  if (isNotProduction.length > 0) {
    ElMessage.info('请选择是否生产安置')
    return
  }
  const params = tableObject.tableList.map((item) => {
    return {
      ...item,
      settingWay: item.settingWay,
      settingRemark: item.settingRemark
    }
  })

  const res = await saveProduceListApi(params)
  if (res) {
    ElMessage.success('保存成功！')
  }
}
let data = ref()
let comdbe = () => {
  data.value = dayjs(new Date()).format('YYYY年MM月DD日')
  debounce(() => {
    // ElMessage.error('待业主提供模板')

    htmlToPdf('#anztable', '生产安置')
  })
}
// 家庭总人数
const familyTotal = computed(() => {
  return props.baseInfo.familyNum - props.baseInfo.addPopulationNum
})
</script>
<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding-right: 60px;
  padding-left: 60px;
}

:deep(.el-form-item) {
  padding: 0 10px;
}

.formBox {
  border: 1px solid #ebebeb;
  border-radius: 4px;
  opacity: 1;

  .titleBox {
    height: 32px;
    padding-left: 15px;
    margin: 0px 0 16px;
    line-height: 32px;
    background: #f5f7fa;
    box-shadow: 0px 1px 0px 0px rgba(235, 235, 235, 1);

    .text {
      padding-left: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-size: 17px;
      font-weight: 600;
      color: #171718;

      border-left: 4px solid rgba(62, 115, 236, 1) !important;
    }
  }
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
