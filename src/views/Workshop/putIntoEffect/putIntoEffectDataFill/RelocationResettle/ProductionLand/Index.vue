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
      <div class="title">生产用地交付告知单</div>
      <div class="content-wrap">
        <div class="row">
          <input class="input-txt w-200" v-model="form.householder" placeholder="请输入业主名称" />
          业主：
        </div>
        <div class="row">
          <div class="txt-indent-28">你户</div>
          <input class="input-txt w-200 ml-10 mr-10" v-model="form.familyMember" readonly />
          （家庭成员姓名）选择有土安置方式，分得的生产用地总计
          <input class="input-txt w-200 ml-10 mr-10" v-model="form.landArea" readonly />亩，
        </div>
        <div class="row">
          <div class="txt-indent-28">其中耕地</div>
          <input class="input-txt w-200 ml-10 mr-10" v-model="form.arableLandArea" readonly />
          亩，园、林地
          <input class="input-txt w-200 ml-10 mr-10" v-model="form.woodLandArea" readonly />
          亩，未利用地
          <input class="input-txt w-200 ml-10 mr-10" v-model="form.uselessArea" readonly />亩。
        </div>

        <div class="row">
          <div class="txt-indent-28">
            现全部土地均已完成土地调剂和土地整理工作，满足生产用地移交条件，请尽快携带相关材料前往
          </div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.landDepart"
            placeholder="请输入"
          />
          部门办理土地交接手续。
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
          迁出地址：
          <input
            class="input-txt w-400 ml-10"
            v-model="form.landOutAddress"
            placeholder="请输入迁出地址"
          />
        </div>

        <div class="table-area">
          <div class="table-head">
            <div class="table-tit">生产用地地块信息登记：</div>
            <div class="table-action">
              <el-button type="primary" :icon="addIcon" @click="onAddRow">添加行</el-button>
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
            <el-table-column prop="landName" label="地名" width="180" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.landName" :placeholder="'请输入地名'" />
              </template>
            </el-table-column>
            <el-table-column prop="landArea" label="面积" width="180" header-align="center">
              <template #default="{ row }">
                <ElInput v-model="row.landArea" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column prop="landType" label="地类" width="230" header-align="center">
              <template #default="{ row }">
                <ElSelect class="w-200" clearable placeholder="请选择" v-model="row.landType">
                  <ElOption
                    v-for="item in dictObj[233]"
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
import { useDictStoreWithOut } from '@/store/modules/dict'
import {
  ElSpace,
  ElTable,
  ElTableColumn,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getRelocationResettleApi,
  saveRelocationResettleApi,
  deleteProductLandApi
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
  familyMember: '', // 家庭成员姓名
  landArea: '', // 生产用地总计
  arableLandArea: '', // 耕地
  woodLandArea: '', // 园、林地
  uselessArea: '', // 未利用地
  landDepart: '', // 部门
  householder: '', // 户主
  doorNo: props.doorNo, // 户号
  landOutAddress: '' // 迁出地址
}

const defaultRow = {
  householdId: props.householdId,
  projectId: props.projectId,
  uid: props.uid,
  doorNo: props.doorNo, // 户号
  landName: '', // 地名
  landArea: '', // 面积
  landType: '', // 地类
  remark: '' // 备注
}

const form = ref<any>(defaultForm)

// 初始化获取数据
const initData = () => {
  const params: any = {
    doorNo: props.doorNo,
    type: RelocationResettleTypes.ProLandDelive,
    size: 1000
  }
  getRelocationResettleApi(params).then((res: any) => {
    if (res && res.doorNo) {
      form.value = res
      tableData.value = res.rrLandInfoList
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
        await deleteProductLandApi(row.id)
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
    rrLandInfoList: [...tableData.value],
    type: RelocationResettleTypes.ProLandDelive
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

.ml-10 {
  margin-left: 10px;
}

.mb-20 {
  margin-bottom: 20px;
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
