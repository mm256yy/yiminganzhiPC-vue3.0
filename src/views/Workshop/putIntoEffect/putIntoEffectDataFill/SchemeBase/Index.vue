<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="!pt-40px">
        <ElForm
          class="form-block"
          ref="formRef"
          :model="form"
          label-width="156px"
          :label-position="'left'"
        >
          <div class="titleBox">
            <span class="text">新建方案</span>
          </div>
          <div class="form-item-block">
            <ElFormItem label="安置房人数：" prop="peopleNum">
              <ElInput v-model.number="form.peopleNum" class="!w-150px" placeholder="输入"
                ><template #append>人</template></ElInput
              >
            </ElFormItem>
            <ElFormItem label="户型类型：" prop="houseAreaType">
              <ElRadioGroup v-model="form.houseAreaType">
                <ElRadio v-for="item in dictObj[318]" :key="item.value" :label="`${item.value}`"
                  >{{ item.label }} {{ isNaN(Number(item.label)) ? '' : '㎡' }}</ElRadio
                >
              </ElRadioGroup>
            </ElFormItem>
            <ElFormItem label="安置房面积：" prop="houseArea">
              <ElInput v-model="form.houseArea" class="!w-150px" placeholder="输入"
                ><template #append>㎡</template></ElInput
              >
            </ElFormItem>
          </div>
          <div class="line"></div>
          <ElFormItem label="住宅类型：">
            <ElRadioGroup v-model="form.houseType">
              <ElRadio :label="1">联排</ElRadio>
              <ElRadio :label="2">公寓</ElRadio>
              <ElRadio :label="3">一次性货币补偿</ElRadio>
            </ElRadioGroup>
          </ElFormItem>
          <div class="line"></div>
          <!-- 一次性货币补偿 -->
          <div class="line-block" v-if="form.houseType === 3">
            <ElFormItem label="一次性货币补偿：" prop="accountName">
              面积
              <ElInput v-model="form.houseArea" class="!w-250px __txt" placeholder="请输入"
                ><template #append>㎡</template></ElInput
              >
              x 房屋单价
              <ElInput v-model="form.housePrice" class="!w-250px __txt" placeholder="请输入"
                ><template #append>元</template></ElInput
              >
              = 结算金额
              {{ disposeMoney }}（元）
            </ElFormItem>
          </div>
          <!-- 联排 -->
          <div class="line-block" v-if="form.houseType === 1">
            <ElFormItem v-show="labelName" :label="`${labelName}:`" prop="accountName">
              安置房面积({{ form.houseArea }}) x 房屋单价
              <ElInput v-model="form.housePrice" class="!w-250px __txt" placeholder="请输入"
                ><template #append>元</template></ElInput
              >
              = 结算金额{{ tandemMoney }}（元）
            </ElFormItem>
            <div v-show="labelName" class="line"></div>
            <div class="form-item-block">
              <ElFormItem label="联排少于拆迁房面积：" prop="subsidyArea">
                {{ subsidyArea }}
              </ElFormItem>
              <ElFormItem label="联排少于拆迁房补贴：" prop="subsidy">
                <ElInput v-model="form.subsidy" class="!w-150px" placeholder="请输入"
                  ><template #append>元</template></ElInput
                >
              </ElFormItem>
              <ElFormItem label="" prop="accountName" />
            </div>
          </div>
          <!-- 公寓 -->
          <div class="line-block" v-if="form.houseType === 2">
            <ElFormItem label="公寓房面积：" prop="accountName">
              <ElCheckboxGroup v-model="apartmentArea">
                <ElCheckbox label="75">
                  <div class="check-block">
                    <span>75㎡</span
                    ><ElInput v-model.number="form.typeOneNum" class="!w-150px" placeholder="请输入"
                      ><template #append>间</template></ElInput
                    >
                  </div>
                </ElCheckbox>
                <ElCheckbox label="95">
                  <div class="check-block">
                    <span>95㎡</span>
                    <ElInput v-model.number="form.typeTwoNum" class="!w-150px" placeholder="请输入"
                      ><template #append>间</template></ElInput
                    >
                  </div>
                </ElCheckbox>
                <ElCheckbox label="115">
                  <div class="check-block">
                    <span>115㎡</span>
                    <ElInput
                      v-model.number="form.typeThreeNum"
                      class="!w-150px"
                      placeholder="请输入"
                      ><template #append>间</template></ElInput
                    >
                  </div>
                </ElCheckbox>
                <ElCheckbox label="135">
                  <div class="check-block">
                    <span>135㎡</span>
                    <ElInput v-model.number="form.typeFourNum" class="!w-150px" placeholder="请输入"
                      ><template #append>间</template></ElInput
                    >
                  </div>
                </ElCheckbox>
              </ElCheckboxGroup>
            </ElFormItem>
            <div class="line"></div>
            <div class="form-item-block line-block">
              <ElFormItem label="公寓超出联排设计建筑面积标准："> {{ exceedArea }}㎡ </ElFormItem>
              <ElFormItem label="公寓房建筑面积合计："> {{ totalArea }}㎡ </ElFormItem>
              <ElFormItem label="公寓房总价："> {{ gyTotalPrice }}元 </ElFormItem>
            </div>
            <div v-for="(items, indexs) in apartmentAreaList" :key="indexs">
              <ElFormItem :label="`${items.props}㎡公寓房价格：`">
                数量{{ form[items.num] }} x {{ items.props }} x 房屋单价
                <ElInput v-model="form[items.price]" class="!w-250px __txt" placeholder="请输入"
                  ><template #append>元</template></ElInput
                >
                = 结算金额{{
                  isNaN(form[items.num] * form[items.price])
                    ? 0
                    : Number(form[items.num] * form[items.price] * items.props).toFixed(2)
                }}（元）
              </ElFormItem>
              <div class="line"></div>
            </div>
            <div class="form-item-block">
              <ElFormItem label="公寓少于拆迁房面积："> {{ lessArea }}㎡ </ElFormItem>
              <ElFormItem label="公寓少于拆迁房补贴：">
                <ElInput v-model="form.subsidy" class="!w-250px __txt" placeholder="请输入"
                  ><template #append>元</template></ElInput
                ></ElFormItem
              >
              <ElFormItem label="" />
            </div>
            <div class="line"></div>
            <div class="line-block no-border">
              <ElFormItem label="公寓超出联排设计建筑面积标准差价：">
                {{ exceedArea }} x 房屋单价
                <ElInput v-model="form.houseSinglePrice" class="!w-250px __txt" placeholder="请输入"
                  ><template #append>元</template></ElInput
                >
                = 结算金额 {{ priceDifference }}（元）
              </ElFormItem>
            </div>
          </div>
          <div class="form-item-block">
            <ElFormItem label="拆迁房屋建筑面积：">
              {{ form.demolitionHouseArea }}
            </ElFormItem>
            <ElFormItem label="拆迁房屋赔偿金额：">{{ form.demolitionHouseAmount }} </ElFormItem>
            <ElFormItem label="拆迁房其他补偿金额：">
              {{ form.demolitionHouseOtherAmount }}
            </ElFormItem>
            <ElFormItem label="拆迁房屋补偿总金额：" prop="totalPrice">{{ totalPrice }}</ElFormItem>
          </div>
          <div class="line"></div>
          <div class="flex items-center justify-center pb-12px">
            <ElSpace>
              <ElButton @click="handleClickReset">重置条件</ElButton>
              <ElButton type="primary" @click="handleClickSave('save')">生成方案</ElButton>
            </ElSpace>
          </div>
        </ElForm>
      </div>
      <div class="lookscheme-wrap">
        <div class="titleBox">
          <span class="text">查看方案</span>
        </div>
        <div class="lookscheme-main">
          <div class="table">
            <div class="table-item" v-for="(item, index) in listData" :key="index">
              <div v-if="item && item.tableList">
                <div
                  class="tableitem-title"
                  :class="
                    item.tableList[3].name === '联排'
                      ? 'title-1'
                      : item.tableList[3].name === '公寓'
                      ? 'title-2'
                      : 'title-3'
                  "
                >
                  方案{{
                    item.tableList[3].name === '联排'
                      ? '一'
                      : item.tableList[3].name === '公寓'
                      ? '二'
                      : '三'
                  }}
                </div>
              </div>
              <div v-if="item && item.tableList">
                <div class="tableitem-body" v-for="(items, indexs) in item.tableList" :key="indexs">
                  <div class="label">{{ items.label }}</div>
                  <div class="value">{{ items.name ? items.name : items.value }}</div>
                </div>
              </div>
              <div class="flex items-center justify-bett pb-12px" v-if="item.isSelect">
                <ElButton class="tabel-btn">已选择该方案</ElButton>
              </div>
              <div class="flex items-center space-between pb-12px" v-else>
                <ElButton
                  class="tabel-btn"
                  @click="handleClickDel(item.tableList[3].value, item.wid)"
                  >删除</ElButton
                >
                <ElButton
                  class="tabel-btn"
                  type="primary"
                  @click="selectSchemebase(item.tableList[3].value, item)"
                  >选择该方案</ElButton
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { computed, watch, ref, reactive } from 'vue'
import {
  ElSpace,
  ElInput,
  ElFormItem,
  ElForm,
  ElButton,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElMessageBox,
  ElMessage,
  ElRadioGroup
} from 'element-plus'

import {
  getSchemeBaseDetailApi,
  addSchemeBaseApi,
  getSchemeBaseInfoApi
} from '@/api/putIntoEffect/schemeBase/service'
import { useDictStoreWithOut } from '@/store/modules/dict'
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
let labelName = ref<string>('')
const defaultSchemeOne = [
  {
    label: '安置房人数（人）',
    props: 'peopleNum',
    value: ''
  },
  {
    label: '户型类型',
    props: 'houseAreaType',
    value: '',
    name: ''
  },
  {
    label: '安置房屋面积（㎡）',
    props: 'houseArea',
    value: ''
  },
  {
    label: '住宅类型',
    props: 'houseType',
    value: null,
    name: ''
  },
  {
    label: `${labelName.value}户型价格（元）`,
    props: 'tandemMoney',
    value: ''
  },
  {
    label: '联排少于拆迁房面积（㎡）',
    props: 'subsidyArea',
    value: ''
  },
  {
    label: '联排少于拆迁房补贴（元）',
    props: 'subsidy',
    value: ''
  },
  {
    label: '拆迁房屋建筑面积（㎡）',
    props: 'demolitionHouseArea',
    value: ''
  },
  {
    label: '拆迁房屋赔偿金额（元）',
    props: 'demolitionHouseAmount',
    value: ''
  },
  {
    label: '拆迁房屋其他补偿金额（元）',
    props: 'demolitionHouseOtherAmount',
    value: ''
  },
  {
    label: '拆迁房屋补偿总金额（元）',
    props: 'totalPrice',
    value: ''
  }
]
const defaultSchemeTwo = [
  {
    label: '安置房人数（人）',
    props: 'peopleNum',
    value: ''
  },
  {
    label: '户型类型',
    props: 'houseAreaType',
    value: ''
  },
  {
    label: '安置房屋面积（㎡）',
    props: 'houseArea',
    value: ''
  },
  {
    label: '住宅类型',
    props: 'houseType',
    value: ''
  },
  {
    label: '公寓房建筑面积合计（㎡）',
    props: 'totalArea',
    value: ''
  },
  {
    label: '公寓房总价（元）',
    props: 'gyTotalPrice',
    value: ''
  },
  {
    label: '公寓少于拆迁房面积（㎡）',
    props: 'lessArea',
    value: ''
  },
  {
    label: '公寓少于拆迁房补贴（元）',
    props: 'subsidy',
    value: ''
  },
  {
    label: '公寓超出拆迁房面积（㎡）',
    props: 'exceedArea',
    value: ''
  },
  {
    label: '公寓超出拆迁房差价（元）',
    props: 'priceDifference',
    value: ''
  },
  {
    label: '拆迁房屋建筑面积（㎡）',
    props: 'demolitionHouseArea',
    value: ''
  },
  {
    label: '拆迁房屋赔偿金额（元）',
    props: 'demolitionHouseAmount',
    value: ''
  },
  {
    label: '拆迁房屋其他补偿金额（元）',
    props: 'demolitionHouseOtherAmount',
    value: ''
  },
  {
    label: '拆迁房屋补偿总金额（元）',
    props: 'totalPrice',
    value: ''
  }
]
const defaultSchemeThree = [
  {
    label: '安置房人数（人）',
    props: 'peopleNum',
    value: ''
  },
  {
    label: '户型类型',
    props: 'houseAreaType',
    value: ''
  },
  {
    label: '安置房屋面积（㎡）',
    props: 'houseArea',
    value: ''
  },
  {
    label: '住宅类型',
    props: 'houseType',
    value: ''
  },
  {
    label: '一次性货币补偿（元）',
    props: 'disposeMoney',
    isCalculate: true,
    value: ''
  },
  {
    label: '拆迁房屋建筑面积（㎡）',
    props: 'demolitionHouseArea',
    value: ''
  },
  {
    label: '拆迁房屋赔偿金额（元）',
    props: 'demolitionHouseAmount',
    value: ''
  },
  {
    label: '拆迁房屋其他补偿金额（元）',
    props: 'demolitionHouseOtherAmount',
    value: ''
  },
  {
    label: '拆迁房屋补偿总金额（元）',
    props: 'totalPrice',
    value: ''
  }
]
let listData = ref<any>([])
let detailInfo = reactive({})
let selectId = ref<number>(0)
const getDetail = async () => {
  const res = await getSchemeBaseDetailApi(props.doorNo)
  if (res?.id) {
    selectId.value = res.id
    form.value = Object.assign({}, form.value, res, { isSelect: true })
    await getDetailInfo()
    await handleClickSave('detail')
    form.value = Object.assign({}, defaultValue, detailInfo)
  } else {
    await getDetailInfo()
  }
}
const getDetailInfo = async () => {
  const res = await getSchemeBaseInfoApi(props.doorNo)
  if (res) {
    const { demolitionHouseArea, demolitionHouseAmount, demolitionHouseOtherAmount } = res
    form.value.demolitionHouseArea = demolitionHouseArea
    form.value.demolitionHouseAmount = demolitionHouseAmount
    form.value.demolitionHouseOtherAmount = demolitionHouseOtherAmount
    detailInfo = res
  }
}

let disposeMoney = computed(() => {
  return dataCalculate(['houseArea', 'housePrice'], '*')
})
let tandemMoney = computed(() => {
  return dataCalculate(['houseArea', 'housePrice'], '*')
})
const totalPrice = computed(() => {
  if (form.value.houseType === 3) {
    return (
      dataCalculate(['demolitionHouseAmount', 'demolitionHouseOtherAmount'], '+') +
      disposeMoney.value
    ).toFixed(2)
  } else {
    return dataCalculate(['demolitionHouseAmount', 'demolitionHouseOtherAmount', 'subsidy'], '+')
  }
})
let apartmentAreaList = ref<any>([])
const exceedArea = computed(() => {
  const tempExceedArea = Number(totalArea.value || 0) - Number(form.value.houseArea || 0)
  return tempExceedArea > 0 ? tempExceedArea.toFixed(2) : 0
})
const lessArea = computed(() => {
  const tempExceedArea = Number(form.value.demolitionHouseArea || 0) - Number(totalArea.value || 0)

  return tempExceedArea > 0 ? tempExceedArea.toFixed(2) : 0
})
const apartmentArea = ref([])
const apartmentAreaListDefault = [
  {
    num: 'typeOneNum',
    price: 'typeOnePrice',
    props: 75
  },
  {
    num: 'typeTwoNum',
    price: 'typeTwoPrice',
    props: 95
  },
  {
    num: 'typeThreeNum',
    price: 'typeThreePrice',
    props: 115
  },
  {
    num: 'typeFourNum',
    price: 'typeFourPrice',
    props: 135
  }
]
watch(apartmentArea, (val) => {
  apartmentAreaList.value.length = 0
  const list = [...apartmentAreaListDefault]
  val.forEach((item) => {
    list.forEach((items) => {
      if (item == items.props) {
        apartmentAreaList.value.push(items)
      }
    })
  })
})

const dataCalculate = (operArr: any, oper: string) => {
  return Number(
    operArr
      .reduce(
        (pre, item) => {
          if (oper === '+') {
            return (pre || 0) + (Number(form.value[item]) || 0)
          } else if (oper === '*') {
            return pre * (Number(form.value[item]) || 0)
          }
        },
        oper === '*' ? 1 : 0
      )
      .toFixed(2)
  )
}
getDetail()
const handleClickDel = (type: number, wid: number) => {
  const version = type === 1 ? '一' : type === 2 ? '二' : '三'
  ElMessageBox.confirm(`删除第${version}种方案`, '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      listData.value = listData.value.filter((item) => item.wid !== wid)
      listData.value.forEach((item, index) => {
        item.wid = index + 1
      })
    })
    .catch(() => {})
}
const selectSchemebase = (type: number, row: any) => {
  const version = type === 1 ? '一' : type === 2 ? '二' : '三'
  ElMessageBox.confirm(`是否选择方案${version}`, '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  })
    .then(() => {
      const { projectId, status, id: householdId } = props.baseInfo
      let data = {
        houseArea: 0,
        housePrice: 0,
        subsidy: 0,
        typeOnePrice: 0,
        typeTwoPrice: 0,
        typeThreePrice: 0,
        typeFourPrice: 0,
        demolitionHouseArea: 0
      }
      row.tableList.map((item) => {
        data[item.props] = item.value
      })
      let params = {
        projectId,
        status,
        householdId,
        doorNo: props.doorNo,
        ...data,
        houseArea: data.houseArea ? Number(data.houseArea) : 0,
        housePrice: data.housePrice ? Number(data.housePrice) : 0,
        subsidy: Number(data.subsidy),
        typeOnePrice: data.typeOnePrice ? Number(data.typeOnePrice) : 0,
        typeTwoPrice: data.typeTwoPrice ? Number(data.typeTwoPrice) : 0,
        typeThreePrice: data.typeThreePrice ? Number(data.typeThreePrice) : 0,
        typeFourPrice: data.typeFourPrice ? Number(data.typeFourPrice) : 0,
        demolitionArea: data.demolitionHouseArea
      }
      for (const i in params) {
        if (!params[i] && params[i] !== 0) {
          delete params[i]
        }
      }
      addSchemeBaseApi(params).then(() => {
        ElMessage.success('方案选择成功！')
        getDetail()
        const listDataIndex = listData.value.findIndex(
          (item) => item.isSelect && row.wid !== item.wid
        )
        listData.value[listDataIndex].isSelect = false
        listData.value = listData.value.filter((items) => row.wid !== items.wid)
        listData.value.forEach((item, index) => {
          item.wid = index + 1
        })
      })
    })
    .catch((e) => {
      console.log(e)
    })
}
const defaultValue = {
  peopleNum: null,
  houseAreaType: null,
  houseArea: null,
  houseType: 1,
  typeOneNum: null,
  typeTwoNum: null,
  typeThreeNum: null,
  typeFourNum: null,
  housePrice: null,
  subsidy: null,
  demolitionArea: null,
  typeOnePrice: null,
  typeTwoPrice: null,
  typeThreePrice: null,
  typeFourPrice: null,
  apartmentArea: null,
  typePrice: 0,
  demolitionHouseArea: null,
  demolitionHouseAmount: null,
  demolitionHouseOtherAmount: null,
  houseSinglePrice: null,
  isSelect: false
}
let form = ref({ ...defaultValue })
const subsidyArea = computed(() => {
  const tempSubsidyArea = (
    (form.value.demolitionHouseArea || 0) - Number(form.value.houseArea)
  ).toFixed(2)
  return Number(tempSubsidyArea) > 0 ? tempSubsidyArea : 0
})
const priceDifference = computed(() => {
  const tempDifference = Number(exceedArea.value || 0) * Number(form.value.houseSinglePrice || 0)
  return tempDifference.toFixed(2)
})
// 公寓房建筑面积合计与公寓房总价
const totalArea = ref(0)
const gyTotalPrice = ref(0)
watch(
  [
    apartmentAreaList,
    () => form.value.typeOneNum,
    () => form.value.typeTwoNum,
    () => form.value.typeThreeNum,
    () => form.value.typeFourNum,
    () => form.value.typeOnePrice,
    () => form.value.typeTwoPrice,
    () => form.value.typeThreePrice,
    () => form.value.typeFourPrice
  ],
  () => {
    let tempTotalArea = 0
    let tempgyTotalArea = 0
    apartmentAreaList.value?.forEach((item) => {
      tempTotalArea += Number(form.value[item.num] || 0) * item.props
      tempgyTotalArea +=
        Number(form.value[item.num] || 0) * item.props * Number(form.value[item.price] || 0)
    })
    totalArea.value = tempTotalArea ? Number(tempTotalArea.toFixed(2)) : 0
    gyTotalPrice.value = tempgyTotalArea ? Number(tempgyTotalArea.toFixed(2)) : 0
  }
)
watch(
  () => form.value.houseAreaType,
  (val) => {
    const tempVal = dictObj.value[318].find((item) => item.value == val)?.label
    labelName.value = val ? tempVal + (isNaN(Number(tempVal)) ? '价格' : '㎡价格') : ''
  }
)
interface SchemeType {
  label: string
  props?: string
  value: any
  name?: string
}
const handleClickReset = () => {
  apartmentArea.value = []
  apartmentAreaList.value.length = []
  form.value = { ...defaultValue, ...detailInfo }
}
const handleClickSave = (type) => {
  const tempData = {
    disposeMoney,
    totalPrice,
    tandemMoney,
    totalArea,
    gyTotalPrice,
    lessArea,
    exceedArea,
    priceDifference,
    subsidyArea
  }
  form.value = Object.assign({}, form.value, tempData, detailInfo)
  const schemeModel =
    form.value.houseType === 1
      ? defaultSchemeOne
      : form.value.houseType === 2
      ? defaultSchemeTwo
      : defaultSchemeThree
  const list = schemeModel.map((item: SchemeType) => {
    for (let i in form.value) {
      if (i === item?.props) {
        item.value = form.value[i]
      }
    }
    if (item?.props === 'houseType') {
      item.name =
        form.value.houseType === 1 ? '联排' : form.value.houseType === 2 ? '公寓' : '一次性货币补偿'
    }
    if (item?.props === 'houseAreaType') {
      const tempHouseAreaVal = dictObj.value[318].find(
        (item) => item.value == form.value.houseAreaType
      )?.label
      item.name = tempHouseAreaVal
        ? isNaN(Number(tempHouseAreaVal))
          ? tempHouseAreaVal
          : tempHouseAreaVal + '㎡'
        : ''
    }
    return item
  })
  let temApartmentAreaList = apartmentAreaList.value?.length > 0 ? [...apartmentAreaList.value] : []
  if (type === 'detail') {
    temApartmentAreaList = [...apartmentAreaListDefault]
  }
  temApartmentAreaList?.forEach((item, index) => {
    if (form.value[item.num] && form.value[item.price]) {
      const insetTableGyNum = {
        label: item.props + '㎡公寓房(间)',
        props: item.num,
        value: form.value[item.num]
      }
      const insetTableGyPrice = {
        label: item.props + '㎡公寓价格(元)',
        props: item.price,
        value: form.value[item.price]
      }
      list.splice(4 + index, 0, insetTableGyNum, insetTableGyPrice)
    }
  })
  listData.value.unshift({
    tableList: [...list],
    wid: listData.value.length + 1,
    isSelect: form.value.isSelect
  })
  handleClickReset()
}
</script>
<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding-right: 60px;
  padding-left: 60px;
}

.form-block {
  width: 100%;
}

.main {
  padding: 14px 16px;
}

:deep(.el-form-item) {
  padding: 0 10px;

  .el-form-item__content {
    align-items: flex-start;
  }
}

.titleBox {
  height: 32px;
  padding-left: 15px;
  margin: 0px 0 16px;
  line-height: 32px;
  background: #f5f7fa;
  box-shadow: 0px 1px 0px 0px rgba(235, 235, 235, 1);

  .text {
    padding-left: 15px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-size: 17px;
    font-weight: 600;
    color: #171718;

    border-left: 4px solid rgba(62, 115, 236, 1) !important;
  }
}

.form-item-block {
  display: flex;
  justify-content: space-between;
}

.__txt {
  margin-right: 10px;
  margin-left: 10px;
}

.line {
  height: 20px;
  border-top: 1px dashed #ebebeb;
}

.line-block {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px dashed #ebebeb;
}

.check-block {
  display: flex;
  align-items: center;

  span {
    padding-right: 10px;
  }
}

.lookscheme-main {
  .table {
    display: flex;
    overflow-x: auto;
  }

  .table-item {
    width: 400px;
    padding-top: 16px;
    margin-right: 16px;
    margin-bottom: 16px;
    background: #f5f7fa;
    flex-basis: 400px;
    flex-shrink: 0;

    .tableitem-title {
      width: 368px;
      height: 40px;
      margin: 0 auto;
      font-weight: bold;
      line-height: 40px;
      color: #ffffff;
      text-align: center;
      border-radius: 4px 4px 0px 0px;
    }

    .title-1 {
      background: #3e73ec !important;
    }

    .title-2 {
      background: #fec44c !important;
    }

    .title-3 {
      background: #30a952 !important;
    }

    .tableitem-body {
      display: flex;
      width: 368px;
      margin: 0 auto;
      font-size: 14px;
      background: #fff;

      div {
        flex: 1;
        height: 40px;
        padding-left: 16px;
        line-height: 40px;
        border-bottom: 1px solid #ebebeb;
      }

      .label {
        flex-basis: 68px;
        border-right: 1px solid #ebebeb;
      }
    }

    .tableitem-body:last-of-type {
      padding-bottom: 0;
      margin-bottom: 16px;
    }

    .table-item-add {
      margin-top: 20%;
      margin-left: 48%;
      color: #131313;
    }

    .tabel-btn {
      height: 32px;
      margin: 0 16px;
      line-height: 32px;
      text-align: center;
      border-radius: 4px;
      flex: 1;
    }
  }
}

.lookscheme-main::-webkit-scrollbar {
  width: 4px;
}

.lookscheme-main::-webkit-scrollbar-thumb {
  background: red;
  border-radius: 10px;
  opacity: 0.2;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

.lookscheme-main::-webkit-scrollbar-track {
  background: blue;
  border-radius: 0;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

.no-border {
  border-bottom: none;
}
</style>
