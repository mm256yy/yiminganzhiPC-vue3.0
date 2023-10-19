<template>
  <div class="flex-col app-container">
    <div class="flex-col flex-auto group-policies">
      <div class="flex-col section-policies">
        <img class="image-header" :src="lawsBgSrc" />
        <div class="flex-col section">
          <div
            class="flex-row justify-between items-center policies-item"
            v-for="(item, index) in items"
            :key="index"
            @click="toLink('policiesDetail')"
          >
            <span class="list-item-txt">{{ item.title }}</span>
            <img class="image-right" :src="rightSrc" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import lawsBgSrc from '@/h5/assets/imgs/laws_bg.png'
import rightSrc from '@/h5/assets/imgs/icon_right.png'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const { push } = useRouter()

const items = ref<any>([
  {
    title: '技能技能培训一'
  },
  {
    title: '技能技能培训二'
  },
  {
    title: '技能技能培训三'
  },
  {
    title: '技能技能培训四'
  },
  {
    title: '技能技能培训五'
  }
])

const toLink = (routeName: string, query = {}) => {
  push({
    name: routeName,
    query
  })
}
</script>

<style lang="less" scoped>
.group-policies {
  padding-top: 24px;
  overflow-y: auto;

  .section-policies {
    padding: 0 30px;

    .image-header {
      width: 690px;
      height: 220px;
      border-radius: 16px;
      filter: drop-shadow(0px 8px 5px #0000000a);
    }

    .section {
      height: 600px;
      padding-bottom: 20px;
      margin-top: 24px;
      background-color: #ffffff;
      border-radius: 16px;

      .policies-item {
        padding: 32px 0;
        margin: 0 30px;
        border-bottom: solid 2px #ebebeb80;

        .list-item-txt {
          font-family: PingFang SC;
          font-size: 28px;
          line-height: 26px;
          color: #131313;
        }

        .image-right {
          width: 40px;
          height: 40px;
        }
      }

      .view {
        margin-top: -40px;
      }

      .view_2 {
        margin-top: -40px;
      }
    }
  }
}
</style>
