<template>
  <div class="table-wrap !py-12px !mt-0px empty-wrap">
    <div class="head-wrapper">
      <div class="title">自谋出路</div>
      <div>
        <ElSpace v-if="!dataInfo">
          <ElButton :icon="editIcon" type="primary" @click="onHandle">办理</ElButton>
        </ElSpace>
      </div>
    </div>

    <div class="content-1" v-if="!dataInfo">
      <div class="flex-center">
        <Icon icon="ant-design:exclamation-circle-filled" color="#FEC44C" :size="20" />
        <div class="txt"> 该户为自谋出路，目前还未办理。 </div>
      </div>
    </div>

    <div v-else class="content-2">
      <ElRow>
        <ElCol :span="24">
          <div class="tips">
            该户为自谋出路，办理时间：
            {{ dayjs(dataInfo.selfSeekingDate).format('YYYY年MM月DD日') }}。
          </div>
        </ElCol>
        <ElCol :span="24">
          <div class="col-wrapper">
            <div class="col-labels"> 相关凭证： </div>
            <div class="card-img-list">
              <ElUpload
                class="view"
                action=""
                :data="{
                  type: 'image'
                }"
                disabled
                :list-type="'picture-card'"
                accept=".jpg,.jpeg,.png"
                :multiple="false"
                :file-list="selfSeekingPic"
                :headers="headers"
                :on-preview="imgPreview"
              />
            </div>
          </div>
        </ElCol>
      </ElRow>
    </div>

    <!-- 办理 -->
    <Handle :show="showHandle" :dataInfo="dataInfo" :baseInfo="baseInfo" @close="close" />

    <el-dialog title="查看图片" :width="920" v-model="dialogVisible">
      <img class="block w-full" :src="imgUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { useAppStore } from '@/store/modules/app'
import { useIcon } from '@/hooks/web/useIcon'
import { ElSpace, ElButton, ElRow, ElCol, ElUpload, ElDialog } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { getSelfFindWayApi } from '@/api/immigrantImplement/relocatePlacement/selfFindWay-service'
import Handle from './Handle.vue' // 引入办理组件

interface PropsType {
  doorNo: string
  baseInfo: any
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()

const editIcon = useIcon({ icon: 'ant-design:edit-outlined' })
const dataInfo = ref<any>(null)
const showHandle = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const imgUrl = ref<string>('')
const selfSeekingPic = ref<FileItemType[]>([])

const appStore = useAppStore()

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

const initData = async () => {
  const res = await getSelfFindWayApi(props.doorNo)
  if (res) {
    dataInfo.value = { ...res }
    selfSeekingPic.value = res.selfSeekingPic ? JSON.parse(res.selfSeekingPic) : []
  }
}

// 预览
const imgPreview = (uploadFile: UploadFile) => {
  imgUrl.value = uploadFile.url!
  console.log('imgUrl:', imgUrl.value)
  dialogVisible.value = true
}

// 办理
const onHandle = () => {
  showHandle.value = true
}

const close = (flag: boolean) => {
  showHandle.value = false
  if (flag === true) {
    initData()
  }
}

onMounted(() => {
  initData()
})
</script>

<style lang="less" scoped>
.head-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
}

.content-1 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  font-size: 14px;

  .flex-center {
    display: flex;
    align-items: center;
  }

  .txt {
    margin-left: 10px;
    color: #171717;
  }
}

.content-2 {
  .tips {
    margin: 0 0 20px 130px;
  }

  .col-wrapper {
    display: flex;
    align-items: center;
    margin: 0 16px 16px 0;

    .col-labels {
      display: inline-flex;
      width: 130px;
      height: 32px;
      padding: 0 12px 0 0;
      font-size: 14px;
      line-height: 32px;
      color: #606266;
      box-sizing: border-box;
      justify-content: flex-end;
      align-items: flex-start;
      flex: 0 0 auto;
    }
  }
}

.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
