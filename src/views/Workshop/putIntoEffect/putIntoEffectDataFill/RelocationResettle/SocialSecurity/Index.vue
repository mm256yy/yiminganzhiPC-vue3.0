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
      <div class="title">社保缴费确认单</div>
      <div class="content-wrap">
        <div class="row">
          <input class="input-txt w-200" v-model="form.govName" placeholder="请输入政府名称" />
          人民政府：
        </div>
        <div class="row">
          <div class="txt-indent-28">我户</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.familyName"
            placeholder="请输入"
          />
          （家庭成员姓名）选择社会保障安置方式，现已完成参保缴费。
        </div>

        <div class="row">
          <div class="txt-indent-28">户主</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.householdler"
            placeholder="请输入户主名称"
          />
          户号：
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.doorNo"
            placeholder="请输入户号"
          />
          迁出地址：
          <input
            class="input-txt w-400 ml-10"
            v-model="form.relocationAddress"
            placeholder="请输入迁出地址"
          />
        </div>

        <div class="table-area">
          <div class="table-head">
            <div class="table-tit">参保人员信息登记：</div>
            <div class="table-action">
              <el-button type="primary" :icon="addIcon" @click="onAddRow">添加行</el-button>
            </div>
          </div>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
              header-align="center"
            />
            <el-table-column prop="name" label="参保人" width="180" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.name" :placeholder="'请输入'" />
              </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="230" header-align="center">
              <template #default="{ row }">
                <ElSelect class="w-200" clearable placeholder="请选择" v-model="row.sex">
                  <ElOption
                    v-for="item in dictObj[292]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </template>
            </el-table-column>
            <el-table-column prop="card" label="身份证号码" width="230" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.card" :placeholder="'请输入'" />
              </template>
            </el-table-column>
            <el-table-column prop="paymentLevel" label="缴费档次" width="180" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.paymentLevel" :placeholder="'请输入'" />
              </template>
            </el-table-column>

            <el-table-column prop="paymentPrice" label="缴费金额" width="180" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.paymentPrice" :placeholder="'请输入'" />
              </template>
            </el-table-column>

            <el-table-column
              prop="paymentTime"
              label="缴费时间"
              align="center"
              header-align="center"
            >
              <template #default="{ row }">
                <el-date-picker v-model="row.paymentTime" type="date" placeholder="请选择日期" />
              </template>
            </el-table-column>

            <el-table-column
              prop="option"
              label="操作"
              width="100"
              align="center"
              header-align="center"
            >
              <template #default="{ row }">
                <el-button @click="onDelRow(row)" type="text" class="!text-[#E43030]"
                  >删除</el-button
                >
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
import { ref, computed } from 'vue'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {
  ElSpace,
  ElTable,
  ElTableColumn,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElDatePicker,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'

interface PropsType {
  doorNo: string
  householdId: number
  projectId: number
  uid: string
}

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })

console.log('props:', props)

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const tableData = ref<any[]>([])

const defaultForm = {
  householdler: '', // 户主（择房人）
  doorNo: '', // 户号
  relocationAddress: '', // 迁出地址
  govName: '', // 业主
  familyName: '' // 家庭成员姓名
}

const defaultRow = {
  name: '',
  sex: '',
  card: '',
  paymentLevel: '',
  paymentPrice: '',
  paymentTime: ''
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
  const params = {
    ...form.value,
    tableData: tableData.value
  }
  console.log(params, '参数')
  // saveMainHouseApi(params).then(() => {
  //   ElMessage.success('操作成功！')
  //   getList()
  // })
}
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

.table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;

  .table-tit {
    font-weight: bold;
  }

  .table-action {
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
</style>
