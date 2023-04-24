<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="agm-wrap">
        <ElScrollbar ref="scrollRef" height="600px" @scroll="scroll">
          <div class="agm-cont">
            <div class="agm-title">镜岭水库工程建设征地实物补偿（搬迁安置）协议</div>
            <div class="agm-tit-1">甲方：镜岭镇人民政府</div>
            <div class="agm-tit-1">
              <span>乙方</span>
              <span class="common-ipt ml-10px">3</span>
              <span class="pl-40px">联系电话</span>
              <span class="common-ipt ml-10px">3</span>
            </div>

            <div class="agm-txt mt-30px">
              镜岭水库工程经“浙发改农经 〔 2022 〕 4 “号”批准建设。根据 《
              浙江省人民政府关于镜岭水库工程建设征地移民安置规划大纲的批复 》 （浙政函 〔 2022 〕 78
              号）和 《 镜岭水库工程建设征地搬迁安置工作实施办法 》 （浙政办发 〔 2022 〕 94
              号，以下简称“办法”）等文件精神，甲乙双方就实物补偿和搬迁安置达成协议如下：
            </div>

            <div class="agm-tit-1 floor-item" id="第一条 基础信息">第一条 基础信息</div>

            <div class="agm-bold mt-20px">
              （一）经认定，乙方有农村移民 5 人，农业随迁 4 人，非农随迁 1 人。具体如下：
            </div>

            <ElTable :data="tableData" class="mt-10px">
              <ElTableColumn
                label="姓名"
                :width="342"
                prop="name"
                align="center"
                header-align="center"
              />
              <ElTableColumn
                label="身份证号"
                :width="342"
                prop="card"
                align="center"
                header-align="center"
              />
              <ElTableColumn
                label="信息"
                :width="342"
                prop="info"
                align="center"
                header-align="center"
              />
            </ElTable>

            <div class="agm-bold">
              （二）经确认，乙方在工程建设征地范围内坐落有房屋，总计建筑面积
            </div>
            <div class="agm-bold">
              （三）经确认，乙方在工程建设征地范围内青苗等地上附着物涉及的土地面积总计
            </div>

            <div class="agm-tit-1 floor-item" id="第二条 安置方式">第二条 安置方式</div>
            <div class="agm-tit-2">（一）经认定，乙方选定搬迁安置方式为 集中 安置。</div>
            <div class="agm-tit-2">
              （二）经认定，乙方 2 人参加农业安置； 2 参加社会保障安置； 1
              人参加自谋职业安置。具体如下：
            </div>
            <ElTable :data="tableData2" class="mt-10px">
              <ElTableColumn
                label="姓名"
                :width="342"
                prop="name"
                align="center"
                header-align="center"
              />
              <ElTableColumn
                label="身份证号"
                :width="342"
                prop="card"
                align="center"
                header-align="center"
              />
              <ElTableColumn
                label="安置方式"
                :width="342"
                prop="resettlementType"
                align="center"
                header-align="center"
              />
            </ElTable>
            <div class="agm-txt">
              参加参加农业安置并将户籍迁入安置地的农村移民,人均安排 0.47 亩生产用地到村。
            </div>

            <div class="agm-tit-1 floor-item" id="第三条 安置房">第三条 安置房</div>
            <div class="agm-tit-2">
              （一）统一规划的安置点选址在湖镇镇集镇，位于湖镇镇派出所对面。
            </div>
            <div class="agm-tit-2">
              （二）经确认，乙方安置房选房人数 5 人，其中增计选房人数 0 人，增计依据为： 无 。
            </div>
            <div class="agm-tit-2"> （三）乙方选定 联排 房型安置房，具体如下： </div>

            <div class="detail-box">
              <div>
                <span class="agm-bold">联排房型：</span
                ><span class="agm-txt">选定为 大 户型，建筑占地 125 平方米。</span>
              </div>
              <div>
                <span class="agm-bold">公寓房型：</span>
                <span class="agm-txt"
                  >选定公寓房 0 套；合计设计建筑面积约 0 平方米；户型组合为75平方米左右户型 0
                  套；95平方米左右户型 0 套；115 平方米左右户型 0 套；135平方米左右户型 0
                  套；选定储藏室 0 间（储藏室间数不得超过选定公寓房套数）。</span
                >
              </div>
            </div>

            <div class="agm-tit-2"> （四）应缴安置房房款暂计 26000 元，具体如下： </div>

            <div class="detail-box">
              <div>
                <span class="agm-bold">自建房型：</span
                ><span class="agm-txt"
                  >户型设计建筑面积约 260 平方米，结算单价为每平方米 1000 元，暂计 260000 元。</span
                >
              </div>
              <div>
                <span class="agm-bold">公寓房型：</span>
                <span class="agm-txt"
                  >公寓房合计设计建筑面积约 0 平方米，与自建户型设计建筑面积对等部分为 0
                  平方米，每平方米基准价1000元，暂计 0 元；超出自建户型设计建筑面积为 0
                  平方米，每平方米基准价1980元，暂计 0 元；储藏室结算单价为每平方米1000元，每间暂计
                  15000元。 共 0 间暂计 0 元。</span
                >
              </div>
              <div class="agm-txt"
                >安置房结算房款建筑面积以房管部门实测为准。公寓房房款结算单价根据“办法”按基准价结合楼层系数确定：一楼按基准价减5%；二楼、四楼按基准价增加3%；三楼按基准价增加7%；五楼按基准价减8％。</div
              >
            </div>

            <div class="agm-tit-2"> （五）安置房“定位到户”按照相关实施细则执行。 </div>

            <div class="agm-tit-1 floor-item" id="第四条 补偿费、补助费及奖励费"
              >第四条 补偿费、补助费及奖励费</div
            >

            <div class="agm-tit-2">（一）补偿费</div>
            <div class="detail-box">
              <div class="agm-txt"
                >根据镜岭昌信价格事务有限公司出具的评估报告（附后），乙方房屋及
                附属建（构）筑物、青苗等地上附着物等补偿费总计 90414 元。</div
              >
            </div>

            <div class="agm-tit-2">（二）补助费</div>
            <div class="detail-box">
              <div>
                <span class="agm-bold">1、搬迁补助费：</span>
                <span class="agm-txt">
                  乙方有农村移民和农业随迁人口 5 人，补助标准为每人1200元，合计 6000 元。
                </span>
              </div>
              <div>
                <span class="agm-bold">2、过渡期补助费：</span>
                <span class="agm-txt">
                  乙方有农村移民和农业随迁人口 4 人，补助标准为每人4320元，小计 17280
                  元；非农随迁人口 1 人，补助标准为每人3000元，小计 3000 元；合计 20280 元。</span
                >
              </div>
              <div>
                <span class="agm-bold">3、临时安置补助费：</span>
                <span class="agm-txt">
                  乙方选房人数（不含增计选房人数）为 5
                  人，补助标准为每人每月450元，小计临时安置补助费每月 2250
                  元。补助时间为腾空被拆迁房屋并办理移交手续的当月至安置房选房的当月。首次发放时间为乙方腾空被拆迁房屋并办理移交手续之日起十五日内，每半年发放一次。符合补助条件的，按附件一办理确认手续。</span
                >
              </div>

              <div>
                <span class="agm-bold">4、异地搬迁补助费：</span>
                <span class="agm-txt">
                  在腾空被拆迁房屋并办理移交手续之日，按乙方符合享受县级（含）以上农民异地搬迁补助政策的人数，每人补助
                  5600 元。符合补助条件的，按附件二办理确认手续。</span
                >
              </div>

              <div class="agm-bold"> 5、其他补助费 </div>
              <div class="agm-txt">
                ① 自谋出路安置补助费：乙方有 0 人选定自谋出路安置方式，补助标准为每人15000元，小计 0
                元；
              </div>
              <div class="agm-txt">
                ② 自谋职业安置补助费：乙方有 1 人选定自谋职业安置方式，补助标准为每人3000元，小计
                3000 元；其他补助费合计 3000 元。
              </div>
            </div>

            <div class="agm-tit-2">（三）奖励费</div>
            <div class="detail-box">
              <div class="agm-bold"> 1、签约奖 </div>
              <div class="agm-txt"
                >① 网格签约奖：根据 《
                关于在镜岭水库库区设置移民网格和建立乡村干部联系移民网格的通知 》 （社委 〔 2022 〕
                36 号）文件规定，乙方划分在 下潘 村第
                <span class="common-ipt"></span>
                网格。如乙方所在网格内所有签约对象在2022年12月10日17时前全部完成镜岭水库工程建设征地实物补偿、搬迁安置协议签订，按本协议签约之日乙方农村移民和随迁人口数量，每人奖励3000元。符合奖励条件的，按附件三办理确认手续。</div
              >
              <div class="agm-txt">
                ②
                按时签约奖：如乙方在2022年12月10日17时前完成本协议签订，按本协议签约之日乙方农村移民和随迁人口数量，每人奖励
                10000 元。符合奖励条件的，按附件四办理确认手续。
              </div>

              <div class="agm-bold"> 2 、提前腾空奖 </div>
              <div class="agm-txt"
                >① 房屋提前腾空奖：如乙方在 2023 年 3 月 31 日 17
                时前完成房屋腾空并办理移交手续，按住宅建筑面积每平方米奖励 200 元；如乙方在 2023 年
                5 月 15 日 17 时前完成房屋腾空并办理移交手续，按住宅建筑面积每平方米奖励 100
                元．符合奖励条件的，按附件五办理确认手续。</div
              >
              <div class="agm-txt">
                ② 青苗提前腾空奖：如乙方在 2023 年 5 月 15 日 17
                时前完成被征土地上青苗等地上附着物腾空并办理交地手续，按青苗等地上附着物涉及的土地面积，耕地每亩奖励
                1200 元；园地、林地每亩奖励 800 元；未利用地每亩奖励 100
                元。符合奖励条件的，按附件六办理确认手续。
              </div>
            </div>
            <div class="agm-tit-2">（四）补偿费、补助费及奖励费的支付</div>
            <div class="detail-box">
              <div class="agm-txt">
                1、双方约定将补偿费、异地搬迁补助费、奖励费（如有）等资金用于安置房房款抵扣，上述资金全额拨付至甲方指定银行账户，存储期间利息归乙方所有。
              </div>
              <div class="agm-txt">
                2、甲方于本协议签订之日起十五日内向乙方支付搬迁补助费、过渡期补助费、其他补助费合计
                3000 元；临时安置补助费按本协议约定的条件、时间支付。
              </div>
              <div class="agm-txt">
                3、乙方收款账户：户名 程宗月 ， 开户行 建设银行 ，账号 6214671470000130082 。
              </div>
            </div>

            <div class="agm-tit-1 floor-item" id="第五条 安置房房款结算及交付"
              >第五条 安置房房款结算及交付</div
            >
            <div class="agm-txt">
              安置房结算房款建筑面积以房管部门实测为准，结算单价按“办法”相关规定执行。结算房款时，若乙方已拨至甲方指定银行账户的抵扣资金少于结算房款的，乙方应在安置房交房前将差额部分资金足额缴纳至甲方指定的银行帐户。
            </div>
            <div class="agm-txt">
              安置房交付时间为 2023 年 12 月，未足额缴纳结算房款的，甲方有权拒绝交房。
            </div>

            <div class="agm-tit-1 floor-item" id="第六条">第六条</div>
            <div class="agm-txt">
              被征收房屋及附属建（构）筑物、青苗等地上附着物有产权纠纷的由乙方自行处理，并承担相应法律责任。房屋内水、电、通信网络、广播电视等费用由乙方自行结清。被征收房屋有租赁、抵押、典当等关系的，由乙方自行解除。
            </div>

            <div class="agm-tit-1 floor-item" id="第七条">第七条</div>
            <div class="agm-txt">
              房屋、青苗完成腾空并办理移交手续时，乙方应将房屋所有权证、土地证件或有效权属证明等资料交于甲方。办理移交手续后，房屋及附属建（构）筑物由甲方组织拆除，土地上新增青苗等不予补偿。乙方擅自进入已腾空并办理移交手续的房屋及土地内，造成任何后果由乙方承担全部法律责任。
            </div>

            <div class="agm-tit-1 floor-item" id="第八条">第八条</div>
            <div class="agm-txt"> 乙方确认，本协议已经与家庭全体成员协商一致。 </div>

            <div class="agm-tit-1 floor-item" id="第九条">第九条</div>
            <div class="agm-txt">
              本协议在履行过程汇总发生争议的，甲、乙双方应协商解决、协商不成的、可依法向法院提起诉讼。
            </div>

            <div class="agm-tit-1 floor-item" id="第十条">第十条</div>
            <div class="agm-txt">
              本协议一式四份，甲方三份，乙方一份，经双方签字盖章后（捺印）生效。
            </div>

            <div class="agm-tit-1 floor-item" id="第十一条">第十一条</div>
            <div class="agm-txt"> 其他约定：<span class="common-ipt"></span></div>

            <div class="agm-tit-2 agm-mt-40">甲方：镜岭镇人民政府（盖章）</div>

            <div class="agm-tit-2 agm-mt-40">
              <span>法定代表人：</span>
              <span class="common-ipt"></span>
              <span>经办人（工作小组成员）：</span>
              <span class="common-ipt"></span>
              <span>乙方（户主或委托代理人）：</span>
              <span class="common-ipt"></span>
            </div>

            <div class="agm-tit-2 agm-mt-40"> 鉴证方：镜岭水库工程建设指挥部办公室（盖章） </div>

            <div class="agm-tit-2 agm-mt-40"> 负责人（盖章） </div>

            <div class="agm-tit-2 agm-mt-40"> 经办人：<span class="common-ipt"></span> </div>

            <div class="agm-tit-2 agm-mt-40 text-right">
              <span>日期</span>
              <span class="common-ipt"></span>
              <span>年</span>
              <span class="common-ipt"></span>
              <span>月</span>
              <span class="common-ipt"></span>
              <span>日</span>
            </div>
          </div>
        </ElScrollbar>

        <div class="agm-nav">
          <div class="toc-box">
            <div
              v-for="(item, index) in navList"
              :key="item.id"
              :class="['toc-item', item.id === activeIndex ? 'active' : '']"
              @click="jump(index)"
            >
              <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElScrollbar } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'

interface NavType {
  id: number
  name: string
  active: boolean
}

const navList = ref<NavType[]>([
  {
    id: 0,
    name: '第一条 基础信息',
    active: false
  },
  {
    id: 1,
    name: '第二条 安置方式',
    active: false
  },
  {
    id: 2,
    name: '第三条 安置房',
    active: false
  },
  {
    id: 3,
    name: '第四条 补偿费、补助费及奖励费',
    active: false
  },
  {
    id: 4,
    name: '第五条 安置房房款结算及交付',
    active: false
  },
  {
    id: 5,
    name: '第六条',
    active: false
  },
  {
    id: 6,
    name: '第七条',
    active: false
  },
  {
    id: 7,
    name: '第八条',
    active: false
  },
  {
    id: 8,
    name: '第九条',
    active: false
  },
  {
    id: 9,
    name: '第十条',
    active: false
  },
  {
    id: 10,
    name: '第十一条',
    active: false
  }
])

const tableData = ref([
  {
    name: '李财',
    card: '332621196607161178',
    info: '农业随迁'
  },
  {
    name: '顾金娥',
    card: '33262119400831118X',
    info: '非农随迁'
  },
  {
    name: '程聪颖',
    card: '331082199109031269',
    info: '农业随迁'
  }
])

const tableData2 = ref([
  {
    name: '章三',
    card: '234222244589976',
    resettlementType: '集中安置'
  },
  {
    name: '里斯',
    card: '987433274389923',
    resettlementType: '分散安置'
  }
])

const activeIndex = ref(0)
const contentLocation = ref<any[]>([])
const scrollRef = ref()

onMounted(() => {
  const floors = document.querySelectorAll('.floor-item')
  const arr: any[] = []
  floors.forEach((floor: any, index: number) => {
    if (index === 0) {
      arr.push(0)
    } else if (index === 1) {
      arr.push(floor.offsetTop + 130)
    } else {
      arr.push(floor.offsetTop + 220)
    }
  })
  contentLocation.value = arr
})

const jump = (index) => {
  // 左侧导航点击
  let total: number = contentLocation.value[index]
  nextTick(() => {
    activeIndex.value = index
    scrollRef.value.setScrollTop(total)
  })
}

// 内容部分滚动事件
const listenScroll = (scrollTop) => {
  console.log('scrollTop:', scrollTop)
  contentLocation.value.forEach((el, index) => {
    if (scrollTop === 0) {
      activeIndex.value = 0
    } else if (scrollTop >= el) {
      activeIndex.value = index + 1
    }
  })
}

const scroll = ({ scrollTop }) => {
  console.log('scrollTop:', scrollTop)
  listenScroll(scrollTop)
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
