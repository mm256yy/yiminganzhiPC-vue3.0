<template>
  <WorkContentWrap>
    <!-- 搬迁安置 —— 自建房 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="onDocumentation"> 档案上传 </ElButton>
        </ElSpace>
      </div>
    </div>

    <div class="sub-title">建房进度</div>

    <div class="progress-wrapper">
      <div class="progress-list">
        <div class="progress-item" v-for="item in dataList" :key="item.name">
          <div class="left">
            <div class="icon-box">
              <div v-if="item.isComplete === '0'" class="disabled"></div>
              <img
                v-if="item.isComplete === '1'"
                src="@/assets/imgs/icon_finish.png"
                width="18"
                height="18"
              />
              <div v-if="item.isComplete === '2'" class="hollow"></div>
            </div>
            <div v-if="item.isComplete === '0' && item.type !== '9'" class="line disabled"></div>
            <div v-if="item.isComplete === '1' && item.type !== '9'" class="line"></div>
            <div v-if="item.isComplete === '2' && item.type !== '9'" class="line in-progress"></div>
            <div v-if="item.type === '9'" class="line none"></div>
          </div>
          <div class="right">
            <div class="content-box">
              <div class="content-1">
                <div class="name">{{ item.name }}</div>
                <el-button type="primary" v-if="item.type === '1'" @click="onPrint(item)">
                  打印
                </el-button>
                <el-button
                  type="primary"
                  :disabled="item.isComplete === '0'"
                  v-if="item.type !== '1' && item.isComplete !== '1'"
                  @click="onFill(item)"
                >
                  填写
                </el-button>
                <el-button
                  type="primary"
                  v-if="item.type !== '1' && item.isComplete === '1'"
                  @click="onFill(item)"
                >
                  查看
                </el-button>
              </div>
              <div class="status" v-if="item.isComplete === '1'">已完成</div>
              <div class="time" v-if="item.isComplete === '1'">
                {{ dayjs(item.completeDate).format('YYYY-MM-DD') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 档案上传 -->
    <OnDocumentation
      :show="dialog"
      :door-no="props.doorNo"
      @close="(...event) => close(event, 'documentation')"
    />

    <!-- 填写/查看 -->
    <Fill
      :show="fillDialog"
      :door-no="props.doorNo"
      :row="currentRow"
      @close="(...event) => close(event, 'fill')"
    />
    <div style="position: fixed; left: -1000px; width: 210mm; padding: 0 40px 0 40px" id="anztable">
      <h1 style="font-size: 24px; font-weight: bold; text-align: center">{{
        baseInfo.houseAreaType === 'homestead' ? '建房告知单' : '选房确认单'
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
            `${baseInfo.areaCodeText} ${baseInfo.townCodeText} ${baseInfo.villageText} ${baseInfo.name} 户号 ${baseInfo.showDoorNo} `
          }}</div
        >

        <div>{{ data }}</div>
      </div>
      <div style="margin: 20px 0 20px 0; font-size: 18px; font-weight: bolder"
        >已完成宅基地基础建设，特此告知。</div
      >
      <ElTable
        v-if="baseInfo.houseAreaType === 'homestead'"
        :data="tableData"
        style="width: 100%"
        header-cell-class-name="table-headers"
        cell-class-name="table-cellss"
        border
      >
        <ElTableColumn label="序号" width="80" type="index" align="center" header-align="center" />
        <ElTableColumn label="区块" prop="settleAddress" align="center" header-align="center">
          <template #default="{ row }">
            {{ getSettleAddress(row) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="类型" prop="houseAreaType" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.houseAreaType === 'flat' ? '公寓房' : '宅基地' }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="地块编号" prop="landNo" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.landNo }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" align="center" />
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
import { ElButton, ElSpace, ElTable, ElTableColumn } from 'element-plus'
import dayjs from 'dayjs'
import {
  getSelfBuildHouseApi,
  saveSelfBuildHouseApi
} from '@/api/immigrantImplement/relocatePlacement/selfBuildHouse-service'
import { WorkContentWrap } from '@/components/ContentWrap'
import OnDocumentation from './OnDocumentation.vue' // 引入档案上传组件
import Fill from './Fill.vue' // 引入填写/查看组件
import { useAppStore } from '@/store/modules/app'
import { getPlacementPointListApi } from '@/api/systemConfig/placementPoint-service'
import { resettleArea } from '../../config'
import { getImmigrantChooseHouseApi } from '@/api/immigrantImplement/siteConfirmation/siteSel-service'
import { htmlToPdf } from '@/utils/ptf'
import { debounce } from '@/utils/index'
interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const dialog = ref<boolean>(false)
const fillDialog = ref<boolean>(false)
const dataList = ref<any[]>([])
const currentRow = ref<any>({})

// 初始化获取数据
const initData = () => {
  getSelfBuildHouseApi(props.doorNo).then((res: any) => {
    dataList.value = res
  })
}

// 归档
const onDocumentation = () => {
  dialog.value = true
}
const emit = defineEmits(['updateData'])
// 关闭弹窗
const close = (params: any[], type: string) => {
  if (type === 'documentation') {
    dialog.value = false
    emit('updateData')
  } else if (type === 'fill') {
    fillDialog.value = false
  }
  if (params[0] === true) {
    initData()
  }
}

/**
 * 打印
 * @param data 当前阶段数据
 */
let data = ref()
const onPrint = async (data: any) => {
  data.value = dayjs(new Date()).format('YYYY年MM月DD日')
  debounce(() => {
    // ElMessage.error('待业主提供模板')

    htmlToPdf('#anztable')
  })
  currentRow.value = data
  await saveSelfBuildHouseForPrint()
}

/**
 * 填写/查看
 * @param data 当前阶段数据
 */
const onFill = (data: any) => {
  currentRow.value = data
  fillDialog.value = true
}

// 填写保存（这里主要用于打印时调用）
const saveSelfBuildHouseForPrint = async () => {
  let params = {
    ...currentRow.value,
    completeDate: new Date(),
    doorNo: props.doorNo
  }
  await saveSelfBuildHouseApi(params)
  initData()
}
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
const getSettleAddress = async (data: any) => {
  // 选择了公寓房的安置方式
  if (data.houseAreaType === 'flat') {
    let str = ''
    apartmentArea.map((item: any) => {
      if (item.id == data.settleAddress) {
        str = item.name
      }
    })
    return str
  } else {
    let m = await resettleArea()
    let str = ''
    m.map((item: any) => {
      if (item.code === data.settleAddress) {
        str = item.name
      }
    })
    return str
  }
}
let tableData = ref()
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
      tableData.value = arr
    }
  })
}
onMounted(() => {
  initData()
  getList()
})
</script>

<style lang="less" scoped>
.sub-title {
  padding-left: 16px;
  margin-bottom: 34px;
  font-size: 16px;
  color: #171718;
}

.progress-wrapper {
  width: 100%;
  height: 100%;
  padding: 16px 16px 16px 50px;
  box-sizing: border-box;

  .progress-list {
    display: flex;
    flex-direction: column;

    .progress-item {
      display: flex;

      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 16px;

        .icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;

          .hollow {
            width: 18px;
            height: 18px;
            border: 1px solid #3e73ec;
            border-radius: 9px;
          }

          .disabled {
            width: 18px;
            height: 18px;
            background-color: #ebebeb;
            border-radius: 9px;
          }
        }

        .line {
          width: 2px;
          height: 124px;
          background-color: #3e73ec;

          &.in-progress {
            height: 74px;
          }

          &.disabled {
            height: 74px;
            background-color: #ebebeb;
          }

          &.none {
            height: 74px;
            background-color: #fff;
          }
        }
      }

      .right {
        width: 570px;
        padding-bottom: 16px;

        .content-box {
          width: 570px;
          padding: 21px 16px;
          border: 1px solid #ebebeb;
          border-radius: 4px;
          box-sizing: border-box;

          &.finish {
            background: #fafafa;
          }

          .content-1 {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .name {
              font-size: 16px;
              color: #171718;
            }
          }

          .status {
            margin-top: 9px;
            font-size: 14px;
            color: #3e73ec;
          }

          .time {
            font-size: 14px;
            color: rgba(19, 19, 19, 0.4);
          }
        }
      }
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
