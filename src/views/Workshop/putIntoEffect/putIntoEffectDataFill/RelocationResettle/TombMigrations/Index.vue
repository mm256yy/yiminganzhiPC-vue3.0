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
      <div class="title">坟墓迁移告知单</div>
      <div class="content-wrap">
        <div class="row">
          <input class="input-txt w-200" v-model="form.householder" placeholder="请输入户主姓名" />
          <div class="txt-indent-28"> 户： </div>
        </div>
        <div class="row">
          <div class="empty"></div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.graveMigrateName"
            placeholder="请输入坟墓名称"
          />
          <div class="txt-indent-28">
            公墓项目已顺利通过各项验收，你户为先人选择的坟墓墓穴已满足交付条件，请尽快办理先人坟墓迁移事项。现对
          </div>
        </div>
        <div class="row txt-indent-28">如下坟墓墓穴信息予以告知:</div>
        <div class="row">
          <div class="txt-indent-28 mr-10">择址号：</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.graveMigrateNum"
            placeholder="请输入择址号"
          />
          <div class="txt-indent-28 mr-10">登记权属人：</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.householder"
            placeholder="请输入权属人姓名"
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
            v-model="form.graveMigrateOutAddress"
            placeholder="请输入迁出地址"
          />
        </div>
        <div class="pl-28">
          <div class="flex items-center justify-between pb-12px">
            <div class="sub-title">坟墓择址信息登记：</div>
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
            <ElTableColumn
              label="与登记权属人关系"
              prop="relation"
              align="center"
              header-align="center"
            >
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.relation" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="处理方式" prop="handleWay" align="center" header-align="center">
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.handleWay" />
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="安置墓地名称"
              prop="graveName"
              align="center"
              header-align="center"
            >
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.graveName" />
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="详细地址"
              prop="graveAddress"
              align="center"
              header-align="center"
            >
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.graveAddress" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="墓地编号" prop="graveNum" align="center" header-align="center">
              <template #default="scope">
                <ElInput placeholder="请输入" v-model="scope.row.graveNum" />
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
  deleteTombAddressApi
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
  doorNo: props.doorNo, // 户号
  graveMigrateName: '', // 坟墓名称
  graveMigrateNum: '', // 择房号
  householdler: '', // 登记权属人
  graveMigrateOutAddress: '' // 迁出地址
}

const defaultRow = {
  householdId: props.householdId,
  projectId: props.projectId,
  uid: props.uid,
  doorNo: props.doorNo, // 户号
  relation: '', // 与登记权属人关系
  handleWay: '', // 处理方式
  graveName: '', // 安置墓地名称
  graveAddress: '', // 详细地址
  graveNum: '' // 墓地编号
}

const form = ref<any>(defaultForm)

// 获取列表数据
const initData = () => {
  const params: any = {
    doorNo: props.doorNo,
    type: RelocationResettleTypes.MigrateGrave,
    size: 1000
  }
  getRelocationResettleApi(params).then((res: any) => {
    console.log('res:', res)
    if (res && res.doorNo) {
      form.value = res
      tableData.value = res.rrChooseGraveInfoList
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
        await deleteTombAddressApi(row.id)
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
    rrChooseGraveInfoList: [...tableData.value],
    type: RelocationResettleTypes.MigrateGrave
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
