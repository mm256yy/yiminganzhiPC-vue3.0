<!-- 安置意愿 -->
<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace v-if="isEdit">
          <ElButton
            :icon="saveIcon"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
            >保存</ElButton
          >
          <ElButton @click="recordClick" v-if="surveyStatus === SurveyStatusEnum.Review"
            >修改日志</ElButton
          >
        </ElSpace>
      </div>

      <div class="desire">
        <div class="desire-item">
          <div class="common-title"><span class="line"></span>家庭信息</div>
          <div class="common-cont family">
            <div class="family-item">
              <div class="tit">家庭总人数</div>
              <ElInput
                v-model="form.familyNum"
                type="number"
                :min="1"
                disabled
                placeholder="请输入人数"
              >
                <template #append>人</template>
              </ElInput>
            </div>

            <div class="family-item">
              <div class="tit">其中：农村移民人数</div>
              <ElInput
                v-model="form.countryNum"
                type="number"
                :min="0"
                placeholder="请输入人数"
                :disabled="!isEdit"
              >
                <template #append>人</template>
              </ElInput>
            </div>

            <div class="family-item">
              <div class="tit">其中：非农村移民人数</div>
              <ElInput
                v-model="form.unCountryNum"
                type="number"
                :min="0"
                placeholder="请输入人数"
                :disabled="!isEdit"
              >
                <template #append>人</template>
              </ElInput>
            </div>
          </div>
        </div>

        <div class="desire-item">
          <div class="common-title"><span class="line"></span>生产安置方式</div>
          <div class="common-cont scaz">
            <!-- <div class="radio-item">
              <ElRadioGroup v-model="form.productionType">
                <ElRadio v-for="item in ProductionPlaceWay" :key="item.label" :label="item.value">{{
                  item.label
                }}</ElRadio>
              </ElRadioGroup>
            </div> -->
            <div
              class="common-item"
              v-for="item in immigrantWillProductionList"
              :key="item.productionType"
            >
              <div class="tit" style="width: 150px; text-align: right">{{
                item.productionType
              }}</div>
              <ElInput
                v-model="item.number"
                type="number"
                :min="0"
                placeholder="请输入"
                :disabled="!isEdit"
              >
                <template #append>人</template>
              </ElInput>
            </div>
          </div>
        </div>

        <div class="desire-item">
          <div class="common-title"><span class="line"></span>搬迁安置方式</div>
          <div class="common-cont">
            <div class="radio-item" v-if="!length">
              <div>默认：</div>
              <ElRadioGroup v-model="form.removalType" :disabled="!isEdit">
                <ElRadio v-for="item in morenData" :key="item.label" :label="item.value">{{
                  item.label
                }}</ElRadio>
              </ElRadioGroup>
            </div>

            <div v-else>
              <div class="radio-item">
                <!-- <div>宅基地安置：</div> -->
                <ElRadioGroup v-model="form.removalType" :disabled="!isEdit">
                  1111
                  <ElRadio v-for="item in Homestead" :key="item.label" :label="item.value">{{
                    item.label
                  }}</ElRadio>
                </ElRadioGroup>
              </div>

              <!-- <div class="radio-item">
                <div>公寓房安置：</div>
                <ElRadioGroup v-model="form.removalType" :disabled="!isEdit">
                  <ElRadio v-for="item in flats" :key="item.label" :label="item.value">{{
                    item.label
                  }}</ElRadio>
                </ElRadioGroup>
              </div> -->
            </div>
          </div>
        </div>

        <div class="desire-item">
          <div class="common-title"><span class="line"></span>备注</div>
          <div class="common-cont">
            <ElInput
              v-model="form.opinion"
              class="mb-10px"
              type="textarea"
              placeholder="请输入内容"
            />
          </div>
        </div>
      </div>
    </div>
    <RecordListDialog
      type="安置意愿信息"
      :recordShow="recordShow"
      @close="recordClose"
      :doorNo="doorNo"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import RecordListDialog from '../components/RecordListDialog.vue'
import { WorkContentWrap } from '@/components/ContentWrap'
import { ref, unref, onMounted, computed } from 'vue'
import { ElButton, ElRadioGroup, ElRadio, ElSpace, ElInput, ElMessage } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getResettlementListApi,
  saveResettlementListApi,
  getResettlementConfigApi
} from '@/api/workshop/datafill/resettlement-service'
import { getDemographicListApi } from '@/api/workshop/population/service'
// import { ProductionPlaceWay } from '../config'
import { useAppStore } from '@/store/modules/app'
import { ResettlementDtoType } from '@/api/workshop/datafill/resettlement-types'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'

interface PropsType {
  householdId: string
  doorNo: string
  baseInfo: any
  surveyStatus: SurveyStatusEnum
  classifyType?: string // 角色分类类型
}

const recordShow = ref(false)

const recordClose = () => {
  recordShow.value = false
}
const recordClick = () => {
  recordShow.value = true
}

// 是否可编辑
const isEdit = computed(() => {
  return props.classifyType !== 'check'
})

const Homestead = ref<any>([])
const flats = ref<any>([])
// way 1 宅基地安置 2 公寓安置
// enum PalceWay {
//   Homestead = 1,
//   Apartment = 2
// }
const length = ref<any>('')
const props = defineProps<PropsType>()
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const appStore = useAppStore()
const morenData = ref<any>([
  { value: '市内县外', label: '市内县外' },
  { value: '县内安置（有土）', label: '县内安置（有土）' },
  { value: '县内安置（无土）', label: '县内安置（无土）' },
  { value: '自谋出路', label: '自谋出路' }
])
const defaultVal = {
  doorNo: props.doorNo,
  householdId: +props.householdId,
  familyNum: '',
  countryNum: '',
  unCountryNum: '',
  productionType: '',
  removalType: '',
  opinion: ''
}

const form = ref<ResettlementDtoType>(defaultVal)
const placeWay = ref<any>({})

const getResettlementConfig = async () => {
  const res = await getResettlementConfigApi({
    projectId: appStore.getCurrentProjectId,
    size: 100
  })

  length.value = res.content.find((item) => {
    return item.type == '搬迁安置'
  })
  if (res && res.content && res.content.length) {
    let map = {}
    console.log(res.content, '数据')
    res.content.forEach((item) => {
      // 不存在这个key，给dest 数组创建了一个项，并携带子集，并给map 创建了一项
      if (!map[item.way]) {
        map[item.way] = [
          {
            label: item.area,
            value: item.area
          }
        ]
      } else {
        map[item.way].push({
          label: item.area,
          value: item.area
        })
      }
      if (item.type == '生产安置') {
        immigrantWillProductionList.value.push({
          productionType: item.way,
          number: 0
        })
      }
    })
    console.log(map, '11111111111')
    Homestead.value = map['']
    flats.value = map['']
    placeWay.value = map
  }
}
const immigrantWillProductionList = ref<any>([])
const getResettlement = async () => {
  const params = {
    doorNo: props.doorNo,
    householdId: +props.householdId
  }
  const res = await getResettlementListApi(params)
  if (res && res.content && res.content.length) {
    form.value = res.content[0]
    immigrantWillProductionList.value = []

    immigrantWillProductionList.value = res.content[0].immigrantWillProductionList
  }
}
const demographicList = async () => {
  const params = {
    doorNo: props.doorNo,
    status: 'review'
  }
  const res = await getDemographicListApi(params)
  form.value.countryNum = res.content.filter((item: any) => item.censusType == 1).length
  form.value.unCountryNum = res.content.filter((item: any) => item.censusType != 1).length
  form.value.familyNum = res.content.length
}
onMounted(async () => {
  await getResettlementConfig()
  await getResettlement()
  console.log(props.baseInfo, '主体信息数据')
  // form.value.familyNum = props.baseInfo.familyNum
  await demographicList()
})
// 搬迁安置方式

const emit = defineEmits(['refresh'])

// 获取意愿信息

const onSave = () => {
  const result = unref(form)
  const data: ResettlementDtoType = {
    ...result,
    doorNo: props.doorNo,
    householdId: +props.householdId,
    immigrantWillProductionList: immigrantWillProductionList.value
  }

  console.log(data)

  data.familyNum = parseInt(data.familyNum as string)
  data.countryNum = parseInt(data.countryNum as string)
  data.unCountryNum = parseInt(data.unCountryNum as string)
  if (data.familyNum !== data.countryNum + data.unCountryNum) {
    return ElMessage.error('家庭人数数据有误')
  }
  // if (!data.productionType) {
  //   return ElMessage.error('请选择生产安置方式')
  // }
  if (!data.removalType) {
    return ElMessage.error('请选择搬迁安置方式')
  }
  console.log(data)

  saveResettlementListApi(data).then(() => {
    ElMessage.success('操作成功！')
    emit('refresh')
  })
}
</script>

<style lang="less" scoped>
.desire {
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;

  .desire-item {
    padding-bottom: 8px;
  }

  .common-title {
    display: flex;
    height: 32px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    color: #131313;
    background: #f6f6f6;
    border: 1px solid #ebebeb;
    border-radius: 4px 4px 0px 0px;
    align-items: center;

    .line {
      width: 4px;
      height: 16px;
      margin-right: 8px;
      background: linear-gradient(90deg, var(--el-color-primary) 0%, #ffffff 100%);
      border-radius: 3px;
    }
  }

  .common-cont {
    padding: 16px 28px 0;
  }

  .family {
    display: flex;
    align-items: center;
    padding-bottom: 16px;

    .family-item {
      display: flex;
      margin-right: 40px;
      white-space: nowrap;
      align-items: center;

      &:last-child {
        margin-right: 0;
      }

      .tit {
        margin-right: 10px;
        font-size: 14px;
        color: #171718;
      }
    }
  }

  .radio-item {
    display: flex;
    padding-bottom: 16px;
    font-size: 14px;
    color: #171718;
    align-items: center;
  }
}

.scaz {
  display: flex;
  flex-flow: row wrap;

  .common-item {
    // flex-flow: row wrap;
    // width: 30%;
    display: flex;
    margin: 10px 40px 10px 0;
    align-items: center;

    .tit {
      margin-right: 10px;
      font-size: 14px;
      color: #171718;
      white-space: nowrap;
    }
  }
}
</style>
