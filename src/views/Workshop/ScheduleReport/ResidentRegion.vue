<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">居民户分区域</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 居民户分区域报表 </div>
      </div>
      <el-table height="250px" :data="[]" border style="width: 100%">
        <el-table-column prop="hz" label="序号" align="center" width="60" />
        <el-table-column prop="hz" label="户号" align="center" width="60" />
        <el-table-column prop="hz" label="户主" align="center" width="60" />
        <!-- 公寓房 -->
        <el-table-column label="动迁阶段(户)" align="center">
          <el-table-column label="资格认定" align="center">
            <el-table-column prop="a" label="人口核定" align="center" width="90" />
            <el-table-column prop="b" label="房屋产权" align="center" width="90" />
          </el-table-column>
          <el-table-column label="资产评估" width="120" align="center">
            <el-table-column prop="e" label="房屋/附属物" align="center" />
            <el-table-column prop="f" label="土地/附着物" align="center" />
          </el-table-column>
          <el-table-column prop="f" label="模拟安置" width="120" align="center" />

          <el-table-column prop="f" label="安置确认" align="center">
            <el-table-column prop="f" label="生产安置" align="center" />

            <el-table-column prop="f" label="搬迁安置" align="center" />

            <el-table-column prop="f" label="坟墓确认" align="center" />
          </el-table-column>

          <el-table-column prop="f" label="择址确认" align="center">
            <el-table-column prop="f" label="生产用地" align="center" />
            <el-table-column prop="f" label="选房择址" align="center" />
            <el-table-column prop="f" label="坟墓择址" align="center" />
          </el-table-column>
          <el-table-column label="腾空过渡" align="center">
            <el-table-column prop="f" label="房屋腾空" align="center" />
            <el-table-column prop="f" label="土地腾让" align="center" />
            <el-table-column prop="f" label="过渡安置" align="center" />
          </el-table-column>
          <el-table-column prop="f" label="动迁协议" align="center" />
        </el-table-column>
        <el-table-column prop="hz" label="安置阶段(户)" align="center">
          <el-table-column prop="hz" label="搬迁安置" align="center">
            <el-table-column prop="hz" label="自建房" align="center" width="120" />

            <el-table-column prop="hz" label="公寓房" align="center" width="120" />
            <el-table-column prop="hz" label="集中供养" align="center" width="120" />
            <el-table-column prop="hz" label="自谋出路" align="center" width="120" />
          </el-table-column>

          <el-table-column prop="hz" label="生产安置" align="center">
            <el-table-column prop="hz" label="农业安置" align="center" width="120" />

            <el-table-column prop="hz" label="养老保险" align="center" width="120" />
            <el-table-column prop="hz" label="自谋职业" align="center" width="120" />
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="hz"
            label="相关手续
"
            align="center"
            width="120"
          />
        </el-table-column>
      </el-table>

      <div class="py-[10px] bg-[#fff]">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[100, 200, 300, 400]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
        />
      </div>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElPagination
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { reactive, ref, onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { back } = useRouter()

const BackIcon = useIcon({ icon: 'iconoir:undo' })
const pageSize = ref(10)
const pageNum = ref(1)
const totalNum = ref(0)
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
const { methods } = useTable()
const { getList, setSearchParams } = methods
getList()
const onBack = () => {
  back()
}
</script>

<style scoped></style>
