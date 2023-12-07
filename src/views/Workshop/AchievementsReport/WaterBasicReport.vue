<template>
  <WorkContentWrap>
    <!-- 水电站 -->
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
    <div v-if="false" class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 水电站 </div>
      </div>
      <!-- <img src="@/assets/imgs/report/hydropower_station.png" style="max-width: none" alt="" /> -->
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn type="index" label="序号" width="100" align="center" />
        <ElTableColumn prop="position" label="所在地点" show-overflow-tooltip align="center" />
        <ElTableColumn prop="name" label="名称" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="representative"
          label="法人代表"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn prop="tenure" label="权属性质" show-overflow-tooltip align="center" />
        <ElTableColumn prop="tenure" label="权属单位" show-overflow-tooltip align="center" />
        <ElTableColumn prop="tenure" label="用地性质" show-overflow-tooltip align="center" />
        <ElTableColumn prop="tenure" label="建成年月" show-overflow-tooltip align="center" />
        <ElTableColumn prop="tenure" label="规模" show-overflow-tooltip align="center" />
        <ElTableColumn prop="tenure" label="库容（万m³）" show-overflow-tooltip align="center" />
        <ElTableColumn prop="tenure" label="引水来源" show-overflow-tooltip align="center" />
        <ElTableColumn prop="tenure" label="杨程（m）" show-overflow-tooltip align="center" />
        <ElTableColumn prop="tenure" label="渠（管）道（m）" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="tenure"
          label="年发电量（万KW.h）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn prop="tenure" label="库容（万m³）" show-overflow-tooltip align="center" />
        <ElTableColumn prop="tenure" label="主要建筑物" show-overflow-tooltip align="center" />
        <ElTableColumn prop="tenure" label="工商证" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="tenure"
          label="注册资金（万元）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn
          prop="tenure"
          label="年产总值（万元）"
          show-overflow-tooltip
          align="center"
        />
        <ElTableColumn prop="tenure" label="年利润（万元）" show-overflow-tooltip align="center" />
        <ElTableColumn
          prop="tenure"
          label="年工资总额（万元）"
          show-overflow-tooltip
          align="center"
        />

        <ElTableColumn label="法人代表" show-overflow-tooltip header-align="center" />
      </ElTable>
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
  width: 100%;
  overflow-x: auto;
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
