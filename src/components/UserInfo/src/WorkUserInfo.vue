<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { resetRouter } from '@/router'
import { logoutApi } from '@/api/login'
import { useDesign } from '@/hooks/web/useDesign'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'

const tagsViewStore = useTagsViewStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('user-info')
const { wsCache } = useCache()
const appStore = useAppStore()

const nickName = (appStore.getUserJwtInfo && appStore.getUserJwtInfo.nickName) || '用户'

const loginOut = () => {
  ElMessageBox.confirm('是否退出本系统?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await logoutApi().catch(() => {})
      wsCache.clear()
      tagsViewStore.delAllViews()
      resetRouter() // 重置静态路由表
      window.location.href = '/#/login'
      setTimeout(() => window.location.reload(), 500)
    })
    .catch(() => {})
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click">
    <div class="flex items-center cursor-pointer">
      <img src="@/assets/imgs/avatar.jpg" alt="" class="w-20px h-20px rounded-[50%]" />
      <span class="<lg:hidden text-14px pl-[8px] text-[#fff]">{{ nickName }}</span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div @click="loginOut">{{ '退出系统' }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
