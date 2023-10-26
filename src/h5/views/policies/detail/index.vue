<template>
  <div class="flex-col app-container">
    <!-- <div class="flex-col flex-auto group-policies-detail">
      <div class="section">
        <div class="section-title">享受主体</div>
        <div class="section-content">
          参加企业职工失业保险的城乡劳动者或与企业签订6个月以上劳动合同的在岗职工、农村转移就业劳动者、城乡未继续升学的初高中毕业生、失业人员、退役军人、就业困难人员（含残疾人）、有职业技能等级培训和认定需求的高校毕业生。</div
        >
      </div>
      <div class="section">
        <div class="section-title">政策内容</div>
        <div class="section-content">
          1.高技能人才
          (技师、高级技师)培训、岗位技能提升培训、专项职业能力培训、项目制培训、创业培训和其他主管部门开展的职业技能培训；
          2.非职业类高校毕业班学生参加经人力社保部门同意的职业技能培训； 3.开展新型学徒制培训；
          4.开展职业技能等级培训；</div
        >
      </div>
      <div class="section">
        <div class="section-title">享受条件</div>
        <div class="section-content"> 无 </div>
      </div>
      <div class="section">
        <div class="section-title">政策依据</div>
        <div class="file-field">
          <ElImage :src="iconPaperClipSrc" class="file-image" />
          <span class="section-file">绍市人社发〔2022〕22号</span>
        </div>
        <div class="file-field">
          <ElImage :src="iconPaperClipSrc" class="file-image" />
          <span class="section-file">绍市人社办发〔2019〕23号</span>
        </div>
        <div class="file-field">
          <ElImage :src="iconPaperClipSrc" class="file-image" />
          <span class="section-file">浙人社发〔2019〕40号</span>
        </div>
      </div>
      <div class="section">
        <div class="section-title">受理级别及部门</div>
        <div class="section-content"> 市人社局及各区、县市人社局 </div>
      </div>
      <div class="section">
        <div class="section-title">受理移动端应用</div>
        <div class="section-content"> 无 </div>
      </div>
      <div class="section">
        <div class="section-title">联系人及联系方式</div>
        <div class="section-content">
          市级：81505322 越城区：88300250 柯桥区：84126758/85686136 上虞区：82133012
          嵊州市：83126216 新昌县：86229808 诸暨市：89075670
        </div>
      </div>
    </div> -->
    <div v-html="dataList.title" style="text-align: center"></div>
    <div v-html="dataList.content"></div>
  </div>
</template>
<script lang="ts" setup>
// import { ElImage } from 'element-plus'
// import iconPaperClipSrc from '@/h5/assets/imgs/icon_paper_clip.png'
import { getPolicyLawId } from '../service'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
let Route = useRoute()
let dataList: any = ref({})
let getPolicyLawIds = async () => {
  let data = await getPolicyLawId(Route.query.id)
  console.log(data)
  dataList.value = data
  return data
}
onMounted(() => {
  getPolicyLawIds()
})
</script>

<style lang="less" scoped>
.group-policies-detail {
  padding: 24px 30px;
  background-color: #fff;

  .section {
    margin-bottom: 32px;

    .section-title {
      font-size: 30px;
      font-weight: 500;
      line-height: 42px;
      color: #171718;

      &::before {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 8px;
        background-color: #3e73ec;
        content: '';
      }
    }

    .section-content {
      padding: 10px;
      font-size: 28px;
      font-weight: 400;
      line-height: 40px;
      color: #666666;
    }

    .file-field {
      display: flex;
      align-items: center;

      .file-image {
        width: 24px;
        height: 24px;
      }

      .section-file {
        padding-left: 15px;
        overflow: hidden;
        font-size: 28px;
        font-weight: 400;
        line-height: 39px;
        color: #3e73ec;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
