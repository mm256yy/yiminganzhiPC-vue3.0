<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { resetRouter } from '@/router'
import { useRouter } from 'vue-router'
import { logoutApi } from '@/api/login'
import { useDesign } from '@/hooks/web/useDesign'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'

const tagsViewStore = useTagsViewStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('user-info')
const { wsCache } = useCache()
const { replace } = useRouter()
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
      replace('/login')
      setTimeout(() => window.location.reload(), 800)
    })
    .catch(() => {})
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <img
        src="@/assets/imgs/avatar.jpg"
        alt=""
        class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
      />
      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">{{
        nickName
      }}</span>
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
