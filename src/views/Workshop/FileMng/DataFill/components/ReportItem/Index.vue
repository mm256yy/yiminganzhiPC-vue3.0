<template>
  <div>
    <div class="list">
      <div
        v-for="(item, index) in props.list"
        :key="index"
        class="list-item"
        @click="handleItemClick(item.url)"
      >
        <img :src="item.number > 0 ? reportCheckSrc : reportUnCheckSrc" width="25" />
        <span class="title">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApproveDtoType } from '@/api/fileMng/approve-types'
import reportCheckSrc from '@/assets/imgs/Icon_Report_abled.png'
import reportUnCheckSrc from '@/assets/imgs/Icon_Report_disabled.png'

interface PropType {
  list: ApproveDtoType[]
}

const props = defineProps<PropType>()
const emit = defineEmits(['jump'])

const handleItemClick = (url: string) => {
  emit('jump', url)
}
</script>

<style lang="less" scoped>
.list {
  padding: 24px;
}

.list-item {
  display: flex;
  height: 58px;
  padding: 0 20px;
  margin-bottom: 14px;
  font-size: 16px;
  color: #333333;
  cursor: pointer;
  background: #f0f3f8;
  align-items: center;

  .diamond {
    position: relative;
    top: -6px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-bottom-color: #aaaaaa;

    &::after {
      position: absolute;
      top: 6px;
      left: -6px;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-top-color: #aaaaaa;
      content: '';
    }
  }

  .title {
    padding-left: 10px;
    line-height: 20px;
  }

  &:hover {
    color: #4154cc;
    background: linear-gradient(to right, #dde9fb, #fff);
  }
}

.active {
  background-color: #4154cc;
}
</style>
