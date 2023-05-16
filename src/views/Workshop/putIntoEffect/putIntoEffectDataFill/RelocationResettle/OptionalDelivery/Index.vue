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
      <div class="title">择房交付告知单</div>
      <div class="content-wrap">
        <div class="row">
          <input class="input-txt w-200" v-model="form.householder" placeholder="请输入业主姓名" />
          业主：
        </div>
        <div class="row">
          <div class="empty"></div>
          <input
            class="input-txt w-400 ml-10 mr-10"
            v-model="form.deliverHouseOutAddress"
            placeholder="输入移民安置项目名称"
          />
          <div class="txt-indent-28">
            移民安置房项目已顺利通过各项验收，你户所选公寓房已满足交付条件，请准备相关资料尽快前往
          </div>
        </div>
        <div class="row">
          <div class="empty"></div>
          <input
            class="input-txt w-400 ml-10 mr-10"
            v-model="form.deliverHouseOutAddress"
            placeholder="请输入部门名称"
          />
          <div class="txt-indent-28">部门办理接房手续，现对你户房屋信息予以告知。</div>
        </div>
        <div class="row">
          <div class="txt-indent-28 mr-10">交房号：</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.deliverHouseNum"
            placeholder="请输入"
          />
          <div class="txt-indent-28 mr-10">户主：</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.householder"
            placeholder="请输入户主姓名"
          />
          <div class="txt-indent-28 mr-10">户号：</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.doorNo"
            placeholder="请输入户号"
          />
        </div>
        <div class="row">
          <div class="txt-indent-28">迁出地址：</div>
          <input
            class="input-txt w-400 ml-10 mr-10"
            v-model="form.deliverHouseOutAddress"
            placeholder="请输入迁出地址"
          />
        </div>
        <div class="pl-28">
          <div class="flex items-center justify-between pb-12px">
            <div class="sub-title">
              择房信息登记，所选房型及套数：
              <span class="text-[#1C5DF1]">{{ tableData.length }}</span>
            </div>
            <ElSpace>
              <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加行</ElButton>
            </ElSpace>
          </div>
          <ElTable :data="tableData" stripe border style="width: 100%" class="mb-20">
            <ElTableColumn
              label="序号"
              :width="60"
              type="index"
              align="center"
              header-align="center"
            />
            <ElTableColumn label="房型" prop="houseType" align="center" header-align="center">
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.houseType" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="区块" prop="area" align="center" header-align="center">
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.area" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="幢号" prop="buildingNum" align="center" header-align="center">
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.buildingNum" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="室号" prop="roomNum" align="center" header-align="center">
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.roomNum" />
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="储藏室编号"
              prop="storeroomNum"
              align="center"
              header-align="center"
            >
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.storeroomNum" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="车库编号" prop="garageNum" align="center" header-align="center">
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.garageNum" />
              </template>
            </ElTableColumn>
            <ElTableColumn :width="100" label="操作" prop="action">
              <template #default="scope">
                <span class="btn-txt" @click="onDelRow(scope.row)"> 删除 </span>
              </template>
            </ElTableColumn>
          </ElTable>
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
import { ref, onMounted } from 'vue'
import { useIcon } from '@/hooks/web/useIcon'
import {
  ElButton,
  ElInput,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import {
  getRelocationResettleApi,
  saveRelocationResettleApi,
  deleteChooseHouseApi
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
const tableData = ref<any[]>([])

const defaultForm = {
  householdId: props.householdId,
  projectId: props.projectId,
  uid: props.uid,
  deliverHouseName: '', // 移民安置项目名称
  deliverHouseDepart: '', // 部门
  deliverHouseNum: '', // 交房号
  deliverHouseOutAddress: '', // 迁出地址
  doorNo: props.doorNo // 户号
}

const defaultRow = {
  householdId: props.householdId,
  projectId: props.projectId,
  uid: props.uid,
  doorNo: props.doorNo, // 户号
  area: '', // 区块
  houseType: '', // 房型
  buildingNum: '', // 幢号
  roomNum: '', // 室号
  storeroomNum: '', // 储藏室编号
  garageNum: '' // 车库编号
}

const form = ref<any>(defaultForm)

// 初始化获取数据
const initData = () => {
  const params: any = {
    doorNo: props.doorNo,
    type: RelocationResettleTypes.ChooseHouseDelive,
    size: 1000
  }
  getRelocationResettleApi(params).then((res: any) => {
    if (res && res.doorNo) {
      form.value = res
      tableData.value = res.rrChooseHouseInfoList
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
        await deleteChooseHouseApi(row.id)
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
  let params = {
    ...form.value,
    rrChooseHouseInfoList: [...tableData.value],
    type: RelocationResettleTypes.ChooseHouseDelive
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
  padding: 10px 0 40px 0;
  font-size: 20px;
  font-weight: bold;
  color: #171718;
  text-align: center;
  box-sizing: border-box;
}

.sub-title {
  font-size: 14px;
  font-weight: bold;
  color: #171718;
}

.row {
  display: flex;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: bold;
  line-height: 30px;
  color: #171718;
  align-items: center;

  .empty {
    width: 20px;
  }

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

.ml-10 {
  margin-left: 10px;
}

.mr-10 {
  margin-right: 10px;
}

.mb-20 {
  margin-bottom: 20px;
}

.pl-28 {
  padding-left: 28px;
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

.btn-txt {
  color: red;
  cursor: pointer;
}
</style>
