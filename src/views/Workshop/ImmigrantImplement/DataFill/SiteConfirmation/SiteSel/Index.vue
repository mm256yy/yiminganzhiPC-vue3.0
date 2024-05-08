<template>
  <WorkContentWrap>
    <!-- 择址确认 —— 选房择址 -->
    <!-- houseAreaType 安置方式：homestead 宅基地，flat 公寓房，oneself 自谋出路，concentrate 集中供养 -->
    <div
      class="table-wrap !py-12px !mt-0px"
      v-if="baseInfo.houseAreaType === 'flat' || baseInfo.houseAreaType === 'homestead'"
    >
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="comdbe"> 打印 </ElButton>
          <ElButton type="primary" @click="onDocumentation"> 进度上报 </ElButton>
          <!-- <ElButton
            class="!bg-[#30A952] !border-[#30A952]"
            type="primary"
            :icon="printIcon"
            @click="onPrint"
          >
            打印报表
          </ElButton> -->
          <ElButton type="primary" @click="onBatchSave"> 保存 </ElButton>
        </ElSpace>
      </div>
      <ElTable v-if="baseInfo.houseAreaType === 'homestead'" :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" width="80" type="index" align="center" header-align="center" />
        <ElTableColumn label="安置区" prop="settleAddress" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.settleAddressText }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="类型" prop="houseAreaType" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.houseAreaType === 'flat' ? '公寓房' : '宅基地' }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="户型/套型(㎡)" prop="area" align="center" header-align="center">
          <template #default="{ row }">
            <!-- {{
              row.houseAreaType === 'flat'
                ? row.area
                : homesteadAreaSize
                    .filter((item) => item.id == row.area)
                    .map((item) => item.name)[0]
            }} -->
            {{ row.area }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="地块编号" prop="landNo" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择" v-model="row.landNo">
              <ElOption
                v-for="item in row.landNoOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                :disabled="item.isOccupy === '1'"
              />
            </ElSelect>
            <!-- <ElSelectV2 v-model="row.roomNo" :options="row.roomNoOptions" clearable filterable /> -->
          </template>
        </ElTableColumn>
        <ElTableColumn label="摇号顺序号" prop="lotteryOrder" align="center" header-align="center">
          <template #default="{ row }">
            <ElInputNumber placeholder="请输入" :min="0" v-model="row.lotteryOrder" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="择址顺序号" prop="placeOrder" align="center" header-align="center">
          <template #default="{ row }">
            <ElInputNumber placeholder="请输入" :min="0" v-model="row.placeOrder" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" align="center" header-align="center" fixed="right">
          <template #default="{ row }">
            <ElButton type="primary" @click="onSave(row)"> 保存 </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElTable v-if="baseInfo.houseAreaType === 'flat'" :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" width="80" type="index" align="center" header-align="center" />
        <ElTableColumn
          label="安置区"
          width="120"
          prop="settleAddress"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            {{ row.settleAddressText }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="类型"
          width="100"
          prop="houseAreaType"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            {{ row.houseAreaType === 'flat' ? '公寓房' : '宅基地' }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="户型/套型(㎡)"
          width="170"
          prop="area"
          align="center"
          header-align="center"
        >
          <template #default="{ row }"> {{ row.area }} </template>
        </ElTableColumn>
        <ElTableColumn label="房号" width="140" prop="roomNo" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择" v-model="row.roomNo">
              <ElOption
                v-for="item in row.roomNoOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled == true"
              />
            </ElSelect>
            <!-- <ElSelectV2 v-model="row.roomNo" :options="row.roomNoOptions" clearable filterable /> -->
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="储藏室编号"
          width="200"
          prop="storeroomNo"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择" v-model="row.storeroomNo">
              <ElOption
                v-for="item in row.storeroomNoOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                :disabled="item.isOccupy === '1'"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="车位编号"
          width="200"
          prop="carNo"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择" v-model="row.carNo">
              <ElOption
                v-for="item in row.carNoOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                :disabled="item.isOccupy === '1'"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="摇号顺序号"
          width="200"
          prop="lotteryOrder"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber placeholder="请输入" :min="0" v-model="row.lotteryOrder" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="择房顺序号"
          width="200"
          prop="placeOrder"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber placeholder="请输入" :min="0" v-model="row.placeOrder" />
          </template>
        </ElTableColumn>
        <!-- <ElTableColumn label="操作" width="200" align="center" header-align="center" fixed="right">
          <template #default="{ row }">
            <ElButton type="primary" @click="enterRoomNo(row)">录入房号</ElButton>
          </template>
        </ElTableColumn> -->
      </ElTable>
    </div>

    <div class="table-wrap !py-12px !mt-0px no-data" v-if="!baseInfo.houseAreaType">
      该户未选择搬迁安置方式，请前往安置确认中选择搬迁安置方式
    </div>

    <div class="table-wrap !py-12px !mt-0px no-data" v-if="baseInfo.houseAreaType === 'oneself'">
      该户安置方式为自谋出路，无需选房择址
    </div>

    <div
      class="table-wrap !py-12px !mt-0px no-data"
      v-if="baseInfo.houseAreaType === 'concentrate'"
    >
      该户安置方式为集中供养，无需选房择址
    </div>

    <!-- 档案上传 -->
    <OnDocumentation
      :show="dialog"
      :door-no="props.doorNo"
      :data-list="tableData"
      :base-info="props.baseInfo"
      @close="(...event) => close(event, 'documentation')"
    />

    <!-- 录入幢号室号 -->
    <EnterRoomNo
      :show="roomNoDialog"
      :row="currentRow"
      :baseInfo="baseInfo"
      @close="(...event) => close(event, 'roomNo')"
    />
    <div style="position: fixed; left: -1000px; width: 210mm; padding: 0 40px 0 40px" id="anztable">
      <h1 style="font-size: 24px; font-weight: bold; text-align: center">{{
        baseInfo.houseAreaType === 'homestead' ? '择址确认单' : '选房确认单'
      }}</h1>
      <div
        style="
          display: flex;
          margin: 20px 0 20px 0;
          font-size: 18px;
          justify-content: space-between;
        "
      >
        <div>
          {{
            `${baseInfo.areaCodeText}${baseInfo.townCodeText}${baseInfo.villageText} ${baseInfo.name} 户号 ${baseInfo.showDoorNo} `
          }}</div
        >

        <div>{{ data }}</div>
      </div>
      <ElTable
        v-if="baseInfo.houseAreaType === 'homestead'"
        :data="tableData"
        style="width: 100%"
        header-cell-class-name="table-headers"
        cell-class-name="table-cellss"
        border
      >
        <ElTableColumn label="序号" width="50" type="index" align="center" header-align="center" />
        <ElTableColumn label="区块" prop="settleAddress" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.settleAddressText }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="类型" prop="houseAreaType" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.houseAreaType === 'flat' ? '公寓房' : '宅基地' }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="地块编号" prop="landNo" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.landNo ? row.landNoOptions.filter((e) => row.landNo == e.name)[0].name : '-' }}
          </template>
        </ElTableColumn>
      </ElTable>
      <ElTable
        :data="tableData"
        style="width: 100%"
        header-cell-class-name="table-headers"
        cell-class-name="table-cellss"
        v-if="baseInfo.houseAreaType === 'flat'"
        border
      >
        <ElTableColumn label="序号" type="index" align="center" width="50" header-align="center" />
        <ElTableColumn
          label="区块"
          width="100"
          prop="settleAddress"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            {{ row.settleAddressText }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="房型"
          prop="houseAreaType"
          width="80"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            {{ row.houseAreaType === 'flat' ? '公寓房' : '宅基地' }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="幢号"
          prop="houseNo"
          align="center"
          width="50"
          header-align="center"
        />
        <ElTableColumn label="室号" prop="roomNo" align="center" width="70" header-align="center" />
        <ElTableColumn
          label="储藏室编号"
          prop="storeroomNo"
          align="center"
          width="90"
          header-align="center"
        >
          <template #default="{ row }">
            {{
              row.storeroomNo
                ? row.storeroomNoOptions?.filter((e: any) => row.storeroomNo == e.name)[0].name
                : '-'
            }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="车库编号"
          prop="carNo"
          align="center"
          width="80"
          header-align="center"
        >
          <template #default="{ row }">
            {{
              row.carNo ? row.carNoOptions?.filter((e: any) => row.carNo == e.name)[0].name : '-'
            }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" align="center" />

        <!-- <ElTableColumn label="操作" width="200" align="center" header-align="center" fixed="right">
          <template #default="{ row }">
            <ElButton type="primary" @click="enterRoomNo(row)">录入房号</ElButton>
          </template>
        </ElTableColumn> -->
      </ElTable>
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
import { ref, onMounted } from 'vue'
// import { useDictStoreWithOut } from '@/store/modules/dict'
// import { useIcon } from '@/hooks/web/useIcon'
import {
  ElButton,
  ElInputNumber,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElSelect,
  ElOption,
  ElMessage,
  ElSelectV2
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import OnDocumentation from './OnDocumentation.vue'
import EnterRoomNo from './EnterRoomNo.vue'
import {
  getImmigrantChooseHouseApi,
  saveImmigrantChooseHouseApi,
  saveDocumentationApi
} from '@/api/immigrantImplement/siteConfirmation/siteSel-service'
import { saveFillingCompleteApi } from '@/api/immigrantImplement/common-service'
import { getChooseConfigApi } from '@/api/immigrantImplement/siteConfirmation/common-service'
import { resettleArea } from '../../config'
// import { deepClone } from '@/utils'
import { getHouseConfigApi } from '@/api/immigrantImplement/siteConfirmation/siteSel-service'
import { useAppStore } from '@/store/modules/app'
import { getPlacementPointListApi } from '@/api/systemConfig/placementPoint-service'
import dayjs from 'dayjs'
import { htmlToPdf } from '@/utils/ptf'
import { debounce } from '@/utils/index'
import { homesteadAreaSize } from '../../config'
interface PropsType {
  doorNo: string
  baseInfo: any
}
// const options = ref<any>([
//   { value: 'option1', label: '选项一' },
//   { value: 'option2', label: '选项二' }
// ])
const props = defineProps<PropsType>()
// const dictStore = useDictStoreWithOut()
// const dictObj = computed(() => dictStore.getDictObj)
// const printIcon = useIcon({ icon: 'ion:print-outline' })

const tableData = ref<any[]>([])
const dialog = ref<boolean>(false)
const roomNoDialog = ref<boolean>(false)
const emit = defineEmits(['updateData'])
const currentRow = ref<any>({}) // 当前行数据

// 获取列表数据
const getList = () => {
  getImmigrantChooseHouseApi(props.doorNo).then((res) => {
    const arr: any = []
    if (res && res?.content.length) {
      res.content.map((item: any) => {
        arr.push({
          ...item,
          landNoOptions: [],
          storeroomNoOptions: [],
          carNoOptions: [],
          roomNoOptions: []
        })
      })

      arr.map(async (item: any) => {
        item.landNoOptions = await getlandNoList(item.settleAddress)
        item.storeroomNoOptions = await getStoreroomNoList(item.settleAddress)
        item.carNoOptions = await getcarNoList(item.settleAddress)
        let { content } = await getHouseConfigApi(props.baseInfo.projectId, 3, item.settleAddress)
        // console.log(
        //   item.landNoOptions,
        //   item.storeroomNoOptions,
        //   item.carNoOptions,
        //   item.roomNoOptions,
        //   '测试数据'
        // )
        item.roomNoOptions = content.map((item) => {
          return {
            id: item.id,
            label: item.showName,
            value: item.code,
            disabled: item.isOccupy === '1' ? true : false
          }
        })
        // console.log(item.roomNoOptions, '测试数据房号')
      })
      console.log(arr, 'bbq')

      tableData.value = arr
      // setTimeout(() => {
      //   tableData.value = [...arr]
      //   console.log(tableData.value)
      // }, 2000)
    }
  })
}

/**
 * 获取当前行安置区
 * @param data 当前行信息
 */
const appStore = useAppStore()
let apartmentArea: any = []
const getSettleAddressList = async () => {
  const params = {
    projectId: appStore.getCurrentProjectId,
    status: 'implementation',
    type: '2',
    size: 9999,
    page: 0
  }
  try {
    const result = await getPlacementPointListApi(params)
    apartmentArea = result.content
  } catch {}
}
// const getSettleAddress = async (data: any) => {
//   // 选择了公寓房的安置方式
//   let m = await resettleArea()
//   console.log(m, data, 'bbqss')

//   let str = ''
//   if (data.houseAreaType === 'flat') {
//     m.map((item: any) => {
//       if (item.code == data.settleAddress) {
//         str = item.name
//       }
//     })
//     return str
//   } else {
//     m.map((item: any) => {
//       if (item.code == data.settleAddress) {
//         str = item.name
//       }
//     })
//     return str
//   }
// }

// 获取宅基地地块编号选项列表, async 返回的是一个 promise
const getlandNoList = async (settleAddress?: string) => {
  let arr: any = []
  if (settleAddress) {
    let params = {
      projectId: props.baseInfo.projectId,
      type: 2,
      settleAddress
    }
    const res = await getChooseConfigApi(params)
    if (res && res?.content.length) {
      arr = [...res.content]
    }
  }
  return arr
}

// 获取储藏室编号选项列表
const getStoreroomNoList = async (settleAddress?: string) => {
  let arr: any = []
  if (settleAddress) {
    let params = {
      projectId: props.baseInfo.projectId,
      type: 3,
      settleAddress
    }
    const res = await getChooseConfigApi(params)
    if (res && res?.content.length) {
      arr = [...res.content]
    }
  }
  return arr
}

// 获取车位编号选项列表
const getcarNoList = async (settleAddress?: string) => {
  let arr: any = []
  if (settleAddress) {
    let params = {
      projectId: props.baseInfo.projectId,
      type: 4,
      settleAddress
    }
    const res = await getChooseConfigApi(params)
    if (res && res?.content.length) {
      arr = [...res.content]
    }
  }
  return arr
}

const enterRoomNo = (row: any) => {
  roomNoDialog.value = true
  currentRow.value = { ...row }
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
const onSave = (row: any) => {
  if (row.landNoOptions) {
    Reflect.deleteProperty(row, 'landNoOptions')
  }
  if (row.storeroomNoOptions) {
    Reflect.deleteProperty(row, 'storeroomNoOptions')
  }
  if (row.carNoOptions) {
    Reflect.deleteProperty(row, 'carNoOptions')
  }
  saveImmigrantChooseHouseApi(row).then(() => {
    ElMessage.success('操作成功！')
    getList()
    emit('updateData')
  })
}
//批量保存
const onBatchSave = () => {
  saveDocumentationApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
    getList()
  })
}
/**
 * 关闭归档/幢号室号弹窗
 * @param flag
 */
const close = (params: any[], type: string) => {
  if (type === 'documentation') {
    dialog.value = false
  } else if (type === 'roomNo') {
    roomNoDialog.value = false
  }
  if (params[0] === true) {
    getList()
  }
}
let data = ref()
let comdbe = () => {
  data.value = dayjs(new Date()).format('YYYY年MM月DD日')
  debounce(() => {
    // ElMessage.error('待业主提供模板')

    htmlToPdf(
      '#anztable',
      props.baseInfo.houseAreaType === 'homestead' ? '选址确认单' : '选房确认单'
    )
  })
}

onMounted(async () => {
  await getSettleAddressList()
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
