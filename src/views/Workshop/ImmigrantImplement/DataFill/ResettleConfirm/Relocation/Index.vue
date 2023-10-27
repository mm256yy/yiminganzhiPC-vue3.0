<template>
  <WorkContentWrap>
    <!-- 安置确认 —— 搬迁安置 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="formBox">
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
            <span class="text">搬迁安置人数统计：</span>
          </div>
          <div style="display: flex">
            <ElFormItem label="家庭总人数" prop="familyNum">
              <div class="!w-100px">{{ form.familyNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="农村移民">
              <div class="!w-100px">{{ form.ruralMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="非农村移民">
              <div class="!w-100px">{{ form.unruralMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="农业随迁" prop="familyNum">
              <div class="!w-100px">{{ form.farmingMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="非农业随迁" prop="familyNum">
              <div class="!w-100px">{{ form.unfarmingMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
          </div>
          <div style="display: flex">
            <ElFormItem label="其他人口" prop="familyNum">
              <div class="!w-100px">{{ form.otherPopulationNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="安置总人数" prop="familyNum">
              <div class="!w-100px">{{ form.familyNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
          </div>
        </ElForm>
      </div>

      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="onDocumentation" style="margin-top: 17px">
            档案上传
          </ElButton>
          <ElButton
            :icon="addIcon"
            type="primary"
            @click="onImportDataPre"
            style="margin-top: 17px"
          >
            导入模拟数据
          </ElButton>
          <ElButton
            :icon="editIcon"
            type="primary"
            @click="onEditResettle"
            style="margin-top: 17px"
          >
            {{ immigrantSettle ? '修改' : '新增' }}
          </ElButton>
        </ElSpace>
      </div>

      <el-table v-if="showTable" :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="100" align="center" />
        <el-table-column prop="settleAddressText" label="安置区" align="center" />
        <el-table-column prop="area" label="户型/套型" align="center" />
        <el-table-column prop="num" label="数量" align="center" />
        <el-table-column prop="houseAreaTypeText" label="类型" align="center" />
      </el-table>

      <div class="flex justify-center items-center h-[60px]" v-else>
        <Icon icon="ant-design:exclamation-circle-filled" color="#FEC44C" :size="20" />
        <div class="txt"> 该户选择{{ houseTypeText[houseType] }} </div>
      </div>
    </div>
    <el-dialog title="提示" v-model="dialogVisible" width="500">
      <div style="display: flex; margin-bottom: 10px">
        导入模拟数据后，原搬迁安置数据将被覆盖，请确认是否导入？
      </div>

      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit">确认</ElButton>
      </template>
    </el-dialog>

    <el-dialog title="搬迁安置" v-model="editDialogVisible" width="900" @close="onEditClose">
      <div class="common-cont">
        <div class="common-form-item">
          <div class="common-label">户型类型：</div>
          <div class="common-value">
            <el-radio-group v-model="houseType">
              <el-radio
                size="large"
                v-for="item in filterHouseType()"
                :key="item.id"
                :label="item.id"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </div>
        </div>

        <template v-if="houseType === HouseType.homestead">
          <Homestead
            :baseInfo="props.baseInfo"
            :immigrantSettle="immigrantSettle"
            :doorNo="props.doorNo"
            fromResettleConfirm
            @submit="onEditSubmit"
          />
        </template>

        <template v-if="houseType === HouseType.flat">
          <Apartment
            :baseInfo="props.baseInfo"
            :immigrantSettle="immigrantSettle"
            :doorNo="props.doorNo"
            fromResettleConfirm
            @submit="onEditSubmit"
          />
        </template>

        <template v-if="houseType === HouseType.oneself">
          <FindSelf
            view-type="default"
            :immigrantSettle="immigrantSettle"
            :baseInfo="props.baseInfo"
            :doorNo="props.doorNo"
            fromResettleConfirm
            @submit="onEditSubmit"
          />
        </template>

        <template v-if="houseType === HouseType.concentrate">
          <CenterSupport
            :baseInfo="props.baseInfo"
            :immigrantSettle="immigrantSettle"
            :doorNo="props.doorNo"
            fromResettleConfirm
            @submit="onEditSubmit"
          />
        </template>
      </div>
    </el-dialog>

    <!-- 档案上传 -->
    <OnDocumentation :show="dialog" :door-no="props.doorNo" @close="closeDocumentation" />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { ref, onMounted, watch, computed } from 'vue'
import {
  ElMessage,
  ElButton,
  ElSpace,
  ElDialog,
  ElFormItem,
  ElRadioGroup,
  ElRadio,
  ElForm,
  ElTable,
  ElTableColumn
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { getRelocationInfoApi, saveRelocationInfoApi } from '@/api/putIntoEffect/relocation'
import { getSimulateImmigrantSettleApi } from '@/api/workshop/datafill/mockResettle-service'
import {
  HouseType,
  resettleHouseType,
  homesteadAreaSize,
  apartmentAreaSize,
  resettleArea,
  apartmentArea
} from '../../config'
import { getProduceListApi } from '@/api/immigrantImplement/resettleConfirm/produce-service'
import Homestead from '../../SchemeBase/components/Homestead.vue'
import Apartment from '../../SchemeBase/components/Apartment.vue'
import FindSelf from '../../SchemeBase/components/FindSelf.vue'
import CenterSupport from '../../SchemeBase/components/CenterSupport.vue'
import OnDocumentation from './OnDocumentation.vue' // 引入档案上传组件

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const editIcon = useIcon({ icon: 'ant-design:edit-outlined' })

const houseType = ref<HouseType>(HouseType.homestead)
const immigrantSettle = ref<any>(null)
const mockImmigrantSettle = ref<any>(null)
const dialog = ref<boolean>(false)
const editDialogVisible = ref<boolean>(false)
const peopleList = ref<any[]>([])

const form = ref<any>({})

onMounted(() => {
  form.value = props.baseInfo

  getMockData()
  getRelocationInfo()
  getPeopleList()
})

const rules = ref()
const dialogVisible = ref(false)
const tableData = ref<any>([])
const emit = defineEmits(['updateData'])
console.log(tableData, '////////')
const houseTypeText = {
  oneself: '自谋出路',
  concentrate: '集中供养'
}

const showTable = computed(() => houseType.value !== 'oneself' && houseType.value !== 'concentrate')
const getPeopleList = async () => {
  const res = await getProduceListApi({
    doorNo: props.doorNo,
    projectId: props.baseInfo.projectId,
    status: props.baseInfo.status
  })
  peopleList.value = res.content
}
/**
 * 根据户主人口性质过滤安置类型
 */
const filterHouseType = () => {
  const population = peopleList.value.find((item) => item.relation === '1')
  // 农村移民
  if (population && population.populationNature !== '1') {
    return resettleHouseType.map((item) => {
      if (item.id === HouseType.homestead) {
        item.disabled = true
      }
      return item
    })
  }
  return resettleHouseType
}

/**
 * 获取搬迁安置方式信息
 */
const getRelocationInfo = async () => {
  const res = await getRelocationInfoApi(props.doorNo)
  if (res) {
    houseType.value = res.houseAreaType
    immigrantSettle.value = res
  }
}

watch(
  () => immigrantSettle.value,
  (res) => {
    // 整成数组
    if (!res) return
    if (res.houseAreaType === HouseType.homestead || res.houseAreaType === HouseType.flat) {
      const houseAreaTypeText = resettleHouseType.find(
        (item) => item.id === res.houseAreaType
      )?.name
      if (res.houseAreaType === HouseType.homestead) {
        tableData.value = [
          {
            houseAreaTypeText,
            settleAddressText: resettleArea.find((item) => item.id === res.settleAddress)?.name,
            area: homesteadAreaSize.find((item) => item.id === res.areaType)?.name,
            num: 1
          }
        ]
      } else {
        const array: any = []
        if (res.typeOneNum) {
          array.push({
            houseAreaTypeText,
            settleAddressText: apartmentArea.find((item) => item.id === res.settleAddress)?.name,
            area: apartmentAreaSize[0].name,
            num: res.typeOneNum
          })
        }
        if (res.typeTwoNum) {
          array.push({
            houseAreaTypeText,
            settleAddressText: apartmentArea.find((item) => item.id === res.settleAddress)?.name,
            area: apartmentAreaSize[1].name,
            num: res.typeTwoNum
          })
        }
        if (res.typeThreeNum) {
          array.push({
            houseAreaTypeText,
            settleAddressText: apartmentArea.find((item) => item.id === res.settleAddress)?.name,
            area: apartmentAreaSize[2].name,
            num: res.typeThreeNum
          })
        }
        if (res.typeFourNum) {
          array.push({
            houseAreaTypeText,
            settleAddressText: apartmentArea.find((item) => item.id === res.settleAddress)?.name,
            area: apartmentAreaSize[3].name,
            num: res.typeFourNum
          })
        }
        tableData.value = array
      }
    } else {
      tableData.value = []
    }
  },
  {
    deep: true,
    immediate: true
  }
)
// 获取模拟数据
const getMockData = async () => {
  const res = await getSimulateImmigrantSettleApi(props.doorNo)
  if (res) {
    mockImmigrantSettle.value = res
  }
}

// 打开档案上传弹窗
const onDocumentation = () => {
  dialog.value = true
}

// 关闭档案上传弹窗
const closeDocumentation = (flag: boolean) => {
  dialog.value = false
  if (flag == true) {
    emit('updateData')
  }
}

// 导入
const onImportDataPre = async () => {
  dialogVisible.value = true
}

// 导入数据
const onImportData = async () => {
  // 拿到模拟安置的配置
  const {
    houseAreaType,
    typeOneNum,
    typeTwoNum,
    typeThreeNum,
    typeFourNum,
    settleAddress,
    doorNo,
    areaType
  } = mockImmigrantSettle.value
  immigrantSettle.value = {
    houseAreaType,
    typeOneNum,
    typeTwoNum,
    typeThreeNum,
    typeFourNum,
    settleAddress,
    doorNo,
    areaType
  }
  houseType.value = houseAreaType
  onEditSubmit(immigrantSettle.value)
}

const onClose = () => {
  dialogVisible.value = false
}

const onSubmit = () => {
  dialogVisible.value = false
  onImportData()
}

// 新增 搬迁安置信息
const onEditResettle = () => {
  onEditOpen()
}

const onEditOpen = () => {
  editDialogVisible.value = true
}

const onEditClose = () => {
  editDialogVisible.value = false
}

const onEditSubmit = async (params: any) => {
  const res = await saveRelocationInfoApi(params)
  console.log(res, '保存结果')
  if (res) {
    editDialogVisible.value = false
    immigrantSettle.value = res
    ElMessage.success('保存成功！')
  }
}
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
</style>
