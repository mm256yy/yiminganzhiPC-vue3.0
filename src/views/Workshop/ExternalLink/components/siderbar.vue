<!--
 * @Author: baike
 * @LastEditors: baike
 * @LastEditors: 1019314017@qq.com 1019314017@qq.com
-->
<template>
  <div v-loading="loading" class="sider_info" :id="idName">
    <div class="seder_head">
      <div v-if="index == 3" class="tab_list">
        <div class="list_li"> 企（事）业单位 </div>
      </div>
      <div v-else class="tab_list">
        <div
          v-for="i in list"
          :id="index == i.id ? 'list_li' : ''"
          :key="i.id"
          class="list_li"
          @click="hanldeClick(i)"
        >
          {{ i.name }}
        </div>
      </div>
      <div @click="close" class="close">X</div>
    </div>
    <div class="right_icon"></div>
    <div v-if="index == 0" class="container">
      <div class="con_tilte" style="display: flex; justify-content: space-between">
        土地权属<span>{{ (detail.gytd + detail.jttd).toFixed(2) }}</span>
      </div>
      <div class="con_list">
        <div class="li">
          <div class="li_name">国有土地</div>
          <div class="li_value">{{ detail?.gytd.toFixed(2) }}</div>
        </div>
        <div class="li">
          <div class="li_name">集体土地</div>
          <div class="li_value">{{ detail?.jttd.toFixed(2) }}</div>
        </div>
      </div>
      <div class="con_tilte" style="display: flex; justify-content: space-between">
        工程建设区和水库淹没区<span>{{
          (detail.c_xcx + detail.c_xcx + detail.c_kqq + detail.c_pax).toFixed(2)
        }}</span>
      </div>

      <div class="con_list">
        <div class="li">
          <div class="li_name">新昌县</div>
          <div class="li_value">{{ detail.c_xcx }}</div>
        </div>
        <div class="li">
          <div class="li_name">嵊州市</div>
          <div class="li_value">{{ detail.c_xcx }}</div>
        </div>
        <div class="li">
          <div class="li_name">柯桥区</div>
          <div class="li_value">{{ detail.c_kqq }}</div>
        </div>
        <div class="li">
          <div class="li_name">磐安县</div>
          <div class="li_value">{{ detail.c_pax }}</div>
        </div>
      </div>
      <div class="con_tilte" style="display: flex; justify-content: space-between">
        工程建设区和水库淹没区<span>{{
          (detail.m_xcx + detail.m_szs + detail.m_kqq).toFixed(2)
        }}</span>
      </div>
      <div class="con_list">
        <div class="li">
          <div class="li_name">新昌县</div>
          <div class="li_value">{{ detail.m_xcx }}</div>
        </div>
        <div class="li">
          <div class="li_name">嵊州市</div>
          <div class="li_value">{{ detail.m_szs }}</div>
        </div>
        <div class="li">
          <div class="li_name">柯桥区</div>
          <div class="li_value">{{ detail.m_kqq }}</div>
        </div>
      </div>
    </div>
    <div v-else class="container">
      <div class="th-title">
        <div v-for="(item, indexs) in tableJosn[index]" class="th_h" :key="indexs">{{ item }}</div>
      </div>
      <div class="question-list">
        <div class="item" v-for="item in questionList" :key="item">
          <!-- <div class="names">{{ item[keyJosn[index].keys] }}</div> -->
          <div class="names">{{ item[keyJosn[index].key] }}</div>
          <div class="names">{{ item[keyJosn[index].key_a] }}</div>
          <div class="names">{{ item[keyJosn[index].key_b] }} </div>
          <div v-if="keyJosn[index].key_c" class="names">{{ item[keyJosn[index].key_c] }} </div>
          <div v-if="keyJosn[index].key_d" class="names">{{ item[keyJosn[index].key_d] }} </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue'
import { getLeadershipScreenDetail } from '@/api/AssetEvaluation/leader-side'

const props = defineProps({
  isType: {
    type: [String, Number],
    default: '0'
  },
  isClose: {
    type: Boolean,
    default: false
  },
  code: {
    type: String,
    default: ''
  }
})

onMounted(() => {
  init()
})

const list = ref([
  {
    name: '永久用地',
    id: 0
  },
  {
    name: '人口',
    id: 1
  },
  {
    name: '房屋',
    id: 2
  }
])
const loading = ref(false)
const detail = ref<any>({})

const tableJosn = ref({
  0: ['行政村', '户数', '户数', '户数', '户数'],
  1: ['行政村', '户数', '人口合计', '农业人口', '非农人口'],
  2: ['行政村', '住宅房屋', '村集体房屋', '合计'],
  3: ['行政村', '企业', '水电站', '个体工商户', '探矿权']
})

const keyJosn = ref({
  0: {
    key: '',
    key_a: '',
    key_b: '',
    key_c: '',
    key_d: ''
  },
  //人口
  1: {
    key: 'villageName',
    key_a: 'houseNum',
    key_b: 'peopleNum',
    key_c: 'nongNum',
    key_d: 'unNongNum'
  },
  //房屋
  2: {
    key: 'villageName',
    key_a: 'zzArea',
    key_b: 'cjtArea',
    key_c: 'totalArea'
  },
  //企（事）业单位
  3: {
    keys: 'villageName',
    key: 'qyNum',
    key_a: 'sdzNum',
    key_b: 'gtNum',
    key_c: 'tkqNum'
  }
})

const idJson = ref({
  '0': 'top_a',
  '1': 'top_b',
  '2': 'top_c',
  '3': 'top_d'
})

const questionList: any = ref([])

const index = ref(props.isType)

const idName = ref(idJson.value[props.isType])

const emit = defineEmits(['onClose', 'handleChange'])

const hanldeClick = (e: any) => {
  init()
  idName.value = idJson.value[e.id]
  index.value = e.id
  emit('handleChange', e.id)
}

const init = async () => {
  loading.value = true
  let res = await getLeadershipScreenDetail({
    code: props.code || ''
  })
  //永久用地
  if (index.value == 0) {
    detail.value = res.landScreenDto.detail
  }
  // 人口
  if (index.value == 1) {
    questionList.value = []
    questionList.value = res.populationScreenDto.detail
  }
  // 房屋
  if (index.value == 2) {
    questionList.value = []
    questionList.value = res.houseScreenDto.detail
  }

  if (index.value == 3) {
    questionList.value = []
    questionList.value = res.companyDto.detail
  }
  loading.value = false
}

const close = () => {
  emit('onClose', false)
}
</script>

<style lang="less" scoped>
.sider_info {
  position: relative;
  width: 400px;
  height: 294px;
  background: #ffffff;
  border: 2px solid #3e73ec;
  border-radius: 9px 9px 9px 9px;
  opacity: 1;
  box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.2);

  .container {
    padding: 16px 16px;

    .th-title {
      display: flex;
      height: 36px;

      font-size: 14px;
      font-weight: 500;
      line-height: 36px;
      color: #171718;
      // padding: 0 10px;
      // font-weight: bold;
      background: #f2f6ff;
      box-sizing: border-box;
      align-items: center;
      justify-content: space-between;

      .th_h {
        text-align: center;
        flex: 1;
      }
    }

    .question-list {
      height: 180px;
      overflow-y: scroll;

      .item {
        display: flex;
        height: 44px;
        padding: 0 10px;
        border-bottom: 1px solid #ebebeb;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;

        .name {
          flex: 1;
          // width: 70px;
          overflow: hidden;
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap;
        }

        .names {
          flex: 1;
          // margin-left: 70px;
          overflow: hidden;
          font-size: 14px;
          font-weight: 500;
          color: #666666;
          text-align: center;
        }

        .time {
          font-size: 14px;
          font-weight: 500;
          color: rgba(19, 19, 19, 0.4);
        }
      }
    }

    .con_tilte {
      margin: 5px 0;
      font-size: 16px;
      font-weight: 500;
      color: #131313;
    }

    .con_list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .li {
        display: flex;
        font-family: DIN Medium, DIN Medium;
        font-size: 14px;
        font-weight: 400;
        color: #171718;

        .li_name {
          margin-right: 20px;
        }
      }
    }
  }

  .right_icon {
    position: absolute;
    top: 10px;
    left: -11px;
    width: 16px;
    height: 24px;
    background: url('../../../../assets/imgs/homes/right_icon.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .seder_head {
    position: relative;
    width: 100%;
    height: 50px;
    padding: 10px 0 0 10px;
    background: #3e73ec;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px; /* 左上角边框弧形 */
    .tab_list {
      display: flex;

      .list_li {
        padding: 10px 10px 10px 10px;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        cursor: pointer;
        border-radius: 4px 4px 0px 0px;
        // line-height: 19px;
      }

      #list_li {
        font-size: 16px;
        font-weight: 500;
        line-height: 19px;
        color: #3e73ec;
        background: #ffffff;
      }
    }

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 16px;
      color: white;
      cursor: pointer;
    }
  }
}

#top_a {
  position: absolute;
  top: 55px;
  right: -410px;
  z-index: 999;
}

#top_b {
  position: absolute;
  top: 155px;
  right: -410px;
  z-index: 999;
}

#top_c {
  position: absolute;
  top: 305px;
  right: -410px;
  z-index: 999;
}

#top_d {
  position: absolute;
  top: 405px;
  right: -410px;
  z-index: 999;
}
</style>
