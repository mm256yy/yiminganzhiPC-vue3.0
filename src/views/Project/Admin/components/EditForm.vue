<template>
  <Dialog
    :model-value="props.show"
    :title="title"
    :fullscreen="false"
    style="width: 800px"
    :max-height="470"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :rules="rules" :is-col="true">
      <template #mapPic>
        <!-- <span class="tips-icon">*</span> -->
        <ElUpload
          class="w-full"
          drag
          action="/api/file"
          accept=".json"
          :file-list="mapPic"
          :headers="headers"
          :limit="1"
          :on-success="uploadFileChange"
          :before-remove="beforeRemove"
          :on-remove="removeFile"
          :on-preview="filePreview"
        >
          <Icon :size="30" icon="ant-design:cloud-upload-outlined" />
          <div class="el-upload__text"> 拖入文件或者 <em>点击上传</em> 支持json文件 </div>
        </ElUpload>
      </template>
    </Form>
    <template #footer>
      <ElButton type="primary" :loading="loading" @click="onSave">确认</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import gcoord from 'gcoord'
import { computed, reactive, unref, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import type { UploadFile, UploadFiles } from 'element-plus'
import { ElButton, ElMessage, ElMessageBox, ElUpload } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { useValidator } from '@/hooks/web/useValidator'
import { ProjectDtoType } from '@/api/project/types'
import { saveProjectApi } from '@/api/project'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { getDistrictChildrenApi } from '@/api/district'
interface Props {
  show: boolean
  row?: ProjectDtoType
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { required } = useValidator()
const loading = ref(false)
const currentRow = computed(() => props.row)
const mapPic = ref<FileItemType[]>([]) // 上传的地图JSON文件
const mapJson = ref<string>('') // 地图JSON文件解析后的JSON数据字符串
const appStore = useAppStore()

const headers = ref({
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
})

const title = computed(() => {
  return props.row ? '维护项目' : '新增项目'
})

const rules = {
  name: [required()],
  description: [required()],
  reservoirName: [required()],
  reservoirCode: [required()],
  projectType: [required()],
  townCode: [required()]
}

// const townCode = ref()
const districtTree = ref<string[] | null>()
const defaultProps = {
  value: 'code',
  label: 'name'
  // disabled: (node) => {
  //   return node && node.data && node.data.hasChild && node.level !== 3
  // },
  // isLeaf: (node) => {
  //   return node.level === 3
  // }
}

const loadDistrictNode = async (node: any, resolve: any) => {
  if (node.level === 3) {
    resolve([])
    return
  }
  let parentId
  if (node && node.level == 0) {
    parentId = 0
  } else {
    parentId = node.data.id
  }
  const childrenList = await getDistrictChildrenApi(parentId)
  resolve(childrenList)
}

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '项目名称',
    component: 'Input'
  },
  {
    field: 'reservoirName',
    label: '水库名称',
    component: 'Input'
  },
  {
    field: 'showName',
    label: '项目简称',
    component: 'Input'
  },
  {
    field: 'reservoirCode',
    label: '水库编码',
    component: 'Input'
  },
  {
    field: 'projectType',
    label: '工程类型',
    component: 'Select',
    componentProps: {
      style: {
        width: '100%'
      },
      options: [
        { label: '水电工程', value: 'Hydropowerproject' },
        { label: '水利枢纽', value: 'HydroJunction' }
      ]
    }
  },
  {
    field: 'townCode',
    label: '所属区域',
    colProps: { span: 12 },
    component: 'TreeSelect',
    componentProps: {
      lazy: true,
      multiple: true,
      nodeKey: 'code',
      load: loadDistrictNode,
      props: defaultProps,
      defaultExpandedKeys: districtTree,
      style: { width: '100%', 'margin-right': '10px' }
    }
  },
  {
    field: 'mapPic',
    label: '地图JSON文件',
    colProps: { span: 24 }
  },
  {
    field: 'description',
    label: '简介',
    component: 'Input',
    colProps: { span: 24 },
    componentProps: {
      style: {
        width: '100%'
      },
      type: 'textarea',
      rows: 10
    }
  }
])

const { register, elFormRef, methods } = useForm()

// 处理已上传的文件
const handleFileList = (fileList: UploadFiles) => {
  // console.log('fileList:', fileList)
  if (fileList && fileList.length) {
    const list = fileList
      .filter((fileItem: any) => fileItem.status === 'success')
      .map((fileItem: any) => {
        return {
          name: fileItem.name,
          url: fileItem.url || (fileItem.response.data as string)
        }
      })
    mapPic.value = list
  }
}

// 处理json文件
const handleFiles = (files: any) => {
  let reader = new FileReader() // 新建一个FileReader
  reader.readAsText(files.raw, 'UTF-8') // 读取文件
  // 读取文件完毕执行此函数
  reader.onload = (evt: any) => {
    const dataJson = JSON.parse(evt.target?.result)
    mapJson.value = JSON.stringify(dataJson)
  }
}

// 文件上传
const uploadFileChange = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
  handleFiles(_file)
}

// 移除之前
const beforeRemove = (uploadFile: UploadFile) => {
  return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  )
}

// 文件移除
const removeFile = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}

// 文件预览
const filePreview = (uploadFile: UploadFile) => {
  if (uploadFile.url) {
    window.open(uploadFile.url)
  }
}

onMounted(async () => {
  const townCode = currentRow.value?.townCode ? currentRow.value.townCode.split(',') : []
  districtTree.value = currentRow.value?.districtTree?.join(',').split(',') || []
  mapPic.value = currentRow.value?.mapPic ? JSON.parse(currentRow.value.mapPic) : []
  mapJson.value = currentRow.value?.mapJson ? currentRow.value.mapJson : ''
  methods.setValues({
    ...currentRow.value,
    townCode
  })
})

const onSave = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      // if (!mapPic.value || !mapPic.value.length) {
      //   return ElMessage.error('请上传地图JSON文件')
      // }
      doSave()
    }
  })
}

const doSave = async () => {
  loading.value = true
  const project = (await methods.getFormData()) || {}
  project.townCode = project.townCode.join(',')
  project.mapPic = JSON.stringify(mapPic.value)
  project.mapJson = mapJson.value ? convertCoordinates(JSON.parse(mapJson.value)) : ''
  if (currentRow.value && currentRow.value.id) {
    project.id = currentRow.value.id
  }
  saveProjectApi(project as ProjectDtoType)
    .then(() => {
      loading.value = false
      ElMessage.success('保存项目成功')
      onClose()
    })
    .finally(() => {
      loading.value = false
    })
}

/**
 * 坐标转换
 * @param obj 原始坐标数据
 */
const convertCoordinates = (obj: any) => {
  let newObj = {}
  if (obj) {
    newObj = {
      type: obj.type,
      name: obj.name,
      crs: { ...obj.crs },
      features: fmtFeatures(obj.features)
    }
    return JSON.stringify(newObj)
  }
  return JSON.stringify(newObj)
}

/**
 * 格式化 features 数据
 * @param arr 原始数据
 */
const fmtFeatures = (arr: any) => {
  let newArr: any = []
  if (arr && arr.length) {
    arr.map((item) => {
      newArr.push({
        type: item.type,
        properties: { ...item.properties },
        geometry: {
          type: item.geometry.type,
          coordinates: [[fmtCoordinates(item.geometry.coordinates[0][0])]]
        }
      })
    })
    return newArr
  }
  return newArr
}

/**
 * 坐标转换, 将WGS-84(国际标准)转为GCJ-02(火星坐标)
 * @param arr 原始坐标
 */
const fmtCoordinates = (arr: any) => {
  let newArr: any = []
  if (arr && arr.length) {
    arr.map((item) => {
      newArr.push([
        transformFromWGSToGCJ(item[0], item[1])[0],
        transformFromWGSToGCJ(item[0], item[1])[1],
        item[2]
      ])
    })
    return newArr
  }
  return newArr
}

/**
 * 将WGS-84(国际标准)转为GCJ-02(火星坐标)
 * @param longitude 精度
 * @param latitude 纬度
 */
const transformFromWGSToGCJ = (longitude: number, latitude: number) => {
  let coords = gcoord.transform(
    [longitude, latitude], // 经纬度坐标
    gcoord.WGS84, // 当前坐标系
    gcoord.GCJ02 // 目标坐标系
  )
  return coords
}

const onClose = () => {
  emit('close')
}
</script>
<style>
.tips-icon {
  position: absolute;
  top: 0;
  left: -116px;
  color: red;
}
</style>
