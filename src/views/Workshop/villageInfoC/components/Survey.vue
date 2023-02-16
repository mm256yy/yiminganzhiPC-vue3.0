<template>
  <ElDialog
    title="居民概况表"
    :model-value="props.show"
    :width="1000"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
    destroy-on-close
  >
    <div class="survey-box">
      <div class="survey-item">
        <div class="survey-head">
          人口信息：共
          <span class="num">{{ props.data?.demographicList.length || 0 }}</span> 人
        </div>
        <div class="survey-body">
          <ElTable
            :border="true"
            :data="props.data ? props.data.demographicList : []"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
            style="width: 100%"
          >
            <ElTableColumn prop="name" label="姓名" />
            <ElTableColumn prop="relationText" label="与户主关系" />
            <ElTableColumn prop="sexText" label="性别" />
            <ElTableColumn prop="nationText" label="民族" />
            <ElTableColumn prop="maritalText" label="婚姻状况" />
            <ElTableColumn prop="censusRegister" label="户籍所在地" />
            <ElTableColumn prop="card" label="身份证号" />
            <ElTableColumn prop="populationTypeText" label="人口类型" />
          </ElTable>
        </div>
      </div>

      <div class="survey-item">
        <div class="survey-head"
          >房屋信息：共<span class="num">{{ props.data?.immigrantHouseList.length || 0 }}</span
          >幢</div
        >
        <div class="survey-body">
          <ElTable
            :border="true"
            :data="props.data ? props.data.immigrantHouseList : []"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
            style="width: 100%"
          >
            <ElTableColumn prop="houseNo" label="编号" />
            <ElTableColumn prop="houseTypeText" label="类别" />
            <ElTableColumn prop="houseHeight" label="高程(m)" />
            <ElTableColumn prop="storeyNumber" label="层数(层)" />
            <ElTableColumn prop="landArea" label="建筑面积" />
            <ElTableColumn prop="constructionTypeText" label="结构类型" />
            <ElTableColumn prop="completedTime" :formatter="formatCompletedTime" label="竣工年月" />
            <ElTableColumn prop="propertyNo" label="房屋所有权证" />
            <ElTableColumn prop="landNo" label="土地使用权证" />
          </ElTable>
        </div>
      </div>

      <div class="survey-item">
        <div class="survey-head"
          >附属物信息：共<span class="num">{{
            props.data?.immigrantAppendantList.length || 0
          }}</span
          >件</div
        >
        <div class="survey-body">
          <ElTable
            :border="true"
            :data="props.data ? props.data.immigrantAppendantList : []"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
            style="width: 100%"
          >
            <ElTableColumn type="index" label="序号" />
            <ElTableColumn prop="name" label="项目" />
            <ElTableColumn prop="size" label="规格" />
            <ElTableColumn prop="unit" label="单位" />
            <ElTableColumn prop="number" label="数量" />
          </ElTable>
        </div>
      </div>

      <div class="survey-item">
        <div class="survey-head"
          >零星林果木信息：共<span class="num">{{ props.data?.immigrantTreeList.length || 0 }}</span
          >处</div
        >
        <div class="survey-body">
          <ElTable
            :border="true"
            :data="props.data ? props.data.immigrantTreeList : []"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
            style="width: 100%"
          >
            <ElTableColumn type="index" label="序号" />
            <ElTableColumn prop="nameText" label="项目" />
            <ElTableColumn prop="sizeText" label="规格" />
            <ElTableColumn prop="unitText" label="单位" />
            <ElTableColumn prop="number" label="数量" />
          </ElTable>
        </div>
      </div>

      <div class="survey-item">
        <div class="survey-head"
          >坟墓信息：共<span class="num">{{ props.data?.immigrantGraveList.length || 0 }}</span
          >处</div
        >
        <div class="survey-body">
          <ElTable
            :border="true"
            :data="props.data ? props.data.immigrantGraveList : []"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
            style="width: 100%"
          >
            <ElTableColumn type="index" label="序号" />
            <ElTableColumn prop="graveTypeText" label="穴位" />
            <ElTableColumn prop="materialsText" label="材料" />
            <ElTableColumn prop="graveYear" label="立坟年份" />
            <ElTableColumn prop="number" label="数量(座)" />
          </ElTable>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import { ElDialog, ElTableColumn, ElTable } from 'element-plus'
import { SurveyInfoType } from '@/api/workshop/landlord/types'
import { formatDate } from '@/utils/index'

interface PropsType {
  show: boolean
  data: SurveyInfoType | null
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

const formatCompletedTime = (row) => {
  return formatDate(row.completedTime)
}
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
