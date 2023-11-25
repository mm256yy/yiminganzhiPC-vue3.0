<template>
  <WorkContentWrap>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div> 选择待合并户：</div>
        <div><ElButton type="primary" @click="select">选择</ElButton></div>
      </div>
      <ElTable :data="tableData" border style="width: 100%">
        <ElTableColumn prop="date" label="设为新户主" />
        <ElTableColumn prop="name" label="户主姓名" />
        <ElTableColumn prop="address" label="户号" />
        <ElTableColumn prop="address" label="行政村" />
        <ElTableColumn prop="address" label="家庭成员" />
        <ElTableColumn prop="address" label="户籍地址" />
      </ElTable>
      <div class="pb-12px pt-12px">
        <div> <ElSwitch v-model="switchs" @change="switchChange" /> 是否指定新户主</div>
        <div style="margin: 10px 0" v-show="switchs && tableData.length > 2"
          >指定新户主、户号及行政村：</div
        >
        <div style="margin: 10px 0" v-show="switchs && tableData.length > 2">
          <span style="margin-right: 10px">
            选择行政村：
            <ElSelect v-model="form.value" placeholder="选择行政村：">
              <ElOption
                v-for="item in form.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </span>
          <span>
            选择自然村：
            <ElSelect v-model="form.value" placeholder="选择自然村：">
              <ElOption
                v-for="item in form.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </span>
        </div>
        <div style="margin: 10px 0" v-show="switchs && tableData.length > 2">
          <span style="margin-right: 10px">
            选择新户主：
            <ElSelect v-model="form.value" placeholder=" 选择新户主：">
              <ElOption
                v-for="item in form.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </span>
          <span>
            新户号:&nbsp;&nbsp;
            <ElSelect v-model="form.value" placeholder="选择  新户号：自然村：">
              <ElOption
                v-for="item in form.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </span>
        </div>
      </div>
      <div style="color: red">说明：人口和房屋信息合并，附属物和零星林果木等信息累加。</div>
    </div>
    <ElDialog v-model="dialogTableVisible" title="选择居民户" width="900px">
      <div style="width: 100%; margin-bottom: 10px; text-align: right">
        <ElButton type="primary" @click="selectAdd">确认</ElButton></div
      >
      <ElTable :data="form.gridData" @selection-change="handleSelectionChange">
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn prop="name" label="户主姓名" />
        <ElTableColumn prop="address" label="户号" />
        <ElTableColumn prop="address" label="行政村" />
        <ElTableColumn prop="address" label="家庭成员" />
        <ElTableColumn prop="address" label="户籍地址" />
      </ElTable>
    </ElDialog>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElSelect,
  ElOption,
  ElMessage,
  ElDialog
} from 'element-plus'
import { ref, reactive } from 'vue'
let tableData: any = ref([])
let switchs = ref(false)
let dialogTableVisible = ref(false)
let form = reactive({
  value: '',
  options: [
    {
      value: '选项1',
      label: '黄金糕'
    },
    {
      value: '选项2',
      label: '双皮奶'
    },
    {
      value: '选项3',
      label: '蚵仔煎'
    },
    {
      value: '选项4',
      label: '龙须面'
    }
  ],
  gridData: [
    {
      name: '张三',
      address: '北京市海淀区中关村'
    },
    {
      name: '李四',
      address: '北京市海淀区西城区'
    },
    {
      name: '王五',
      address: '北京市海淀区东城区'
    }
  ]
})
let switchChange = (val) => {
  if (val && tableData.value.length < 2) {
    ElMessage({
      message: '选择用户小于2',
      type: 'warning'
    })
    switchs.value = false
  }
}
let select = () => {
  dialogTableVisible.value = true
}
let handleSelectionChange = (val) => {
  console.log(val)
}
let selectAdd = () => {
  dialogTableVisible.value = false
  tableData.value = form.gridData
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

:deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
