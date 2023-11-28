<template>
  <WorkContentWrap>
    <!-- 水电站附属物汇总表 -->
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">水电站</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 水电站附属物汇总表 </div>
      </div>
      <ElTable :data="tableData">
        <ElTableColumn type="index" label="序号" width="100" align="center" />
        <ElTableColumn prop="village" label="行政村" show-overflow-tooltip align="center" />
        <ElTableColumn prop="name" label="名称" show-overflow-tooltip align="center" />

        <ElTableColumn label="附属物" header-align="center">
          <ElTableColumn
            prop="radical"
            label="有限电视（处）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn
            prop="radical"
            label="网络宽带（处）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn prop="radical" label="电话（处）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="空调（处）" show-overflow-tooltip align="center" />
          <ElTableColumn
            prop="radical"
            label="动力电表（只）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn
            prop="radical"
            label="太阳能热水器（只）"
            show-overflow-tooltip
            align="center"
          />
          <ElTableColumn prop="radical" label="台阶（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="花坛（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="水井（口）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="蓄水池（口）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="围墙（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="台门（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="便桥（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="柴灶（座）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="水塔（个）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="棚（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="地坪（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="洗衣台（㎡）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="渠道（km）" show-overflow-tooltip align="center" />
          <ElTableColumn prop="radical" label="道路（km）" show-overflow-tooltip align="center" />
        </ElTableColumn>
      </ElTable>
      <!-- <img style="max-width: none" src="@/assets/imgs/report/hydropower_appendage.png" alt="" /> -->
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElTable, ElTableColumn } from 'element-plus'

import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ref, reactive } from 'vue'

import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { back } = useRouter()
const tableData = ref<any>([])

const BackIcon = useIcon({ icon: 'iconoir:undo' })

const schema = reactive<CrudSchema[]>([
  // 搜索字段定义
  {
    field: 'qy',
    label: '区域',
    search: {
      show: true,
      component: 'Select'
    },
    table: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '户号',
    search: {
      show: true,
      component: 'Input'
    },
    table: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },

  {
    field: 'name',
    label: '姓名',
    search: {
      show: true,
      component: 'Input'
    },
    table: {
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
const { allSchemas } = useCrudSchemas(schema)
const onBack = () => {
  back()
}
</script>

<style lang="less" scoped>
.container {
  // width: 100%;
  overflow-x: auto;
  background-color: #f00;
}
/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.2);
}

/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
  background-color: #f5f5f5;
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
/*定义滑块
     内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: #ece6e6;
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
</style>
