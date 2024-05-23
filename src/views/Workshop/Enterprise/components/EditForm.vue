<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑企业' : actionType === 'add' ? '新增企业' : '查看详情'"
    :model-value="props.show"
    :width="609"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      :disabled="actionType === 'view'"
      class="form"
      ref="formRef"
      :model="form"
      label-width="120px"
      :label-position="'right'"
      :rules="rules"
    >
      <!-- <ElFormItem label="企业编码" prop="doorNo">
        <ElInput
          v-model="form.doorNo"
          :disabled="actionType === 'edit'"
          class="!w-350px"
          placeholder="请输入企业编码"
        />
      </ElFormItem> -->
      <ElFormItem label="企业名称" prop="name">
        <ElInput v-model="form.name" class="!w-350px" placeholder="请输入企业名称" />
      </ElFormItem>
      <ElFormItem label="所属区域" prop="parentCode" required>
        <ElCascader
          class="!w-350px"
          v-model="form.parentCode"
          :options="districtTree"
          :props="treeSelectDefaultProps"
          expandTrigger="hover"
        />
      </ElFormItem>

      <ElFormItem label="所在位置" prop="locationType">
        <ElSelect class="w-350px" v-model="form.locationType">
          <ElOption
            v-for="item in dictObj[326]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <!-- <ElFormItem label="企业联系方式" prop="phone">
        <ElInput
          clearable
          placeholder="请输入企业联系方式"
          type="text"
          class="!w-350px"
          v-model="form.phone"
        />
      </ElFormItem> -->
      <ElFormItem label="" prop="householderName" align="center" header-align="center">
        <el-select
          v-model="form.householderName"
          filterable
          remote
          reserve-keyword
          placeholder="请输入居民户姓名"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="doorTypeChange"
        >
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.name" />
        </el-select>
      </ElFormItem>
      <ElFormItem label="关联户号" prop="householderDoorNo" align="center" header-align="center">
        <ElInput type="text" v-model="form.householderDoorNo" disabled />
      </ElFormItem>
      <!-- <ElFormI tem label="关联居民户" prop="householderDoorNo">
        <ElInput
          clearable
          placeholder="请输入企业联系方式"
          type="text"
          class="!w-350px"
          v-model="form.householderDoorNo"
        />
      </ElFormItem> -->
      <ElFormItem label="高程" prop="altitude">
        <ElInput
          clearable
          filterable
          placeholder="请输入高程"
          type="number"
          class="!w-350px"
          v-model="form.altitude"
        />
      </ElFormItem>

      <ElFormItem label="淹没范围" prop="inundationRange" v-if="false">
        <ElSelect class="!w-350px" clearable v-model="form.inundationRange">
          <ElOption
            v-for="item in dictObj[346]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <div class="w-466px">
        <MapFormItem :required="false" :positon="position" @change="onChosePosition" />
      </div>
    </ElForm>

    <VillageEditForm
      :district-tree="districtTree"
      :show="villageDialog"
      :row="null"
      :hideMap="true"
      action-type="add"
      @close="onVillageDialogClose"
    />

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)" :loading="btnLoading">确认</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  FormInstance,
  FormRules,
  ElOption,
  ElSelect,
  ElMessage,
  ElCascader
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { addLandlordApi, updateLandlordApi } from '@/api/workshop/landlord/service'
import type { LandlordDtoType } from '@/api/workshop/landlord/types'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getDistrictTreeApi } from '@/api/district'
import VillageEditForm from '@/views/Workshop/Village/components/EditForm.vue'
import { getLandlordListApi } from '@/api/workshop/landlord/service'
import { MapFormItem } from '@/components/Map'
import { getHouseListApi } from '@/api/workshop/datafill/house-service'

interface PropsType {
  show: any
  actionType: 'add' | 'edit' | 'view'
  row?: LandlordDtoType | null | undefined
  name?: string
  doorNo?: string
  longitude?: any
  latitude?: any
  address?: any
}
const dictStore = useDictStoreWithOut()
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])
const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const loading = ref(false)
const options = ref<any[]>([])

const dictObj = computed(() => dictStore.getDictObj)
const treeSelectDefaultProps = {
  value: 'code',
  label: 'name'
}
const flag = ref<any>(false)
const btnLoading = ref(false)
const defaultValue: Omit<LandlordDtoType, 'id'> = {
  address: '',
  latitude: 0,
  longitude: 0,
  name: '',
  parentCode: [],
  locationType: 'SubmergedArea',
  householderName: ''
  // showHouseholderDoorNo: ''
}
const form = ref<Omit<LandlordDtoType, 'id'>>(defaultValue)
const position: {
  latitude: any
  longitude: any
  address?: string
} = reactive({
  latitude: 0,
  longitude: 0
})

watch(
  () => props.row,
  (val) => {
    if (val) {
      // 处理行政区划
      form.value = {
        ...val,
        parentCode: [val.areaCode, val.townCode, val.villageCode]
      }
      console.log(form.value, '测试监听的数据')
      position.longitude = form.value.longitude
      position.latitude = form.value.latitude
      position.address = form.value.address
      form.value.householderName ? (flag.value = true) : (flag.value = false)
    } else {
      form.value = defaultValue
    }
  },
  {
    immediate: true,
    deep: true
  }
)

watch(
  () => props.show,
  (val) => {
    if (val) {
      // console.log(props.row, '表格编辑的数据')
      // form.value = {
      //   ...props.row,
      //   parentCode: [props.row.areaCode, props.row.townCode, props.row.villageCode]
      // }
      // console.log(form.value, '测试监听的数据')
      // position.longitude = form.value.longitude
      // position.latitude = form.value.latitude
      // position.address = form.value.address
      // form.value.householderName ? (flag.value = true) : (flag.value = false)

      form.value.householderName = props.name
      form.value.householderDoorNo = props.doorNo
      if (props.longitude && props.latitude) {
        position.latitude = props.latitude
        position.longitude = props.longitude
        position.address = props.address
      }
    } else {
      form.value = defaultValue
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 规则校验
const rules = reactive<FormRules>({
  name: [required()],
  // doorNo: [required()],
  parentCode: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  position.latitude = 0
  position.longitude = 0
  position.address = ''
  sessionStorage.setItem('isDefaultOpen', '0')
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

// 定位
const onChosePosition = (ps) => {
  position.latitude = ps.latitude
  position.longitude = ps.longitude
  position.address = ps.address
}

const doorTypeChange = (val) => {
  console.log(options.value, val, '测试数据下拉')
  options.value.forEach((item) => {
    if (item.name == val) {
      form.value.householderDoorNo = item.doorNo
      // form.value.householderDoorNo = item.doorNo
      // tableData.value.forEach((item2) => {
      //   if (item2.registrantName == item.name) {
      //     item2.registrantId = item.id
      //     item2.registrantDoorNo = item.doorNo
      //   }
      // })
      if (flag.value) {
        getHouseListApi({
          doorNo: item.doorNo,
          status: 'review',
          size: 50,
          page: 0
        }).then((res) => {
          const houseList = res.content.reduce(function (prev, current) {
            return prev.id < current.id ? prev : current
          })
          console.log(houseList, '房屋列表数据')
          position.latitude = houseList.latitude
          position.longitude = houseList.longitude
          position.address = houseList.address
          console.log(position.latitude, position.longitude, position.address, '地址')
        })
      }
    }
  })
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      btnLoading.value = true
      form.value.householderDoorNo = 'jl' + form.value.householderDoorNo
      const data: any = {
        ...form.value,
        id: form.value.id,
        name: form.value.name,
        phone: form.value.phone,
        locationType: form.value.locationType,
        type: 'Company',
        areaCode: form.value.parentCode[0],
        townCode: form.value.parentCode[1],
        villageCode: form.value.parentCode[2],
        virutalVillageCode: form.value.parentCode[3] || '',
        latitude: position.latitude,
        longitude: position.longitude
      }

      delete data.parentCode

      submit(data)
    } else {
      btnLoading.value = false
      return false
    }
  })
}, 600)

const submit = async (data: LandlordDtoType) => {
  if (props.actionType === 'add') {
    await addLandlordApi({
      ...data,
      projectId
    })
  } else {
    await updateLandlordApi({
      ...data,
      projectId
    })
  }
  btnLoading.value = false
  ElMessage.success('操作成功！')
  onClose(true)
}

const districtTree = ref([])
const villageDialog = ref(false)

const getDistrictTree = async () => {
  const list = await getDistrictTreeApi(projectId)
  districtTree.value = list || []
}

getDistrictTree()
const onVillageDialogClose = (flag?: boolean) => {
  villageDialog.value = false
  if (flag) {
    emit('updateDistrict')
  }
}

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    getLandlordListApi({ name: query, type: 'PeasantHousehold' }).then((res) => {
      loading.value = false
      options.value = res.content
    })
    // setTimeout(() => {
    //   loading.value = false
    //   options.value = list.value.filter((item: any) => {
    //     return item.label.toLowerCase().includes(query.toLowerCase())
    //   })
    // }, 200)
  } else {
    options.value = []
  }
}
</script>

<style lang="less">
.form {
  .el-upload-dragger {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .el-input__wrapper {
    width: 100%;
  }
}
</style>
