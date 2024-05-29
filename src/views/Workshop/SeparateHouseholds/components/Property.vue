<template>
  <WorkContentWrap>
    <div class="search-form-wrap"> </div>
    <div class="search-form-wrap">
      <ElForm
        class="form"
        ref="formRef"
        :model="searchForm"
        label-width="160px"
        :label-position="'right'"
      >
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="选择房屋权属农户:" prop="blurry">
              <el-select
                v-model="blurry"
                filterable
                remote
                reserve-keyword
                placeholder="请输入户号/户主名称"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="doorTypeChange"
                style="width: 400px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.blurry"
                  :value="item.name"
                />
              </el-select>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="选择房屋:" prop="house">
              <ElSelect
                clearable
                filterable
                v-model="house"
                class="!w-full"
                placeholder="请选择房屋"
                @change="houseType"
              >
                <ElOption
                  v-for="item in houseLists"
                  :key="item.houseNo"
                  :label="item.houseNo"
                  :value="item.houseNo"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <div>
              <ElButton type="primary" @click="onSearch">
                <Icon icon="ep:search" class="mr-5px" /> 查询
              </ElButton>
              <ElButton @click="setSearchParams">
                <Icon icon="ep:refresh-right" class="mr-5px" /> 重置
              </ElButton>
            </div>
          </ElCol>
        </ElRow>
      </ElForm>
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div style="color: red">
          当前拆分房屋{{ house ? house : '-' }}幢（建筑面积{{
            oldHouseValues ? oldHouseValues?.landArea : '-'
          }}㎡，合法面积{{ oldHouseValues ? oldHouseValues?.landLegalArea : '-' }}㎡，不合法面积{{
            oldHouseValues ? oldHouseValues?.landIllegalArea : '-'
          }}㎡）
        </div>
        <ElSpace>
          <ElButton
            type="primary"
            @click="
              () => {
                dialog = true
                EditFormid = 3
              }
            "
          >
            房屋分权日志
          </ElButton>
          <ElButton type="primary" @click="add"> 提交 </ElButton>
        </ElSpace>
      </div>

      <Table
        ref="tabalRef"
        :data="dataList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        defaultExpandAll
      >
        <template #name="{ row }">
          <el-select
            v-model="row.name"
            filterable
            remote
            reserve-keyword
            placeholder="请输入户号/户主名称"
            :remote-method="remoteMethodClone"
            :loading="loading"
            @change="doorNoChange"
            style="width: 220px"
            v-if="row.action == '删除'"
          >
            <el-option
              v-for="item in optionsClone"
              :key="item.id"
              :label="item.blurryClone"
              :value="item.name"
            />
          </el-select>
        </template>
        <template #landLegalArea="{ row }">
          <el-input
            v-model="row.landLegalArea"
            maxlength="4"
            placeholder="请输入面积"
            type="textnumber"
            @change="addLegitimate(row)"
          />
        </template>
        <template #landIllegalArea="{ row }">
          <el-input
            v-model="row.landIllegalArea"
            maxlength="4"
            placeholder="请输入面积"
            type="textnumber"
            @change="addLegitimate(row)"
          />
        </template>
        <template #action="{ row }">
          <el-button v-if="!row.action" type="primary" @click="handleEdit(row)" link
            >增加</el-button
          >
          <el-button v-else type="primary" @click="handleDel(row)" link>删除</el-button>
        </template>
      </Table>
    </div>
    <PropertyEditForm :show="dialog" :id="EditFormid" @close="onEditFormClose" />
    <el-dialog title="房屋产权分户信息" v-model="dialogVisible" width="500">
      <div style="margin-bottom: 10px; text-align: center">
        <span
          >是否对<span style="color: red">{{ houseName ? houseName : '-' }}</span
          >的<span style="color: red">{{ house ? house : '-' }}</span
          >幢房屋进行分权</span
        >
      </div>
      <ElForm
        class="form"
        ref="formRef"
        :model="form"
        label-width="120px"
        :label-position="'right'"
      >
        <ElFormItem label="分权备注" prop="remark" required>
          <ElInput v-model="form.remark" class="!w-350px" placeholder="请输入分权备注" />
        </ElFormItem>

        <ElFormItem label="分权原因" prop="reason" required>
          <ElSelect class="w-350px" v-model="form.reason">
            <ElOption
              v-for="item in dictObj[435]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElRow>
          <ElCol :span="24">
            <div class="col-wrapper">
              <div class="col-label-required">分权申请文件：</div>
              <div class="card-img-list">
                <ElUpload
                  :list-type="'picture-card'"
                  action="/api/file/type"
                  :data="{
                    type: 'archives'
                  }"
                  accept=".jpg,.png,jpeg,.pdf"
                  :multiple="false"
                  :file-list="relocateVerifyPic"
                  :headers="headers"
                  :on-error="onError"
                  :on-success="uploadFileChange1"
                  :before-remove="beforeRemove"
                  :on-remove="removeFile1"
                  :on-preview="imgPreview"
                >
                  <template #trigger>
                    <div class="card-img-box">
                      <img class="card-img" src="@/assets/imgs/house.png" alt="" />
                      <div class="card-txt">点击上传</div>
                    </div>
                  </template>
                </ElUpload>
              </div>
            </div>
          </ElCol>
        </ElRow>
      </ElForm>
      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit">确认</ElButton>
      </template>
      <el-dialog title="查看图片" :width="920" v-model="dialogVisibles">
        <img class="block w-full" :src="imgUrl" alt="Preview Image" />
      </el-dialog>
    </el-dialog>
    <div
      class="flex items-center justify-between pb-12px"
      style="color: red; margin-left: 20px"
      v-if="role == RoleCodeType.implementation"
      >房屋产权分户提醒：若要搜索本网格以外居民户，请联系实施组长调整网格划分</div
    >
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, toRaw } from 'vue'
import { useAppStore } from '@/store/modules/app'
import {
  ElButton,
  ElSelect,
  ElOption,
  ElInput,
  ElCheckboxGroup,
  ElCheckbox,
  ElDialog,
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElMessage,
  ElUpload,
  ElMessageBox
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import {
  findHouseUser, //查询农户
  findAll, //查询房屋
  separate //提交业务
} from '@/api/fundManage/fundPayment-service'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import PropertyEditForm from './PropertyEditForm.vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import type { UploadFile, UploadFiles } from 'element-plus'

const searchForm = ref<any>({
  blurry: '',
  house: ''
})
const house = ref<any>()
const blurry = ref<any>()
const blurryClone = ref<any>()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
let dialog = ref(false)
let EditFormid = ref()
const appStore = useAppStore()
const currentProjectId = appStore.currentProjectId
const userInfo = computed(() => appStore.getUserInfo)
let tabalRef = ref()
const districtTree = ref<any[]>([])
const dialogVisible = ref(false)
const oldHouseValues = ref<any>({})
// const { register, tableObject, methods } = useTable({
//   getListApi: getSeparateList,
//   delListApi: getSeparateList
// })
// const { getList, setSearchParams } = methods
const form = ref<any>({
  reason: '',
  remark: ''
})
// tableObject.params = {
//   projectId,
//   type: 'PeasantHousehold'
// }
interface FileItemType {
  name: string
  url: string
}
const houseLists = ref<any>()
const loading = ref(false)
const options = ref<any[]>([])
const optionsClone = ref<any[]>([])
const dataList = ref<any[]>([])
const hoseDate = ref<any>()
const doorNoData = ref<any>()
const houseId = ref<any>()
const newHouseList = ref<any>()
const dialogVisibles = ref<any>(false)
const imgUrl = ref<string>('')
const houseName = ref<any>()
const relocateVerifyPic = ref<FileItemType[]>([]) // 搬迁安置确认单文件列表
const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}
const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
}
// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'relocateVerify')
}
// 移除之前
const beforeRemove = (uploadFile: UploadFile) => {
  return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  )
}
// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'relocateVerify')
}
// 预览
const imgPreview = (uploadFile: UploadFile) => {
  imgUrl.value = uploadFile.url!
  dialogVisibles.value = true
}
// 处理函数
const handleFileList = (fileList: UploadFiles, type: string) => {
  let list: FileItemType[] = []
  if (fileList && fileList.length) {
    list = fileList
      .filter((fileItem) => fileItem.status === 'success')
      .map((fileItem) => {
        return {
          name: fileItem.name,
          url: (fileItem.response as any)?.data || fileItem.url
        }
      })
  }

  if (type === 'relocateVerify') {
    relocateVerifyPic.value = list
  }
}
const add = () => {
  dialogVisible.value = true
}
const onClose = () => {
  dialogVisible.value = false
}
const onSubmit = async () => {
  dialogVisible.value = false
  console.log(options.value, '旧数据')
  let parmas = {
    newHouseList: toRaw(newHouseList.value),
    oldHouse: {
      doorNo: doorNoData.value,
      id: houseId.value,
      landIllegalArea: dataList.value[0].landIllegalArea,
      landLegalArea: dataList.value[0].landLegalArea
    },
    reason: form.value.reason,
    remark: form.value.remark,
    fileUrl: JSON.stringify(relocateVerifyPic.value || [])
  }
  console.log(parmas, '提交参数')
  await separate(parmas)
    .then(() => {
      ElMessage.success('房屋产权分户成功！')
    })
    .catch(() => {
      ElMessage.error('房屋产权分户失败！')
    })
}
// const getdistrictTree = async () => {
//   const list = await getVillageTreeApi(projectId)
//   districtTree.value = list || []
//   return list || []
// }
const addLegitimate = (row) => {
  console.log(row, '数据流')
  console.log(Number(row.landLegalArea) + Number(row.landIllegalArea), '合法数据')
  dataList.value[row.index].landArea = Number(row.landLegalArea) + Number(row.landIllegalArea)
  console.log(dataList.value, '表格数据')
  let arr = toRaw(dataList.value).filter((item) => item.action == '删除')
  console.log(arr, '提交新房数据')
  newHouseList.value = arr.map((item: any) => {
    return {
      doorNo: item.doorNo,
      landIllegalArea: item.landIllegalArea,
      landLegalArea: item.landLegalArea
    }
  })
  console.log(newHouseList.value, '数组')
}
const doorTypeChange = (val) => {
  console.log(val, '测试数据下拉1')
  houseName.value = val
  options.value.forEach((item) => {
    if (item.name == val) {
      doorNoData.value = item.doorNo
      // houseId.value = item.id
      findAll({ doorNo: doorNoData.value, status: 'implementation' }).then((res) => {
        houseLists.value = res.content
        console.log(houseLists.value, '房子数据')
      })
    }
  })
}
const houseType = (val) => {
  console.log(val, '选择的房子')
  houseLists.value.forEach((item) => {
    if (item.houseNo == val) {
      houseId.value = item.id
    }
  })
}
const doorNoChange = (val) => {
  console.log(val, '测试数据下拉2')
  optionsClone.value.forEach((item) => {
    if (item.name == val) {
      let doorNo = item.doorNo
      // findAll({ doorNo: doorNo, status: 'implementation' }).then((res) => {
      //   // houseLists.value = res.content
      //   console.log(res.content, '房子数据')
      // })
      console.log(dataList.value.length, '表数据长度')
      console.log(doorNo, '户号是什么')
      dataList.value[dataList.value.length - 1].doorNo = doorNo
      console.log(dataList.value, '表数据')
    }
  })
}
const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    findHouseUser({ blurry: query, page: 0, size: 10 }).then((res) => {
      loading.value = false
      options.value = res.content.map((item) => {
        return {
          id: item.id,
          name: item.name,
          doorNo: item.doorNo,
          blurry:
            item.doorNo +
            ' ' +
            item.name +
            ' ' +
            item.cityCodeText +
            ' ' +
            item.areaCodeText +
            ' ' +
            item.townCodeText +
            ' ' +
            item.villageText
        }
      })
      console.log(options.value, '农户数据')
    })
  } else {
    options.value = []
  }
}

const remoteMethodClone = (query: string) => {
  if (query) {
    loading.value = true
    findHouseUser({ blurry: query, page: 0, size: 10 }).then((res) => {
      loading.value = false
      optionsClone.value = res.content.map((item) => {
        return {
          id: item.id,
          name: item.name,
          doorNo: item.doorNo,
          blurryClone:
            item.doorNo +
            ' ' +
            item.name +
            ' ' +
            item.cityCodeText +
            ' ' +
            item.areaCodeText +
            ' ' +
            item.townCodeText +
            ' ' +
            item.villageText
        }
      })
      console.log(optionsClone.value, '农户数据')
    })
  } else {
    optionsClone.value = []
  }
}
// 角色代码
enum RoleCodeType {
  implementation = 'implementation', // 移民实施
  assessor = 'assessor', // 房屋评估
  assessorland = 'assessorland', // 土地评估
  other = 'other', // 其他 注意不是字典 用作区别 领导角色的,
  implementleader = 'implementleader' //实施组长
}
const role = ref<RoleCodeType>(RoleCodeType.other)
/**
 * 判断角色
 */
const getRole = () => {
  if (userInfo.value) {
    const project = userInfo.value.projectUsers.find((x: any) => x.projectId === currentProjectId)
    const role =
      project && project.roles && project.roles.length
        ? (project.roles[0].code as RoleCodeType)
        : RoleCodeType.other
    // 默认用户拥有一个角色 角色选择先不考虑
    return role
  }
  return RoleCodeType.other
}
onMounted(() => {
  role.value = getRole()
})
const schema = reactive<CrudSchema[]>([
  {
    width: 340,
    field: 'name',
    label: '待获得产权户',
    search: {
      show: false
    }
  },
  {
    width: 340,
    field: 'landArea',
    label: '房屋建筑面积（㎡）',
    search: {
      show: false
    }
  },
  {
    field: 'landLegalArea',
    label: '房屋合法面积（㎡）',
    search: {
      show: false
    }
  },
  {
    field: 'landIllegalArea',
    label: '房屋不合法面积（㎡）',
    search: {
      show: false
    }
  },
  {
    field: 'action',
    label: '操作',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])

let { allSchemas } = useCrudSchemas(schema)

const onSearch = () => {
  console.log(1, '测试查询功能')
  console.log(blurry.value, '测试农户')
  console.log(house.value, '测试房子')
  houseLists.value.forEach((item) => {
    if (item.houseNo == house.value) {
      dataList.value = [
        {
          index: 0,
          name: blurry.value + ' ' + doorNoData.value,
          landArea: item.landArea,
          landLegalArea: item.landLegalArea,
          landIllegalArea: item.landIllegalArea
        }
      ]
      oldHouseValues.value = {
        landArea: item.landArea,
        landLegalArea: item.landLegalArea,
        landIllegalArea: item.landIllegalArea
      }
    }
  })
  console.log(hoseDate.value, 'bbq')
  console.log(dataList.value, '测试表数据')
}
let setSearchParams = () => {
  dataList.value = []
  blurry.value = ''
  house.value = ''
}
let handleEdit = (row) => {
  console.log(row, '新增row')
  dataList.value.push({
    index: dataList.value.length,
    name: '',
    landArea: 0,
    landLegalArea: 0,
    landIllegalArea: 0,
    doorNo: '',
    action: '删除'
  })
}
let handleDel = (row) => {
  console.log(row, '删除row')
  // dataList.value.splice(row.index, 1)
  dataList.value.splice(dataList.value.indexOf(row), 1)
  console.log(dataList.value, '表格数据')
}
const onEditFormClose = (flag: boolean) => {
  console.log(flag)

  dialog.value = false
}
</script>

<style lang="less" scoped>
.view-upload {
  display: flex;
  height: 32px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-1);
  white-space: nowrap;
  cursor: default;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  box-shadow: 0px 1px 4px 0px rgba(202, 205, 215, 0.68);
  align-items: center;
}

.file-list {
  height: 210px;
  overflow-y: scroll;

  .file-item {
    display: flex;
    padding: 5px 16px;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-color-1);
    border-bottom: 1px solid #ebebeb;
    align-items: center;

    .m-lr-20px {
      margin: 0 20px;
    }

    .file-name {
      text-align: justify;
      word-break: break-all;
    }

    .number {
      font-weight: 500;
      color: var(--el-color-primary);
    }

    .flex-none {
      flex: none;
    }
  }
}

.ElButton-form-wrap {
  display: block;
  padding: var(--distance-base);
  margin-top: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.numFont {
  font-size: 14px;
}

.max-header {
  width: 1000px;
}
</style>
