<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="title">农村移民自建房验收告知单</div>
      <div class="content-wrap">
        <div class="row">
          <input class="input-txt w-200" v-model="form.govName" placeholder="请输入业主名称" />
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
            v-model="form.householdlerName"
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
              <el-button>添加行</el-button>
            </div>
          </div>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column
              prop="id"
              label="序号"
              width="80"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="houseLandNum"
              label="宅基地编号"
              width="180"
              header-align="center"
            >
              <template #default="{ row }">
                <ElInput v-model="row.houseLandNum" :placeholder="'请输入'" />
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
              prop="isPassCheck"
              label="是否通过验收"
              align="center"
              header-align="center"
            >
              <template #default="{ row }">
                <el-switch v-model="row.isPassCheck" />
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
              <!-- ="{ row }" -->
              <template #default>
                <el-button type="text" class="!text-[#E43030]">删除</el-button>
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
import { ref } from 'vue'
import { WorkContentWrap } from '@/components/ContentWrap'
// import { useDictStoreWithOut } from '@/store/modules/dict'
import { ElTable, ElTableColumn, ElInput, ElButton, ElSwitch } from 'element-plus'

interface PropsType {
  doorNo: string
  householdId: number
  projectId: number
  uid: string
}

const props = defineProps<PropsType>()

console.log('props:', props)

// const dictStore = useDictStoreWithOut()
// const dictObj = computed(() => dictStore.getDictObj)
const tableData = ref([
  {
    id: 1,
    remark: '',
    isPassCheck: false,
    ground: '',
    piping: '',
    waterproof: '',
    hydropower: '',
    wall: '',
    houseLandNum: ''
  }
])

const defaultRow = {
  govName: '', // 政府名称
  natureVillageName: '', // 自然村名称
  houseName: '', // 房屋名称
  handoverProject: '', // 腾空移交项目
  hoseholdName: '', // 户主姓名
  doorNo: '', // 户号
  relocationAddress: '' // 迁出地址
}

const form = ref<any>(defaultRow)
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
