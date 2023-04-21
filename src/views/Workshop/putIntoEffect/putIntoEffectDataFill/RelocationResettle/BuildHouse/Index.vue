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
      <div class="title">建房告知单</div>
      <div class="content-wrap">
        <div class="row">
          <input class="input-txt w-200" v-model="form.govName" placeholder="请输入业主姓名" />
          业主：
        </div>
        <div class="row">
          <div class="txt-indent-28">你户选择的位于</div>
          <input
            class="input-txt w-400 ml-10 mr-10"
            v-model="form.relocationAddress"
            placeholder="输入"
          />
          <div class="txt-indent-28">的农村宅基地</div>
        </div>
        <div class="row txt-indent-28">已完成“三通一平”等基础建设，特此告知。</div>
        <div class="row">
          <div class="txt-indent-28 mr-10">户主：</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.houseNo"
            placeholder="请输入户主姓名"
          />
          户号：
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.householdler"
            placeholder="请输入户号"
          />
        </div>
        <div class="row">
          <div class="txt-indent-28">迁出地址：</div>
          <input
            class="input-txt w-400 ml-10 mr-10"
            v-model="form.relocationAddress"
            placeholder="请输入迁出地址"
          />
        </div>
        <div class="pl-28">
          <div class="flex items-center justify-between pb-12px">
            <div class="sub-title">建房信息登记：</div>
            <ElSpace>
              <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加行</ElButton>
            </ElSpace>
          </div>
          <ElTable :data="tableData" style="width: 100%" class="mb-20">
            <ElTableColumn
              label="序号"
              :width="60"
              type="index"
              align="center"
              header-align="center"
            />
            <ElTableColumn label="宅基地编号" prop="landBlock" align="center" header-align="center">
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.landBlock" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="区块" prop="houseType" align="center" header-align="center">
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.houseType" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="面积" prop="houseNo" align="center" header-align="center">
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.houseNo" />
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
import { ref } from 'vue'
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

console.log('props:', props)

const defaultForm = {
  govName: '', // 政府名称
  houseNo: '', // 择房号
  householdler: '', // 户主（择房人）
  doorNo: '', // 户号
  relocationAddress: '' // 迁出地址
}

const defaultRow = {
  landBlock: '', // 区块
  houseType: '', // 房型
  houseNo: '', // 幢号
  roomNo: '', // 室号
  storageRoomNumber: '', // 储藏室编号
  garageNumber: '' // 车库编号
}

const form = ref<any>(defaultForm)

// 获取列表数据
const getList = () => {
  // const params: any = {
  //   doorNo: props.doorNo,
  //   householdId: props.householdId,
  //   projectId: props.projectId,
  //   status: 'implementation',
  //   size: 1000
  // }
  // getMainHouseListApi(params).then((res) => {
  //   tableData.value = res.content
  // })
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
        // await deleteMainHouseApi(row.id)
        getList()
        ElMessage.success('删除成功')
      })
      .catch(() => {})
  } else {
    tableData.value.splice(tableData.value.indexOf(row), 1)
  }
}

// 保存
const onSave = () => {
  // let params = {
  //   ...form.value,
  //   ...tableData.value
  // }
  // saveMainHouseApi(params).then(() => {
  //   ElMessage.success('操作成功！')
  //   getList()
  // })
}
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
