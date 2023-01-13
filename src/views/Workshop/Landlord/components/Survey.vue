<template>
  <ElDialog
    title="居民概况表"
    :model-value="props.show"
    :width="1210"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
    destroy-on-close
  >
    <div class="survey-box">
      <div class="survey-item">
        <div class="survey-head">人口信息：共<span class="num">5</span>人</div>
        <div class="survey-body">
          <ElTable
            :border="true"
            :data="array[0]"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
            style="width: 100%"
          >
            <ElTableColumn prop="name" label="姓名" width="110" />
            <ElTableColumn prop="relationText" label="与户主关系" width="132" />
            <ElTableColumn prop="sexName" label="性别" width="85" />
            <ElTableColumn prop="nationText" label="民族" width="107" />
            <ElTableColumn prop="maritalText" label="婚姻状况" width="107" />
            <ElTableColumn prop="censusRegister" label="户籍所在地" />
            <ElTableColumn prop="card" label="身份证号" width="172" />
            <ElTableColumn prop="populationTypeText" label="人口类型" width="130" />
          </ElTable>
        </div>
      </div>

      <div class="survey-item">
        <div class="survey-head">房屋信息：共<span class="num">5</span>人</div>
        <div class="survey-body">
          <ElTable
            :border="true"
            :data="tableData"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
            style="width: 100%"
          >
            <ElTableColumn prop="date" label="Date" width="180" />
            <ElTableColumn prop="name" label="Name" width="180" />
            <ElTableColumn prop="address" label="Address" />
          </ElTable>
        </div>
      </div>

      <div class="survey-item">
        <div class="survey-head">附属物信息：共<span class="num">5</span>人</div>
        <div class="survey-body">
          <ElTable
            :border="true"
            :data="tableData"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
            style="width: 100%"
          >
            <ElTableColumn prop="date" label="Date" width="180" />
            <ElTableColumn prop="name" label="Name" width="180" />
            <ElTableColumn prop="address" label="Address" />
          </ElTable>
        </div>
      </div>

      <div class="survey-item">
        <div class="survey-head">零星林果木信息：共<span class="num">5</span>人</div>
        <div class="survey-body">
          <ElTable
            :border="true"
            :data="tableData"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
            style="width: 100%"
          >
            <ElTableColumn prop="date" label="Date" width="180" />
            <ElTableColumn prop="name" label="Name" width="180" />
            <ElTableColumn prop="address" label="Address" />
          </ElTable>
        </div>
      </div>

      <div class="survey-item">
        <div class="survey-head">坟墓信息：共<span class="num">5</span>人</div>
        <div class="survey-body">
          <ElTable
            :border="true"
            :data="tableData"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
            style="width: 100%"
          >
            <ElTableColumn prop="date" label="Date" width="180" />
            <ElTableColumn prop="name" label="Name" width="180" />
            <ElTableColumn prop="address" label="Address" />
          </ElTable>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import { ElDialog, ElTableColumn, ElTable } from 'element-plus'
// import { printLandlordApi } from '@/api/workshop/landlord/service'

interface PropsType {
  show: boolean
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close'])
// const list = ref([])

const onClose = () => {
  emit('close')
}

const headerStyle: any = {
  fontWeight: 'normal',
  textAlign: 'center',
  backgroundColor: '#fff !important'
}

const cellStyle: any = {
  textAlign: 'center'
}

const array = [
  [
    {
      address: '浙江省丽水市莲都区苏港村昆濑１３号',
      areaCode: '331102',
      areaCodeText: '莲都区',
      birthday: '2020年09月',
      card: '331102202009132415',
      cardPic: null,
      censusRegister: null,
      censusType: null,
      censusTypeText: null,
      cityCode: '331100',
      cityCodeText: '丽水市',
      comeAddressCause: null,
      comeAddressTime: null,
      comeCause: null,
      comeTime: null,
      company: null,
      doorNo: '74d24da6-3ce3-492b-b064-80509e',
      education: null,
      educationText: null,
      fromAddress: null,
      fromTown: null,
      householdNumber: '006010394',
      householdPic: null,
      id: 14836,
      insuranceType: null,
      insuranceTypeText: null,
      marital: null,
      maritalText: null,
      name: '季悠扬',
      nation: '汉族',
      nationText: null,
      occupation: null,
      occupationText: null,
      otherPic: null,
      phone: '13333333333',
      populationSort: null,
      populationSortText: null,
      populationType: null,
      populationTypeText: null,
      projectId: 2,
      relation: 'Son',
      relationText: '子',
      remark: null,
      sex: '1',
      sexText: '男',
      townCode: '331102005',
      townCodeText: '联城街道',
      villageCode: '331102005210',
      villageText: '苏港村',
      virutalVillageCode: '3311020052100001',
      virutalVillageText: '昆濑'
    }
  ]
]
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
</script>

<style lang="less" scoped>
.survey-item {
  margin-bottom: 25px;

  &:last-child {
    margin-bottom: 0;
  }
}

.survey-head {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  color: #171718;
  background: #f6f6f6;
  box-shadow: 0px 1px 0px 0px #ebebeb;

  .num {
    margin: 0 5px;
    color: var(--el-color-primary);
  }
}
</style>
