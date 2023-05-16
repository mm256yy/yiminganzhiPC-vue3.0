<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton
            :icon="saveIcon"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
          >
            保存
          </ElButton>
        </ElSpace>
      </div>
      <div class="title">农村移民自建房验收告知单</div>
      <div class="content-wrap">
        <div class="row">
          <input class="input-txt w-200" v-model="form.householder" placeholder="请输入业主名称" />
          业主：
        </div>
        <div class="row">
          <div class="txt-indent-28"
            >根据农村宅基地自建房的进度情况及你户的自建房验收申请，根据有关条例对你户的自建房开展了验收，现将验收信息予以告知：
          </div>
        </div>

        <div class="row">
          <div class="txt-indent-28">户主</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.householder"
            placeholder="请输入户主名称"
          />
          户号：
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.doorNo"
            placeholder="请输入户号"
          />
        </div>

        <div class="table-area">
          <div class="table-head">
            <div class="table-tit">房屋信息登记：</div>
            <div class="table-action">
              <el-button type="primary" @click="onAddRow" :icon="addIcon">添加行</el-button>
            </div>
          </div>
          <el-table :data="tableData" stripe border style="width: 100%" class="mb-20">
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="homesteadNum"
              label="宅基地编号"
              width="180"
              header-align="center"
            >
              <template #default="{ row }">
                <ElInput v-model="row.homesteadNum" :placeholder="'请输入'" />
              </template>
            </el-table-column>
            <el-table-column prop="wall" label="墙壁" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.wall" :placeholder="'请输入'" />
              </template>
            </el-table-column>
            <el-table-column prop="hydropower" label="水电" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.hydropower" :placeholder="'请输入'" />
              </template>
            </el-table-column>
            <el-table-column prop="waterproof" label="防水" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.waterproof" :placeholder="'请输入'" />
              </template>
            </el-table-column>

            <el-table-column prop="piping" label="管道" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.piping" :placeholder="'请输入'" />
              </template>
            </el-table-column>

            <el-table-column prop="ground" label="地面" align="center" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.ground" :placeholder="'请输入'" />
              </template>
            </el-table-column>
            <el-table-column
              prop="isCheck"
              label="是否通过验收"
              align="center"
              header-align="center"
            >
              <template #default="{ row }">
                <ElSelect class="w-200" clearable placeholder="请选择" v-model="row.isCheck">
                  <ElOption
                    v-for="item in dictObj[365]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.remark" :placeholder="'请输入'" />
              </template>
            </el-table-column>
            <el-table-column
              prop="option"
              label="操作"
              width="180"
              align="center"
              header-align="center"
            >
              <template #default="{ row }">
                <el-button @click="onDelRow(row)" type="text" class="!text-[#E43030]">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="row txt-indent-28">特此告知！</div>
        <div class="row right">移交人（捺印）：</div>
        <div class="row right">经办人（签字）：</div>
        <div class="row right">移交日期：</div>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {
  ElSpace,
  ElTable,
  ElTableColumn,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getRelocationResettleApi,
  saveRelocationResettleApi,
  deleteBuildRoomApi
} from '@/api/putIntoEffect/putIntoEffectDataFill/RelocationResettle/relocationResettle-service'
import { RelocationResettleTypes } from '../../config'

interface PropsType {
  doorNo: string
  householdId: number
  projectId: number
  uid: string
}

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const tableData = ref<any[]>([])

const defaultForm = {
  householdId: props.householdId,
  projectId: props.projectId,
  uid: props.uid,
  householder: '', // 业主
  doorNo: props.doorNo // 户号
}

const defaultRow = {
  householdId: props.householdId,
  projectId: props.projectId,
  uid: props.uid,
  doorNo: props.doorNo, // 户号
  homesteadNum: '', // 宅基地编号
  wall: '', // 墙壁
  hydropower: '', // 水电
  waterproof: '', // 防水
  piping: '', // 管道
  ground: '', // 地面
  isCheck: '', // 是否通过验收
  remark: '' // 备注
}

const form = ref<any>(defaultForm)

// 获取列表数据
const initData = () => {
  const params: any = {
    doorNo: props.doorNo,
    type: RelocationResettleTypes.ChooseHouseCheck,
    size: 1000
  }
  getRelocationResettleApi(params).then((res: any) => {
    console.log('res:', res)
    if (res && res.doorNo) {
      form.value = res
      tableData.value = res.rrHouseBuildCheckList
    }
  })
}

// 添加行
const onAddRow = () => {
  tableData.value.push({ ...defaultRow })
}

// 删除
const onDelRow = (row) => {
  if (row.id) {
    ElMessageBox.confirm('确认要删除该信息吗？', '警告', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    })
      .then(async () => {
        await deleteBuildRoomApi(row.id)
        initData()
        ElMessage.success('删除成功')
      })
      .catch(() => {})
  } else {
    tableData.value.splice(tableData.value.indexOf(row), 1)
  }
}

// 保存
const onSave = () => {
  const params = {
    ...form.value,
    rrHouseBuildCheckList: [...tableData.value],
    type: RelocationResettleTypes.ChooseHouseCheck
  }
  saveRelocationResettleApi(params).then(() => {
    ElMessage.success('操作成功！')
    initData()
  })
}

onMounted(() => {
  initData()
})
</script>

<style lang="less" scoped>
.title {
  width: 100%;
  padding: 45px 0 40px 0;
  font-size: 20px;
  font-weight: bold;
  color: #171718;
  text-align: center;
  box-sizing: border-box;
}

.row {
  display: flex;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: bold;
  line-height: 30px;
  color: #171718;
  align-items: center;

  &.right {
    justify-content: right;
    padding-right: 200px;
  }
}

.input-txt {
  margin: 0;
  font-size: 14px;
  border-bottom: 1px solid;
  outline: none;
}

.mb-20 {
  margin-bottom: 20px;
}

.ml-10 {
  margin-left: 10px;
}

.mr-10 {
  margin-right: 10px;
}

.w-150 {
  width: 150px;
}

.w-200 {
  width: 200px;
}

.w-400 {
  width: 400px;
}

.txt-indent-28 {
  text-indent: 28px;
}

.table-area {
  padding-left: 28px;

  .table-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;

    .table-tit {
      font-size: 14px;
      font-weight: bold;
    }

    .table-action {
      display: flex;
      align-items: center;
      justify-content: right;
    }
  }
}
</style>
