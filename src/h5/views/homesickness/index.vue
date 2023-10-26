<template>
  <div class="flex-col app-container">
    <div class="flex-col flex-auto section-homesickness">
      <div class="flex-col justify-start group-homesickness">
        <ListView :loading="loading" :no-more="noMore" @refresh="initData" @load-more="loadMore">
          <div class="flex-col">
            <div
              class="flex-col justify-start items-center relative list-item"
              v-for="(item, index) in items"
              :key="index"
              @click="toLink('homesicknessDetail', { id: item.id })"
            >
              <img
                class="image-item"
                :src="item.coverPic ? JSON.parse(item.coverPic)[0].url : ''"
              />
              <div class="flex-col items-start section">
                <span class="title-txt">{{ item.title }}</span>
                <span class="title-desc-txt">{{ item.author }}</span>
              </div>
            </div>
          </div>
        </ListView>
      </div>
    </div>
    <div class="deliver" @click="toLink('deliver')">
      <ElImage :src="iconContributeSrc" class="deliver-image" />
      <div class="deliver-txt">投稿</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import homesicknessBgSrc from '@/h5/assets/imgs/homesickness_bg.png'
import { ref, onMounted } from 'vue'
import { ElImage } from 'element-plus'
import iconContributeSrc from '@/h5/assets/imgs/icon_contribute.png'
import { useRouter } from 'vue-router'
import ListView from '@/h5/components/ListView/index.vue'
import { getHomesickness } from './service'
const { push } = useRouter()

const toLink = (routeName: string, query = {}) => {
  push({
    name: routeName,
    query
  })
}

const items = ref<any>([
  {
    title: '古茗苏遗址',
    desc: '留影·镜岭水库丨古民宿遗址'
  },
  {
    title: '四季如村',
    desc: '留影·镜岭水库丨古民宿遗址'
  },
  {
    title: '四季如村',
    desc: '留影·镜岭水库丨古民宿遗址'
  },
  {
    title: '四季如村',
    desc: '留影·镜岭水库丨古民宿遗址'
  },
  {
    title: '古茗苏遗址',
    desc: '留影·镜岭水库丨古民宿遗址'
  },
  {
    title: '四季如村',
    desc: '留影·镜岭水库丨古民宿遗址'
  },
  {
    title: '四季如村',
    desc: '留影·镜岭水库丨古民宿遗址'
  },
  {
    title: '四季如村',
    desc: '留影·镜岭水库丨古民宿遗址'
  }
])
let getHomesicknesss = async () => {
  let data = await getHomesickness()
  console.log(data.content)
  items.value = data.content
}
//第一次加载和加载更多不同,需要手动调用,初始化内容数组和数据总量
onMounted(() => {
  initData()
  getHomesicknesss()
})

//分页参数,当前页码
const pageNum = ref(1)
//请求是否完成
const loading = ref(false)
//是否有更多数据需要加载
const noMore = ref(false)

//初始化函数,也可以用于刷新
const initData = () => {
  pageNum.value = 1
  //根据需要传递给后台的参数
  // let params = {
  // ...
  // }
  // loading.value=true
  // //请求后台接口
  // let resList = await getXXXList(params)
  // //后台反馈的数据放入变量中
  // dataList.value = resList.content
  // //设置数据总量
  // total.value = resList.totalSize
  loading.value = false
}
// watch(dataList, () => {
// //判断是否有更多数据需要加载,如果接口没有返回数据,或者返回的数据大于等于总数则没有更多数据需要加载
//   if (!dataList.value || total.value <= dataList.value.length) {
//     noMore.value = true
//   }
// })
const loadMore = () => {
  pageNum.value++
  // let params = {
  // ...
  // }
  // loading.value=true
  // let resList = await getXXXList(params)
  // //加载更多数据,和初始化数据不同,需要对数据进行追加,而不是直接覆盖
  // dataList.value = dataList.value.concat(resList.ontent)
  // total.value = resList.totalSize
  // loading.value=false
  console.log('LoadMore-pp')
}
</script>

<style lang="less" scoped>
.section-homesickness {
  padding-top: 22px;
  padding-bottom: 32px;
  overflow-y: auto;

  .group-homesickness {
    margin: 0 30px;
    border-radius: 16px;

    .list-item {
      margin-top: 20px;
      overflow: hidden;
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0px 0px 28px #0000000d;

      :first-child {
        margin-top: 0;
      }

      .image-item {
        width: 690px;
        height: 300px;
        flex-shrink: 0;
      }

      .section {
        position: absolute;
        top: 184px;
        right: 0;
        left: 0;
        padding: 24px 32px;
        overflow: hidden;
        background-image: linear-gradient(359.5deg, #131824cc 1.9%, #2f31386e 56.4%, #4f4f4f00 97%);

        .title-txt {
          margin-bottom: 15px;
          font-size: 32px;
          line-height: 30px;
          color: #ffffff;
        }

        .title-desc-txt {
          font-size: 24px;
          line-height: 22px;
          color: #ffffffb3;
        }
      }
    }
  }
}

.deliver {
  position: fixed;
  right: 25px;
  bottom: 45px;
  z-index: 999;
  display: flex;
  width: 120px;
  height: 120px;
  background: linear-gradient(180deg, #598cff 0%, #3e73ec 100%);
  border-radius: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .deliver-image {
    width: 40px;
    height: 40px;
  }

  .deliver-txt {
    font-size: 28px;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>
