<template>
  <div class="flex-col page">
    <div class="flex-col flex-auto section-mine">
      <div class="flex-col group-header">
        <div class="flex-row section">
          <div class="flex-col justify-start items-center self-start image-wrapper">
            <img
              class="image-avatar"
              :src="
                nameDta.otherPic
                  ? JSON.parse(nameDta.otherPic)[0].url
                  : 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/64e83d955a7e3f0310414dfe/64e842454d98100011acce52/16929431142229801130.png'
              "
            />
          </div>
          <div class="flex-col flex-auto user-info">
            <div class="flex-row items-center">
              <span class="name-txt">{{ nameDta.name }}</span>
              <div class="flex-row items-center section-door">
                <img class="section-door-field" :src="doorImgSrc" />
                <div class="section-door-txt">
                  <span class="special">户号：</span>
                  <span class="special bold-txt">{{ nameDta.doorNo }}</span>
                </div>
              </div>
            </div>
            <div class="flex-row items-center self-start location-field">
              <img class="location-icon" :src="locationSrc" />
              <span class="location-txt">{{ nameDta.address }}</span>
            </div>
            <div class="flex-row items-center self-start location-field">
              <img class="location-icon" :src="mobileSrc" />
              <span class="location-txt">{{ nameDta.phone }}</span>
            </div>
          </div>
        </div>
        <div class="flex-col relative section-mine-list">
          <!-- <div class="flex-row justify-between list-item" @click="onClickItem(0)">
            <div class="flex-row items-center">
              <img class="label-icon" :src="fileSrc" />
              <span class="label-txt">档案资料</span>
            </div>
            <img class="label-icon" :src="rightSrc" />
          </div> -->
          <div class="flex-row justify-between list-item" @click="onClickItem(1)">
            <div class="flex-row items-center">
              <img class="label-icon" :src="memberSrc" />
              <span class="label-txt">家庭成员</span>
            </div>
            <img class="label-icon" :src="rightSrc" />
          </div>
          <div class="flex-row justify-between list-item" @click="onClickItem(2)">
            <div class="flex-row items-center">
              <img class="label-icon" :src="phoneSrc" />
              <span class="label-txt">修改手机号码</span>
            </div>
            <img class="label-icon" :src="rightSrc" />
          </div>
          <div class="flex-row justify-between list-item" @click="onClickItem(3)">
            <div class="flex-row items-center">
              <img class="label-icon" :src="memberSrc" />
              <span class="label-txt">手机号绑定</span>
            </div>
            <img class="label-icon" :src="rightSrc" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import doorImgSrc from '@/h5/assets/imgs/icon_door.png'
import locationSrc from '@/h5/assets/imgs/icon_location.png'
import mobileSrc from '@/h5/assets/imgs/icon_mobile.png'
import rightSrc from '@/h5/assets/imgs/icon_right.png'
import memberSrc from '@/h5/assets/imgs/icon_member.png'
import phoneSrc from '@/h5/assets/imgs/icon_phone.png'
import fileSrc from '@/h5/assets/imgs/icon_file.png'
import { useRouter } from 'vue-router'
import { getPersonalInformation } from './service'
import { ref, onMounted } from 'vue'
const { push } = useRouter()

const toTargetByIndex = (index: number) => {
  const map = {
    0: '/',
    1: '/familyMember',
    2: '/modifyPhoneNumber',
    3: '/bindPhone'
  }
  return map[index]
}
let nameDta: any = ref({})
const onClickItem = (index) => {
  push({ path: toTargetByIndex(index) })
  console.log('index', index)
}
let getPersonalInformations = async () => {
  let data = await getPersonalInformation()
  console.log(JSON.parse(data.otherPic)[0].url)
  nameDta.value = data
}
onMounted(() => {
  getPersonalInformations()
})
</script>

<style lang="less" scoped>
.page {
  position: absolute;
  top: 75px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #f2f6ff;

  .section-mine {
    overflow-y: auto;

    .group-header {
      .section {
        height: 374px;
        padding: 58px 18px 65px;
        background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/64e83d955a7e3f0310414dfe/64e842454d98100011acce52/16929431140442759331.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;

        .image-wrapper {
          width: 128px;
          height: 128px;
          padding-top: 6px;
          overflow: hidden;
          background-color: #f2f6fc;
          border: solid 2px #ffffff;
          border-radius: 50%;
          filter: drop-shadow(0px 0px 6.5px #0000000d);

          .image-avatar {
            width: 128px;
            height: 128px;
          }
        }

        .user-info {
          padding-top: 10px;
          padding-left: 20px;
        }

        .name-txt {
          font-size: 36px;
          font-weight: 700;
          line-height: 16.5px;
          color: #ffffff;
        }

        .section-door {
          height: 44px;
          padding: 0 15px;
          margin-left: 12px;
          line-height: 44px;
          background-color: #ffffffcc;
          border: solid 1px #ffffff6b;
          border-radius: 24px;
          border-image-slice: 1;

          .section-door-field {
            width: 28px;
            height: 28px;
            border-radius: 26px;
          }

          .section-door-txt {
            display: flex;
            padding: 0 16px;
            align-items: center;
            justify-content: center;

            .special {
              font-size: 24px;
              color: #3e73ec;

              &.bold-txt {
                font-weight: 700;
              }
            }
          }
        }

        .location-field {
          margin-top: 10px;
          border-radius: 37px;

          .location-icon {
            width: 28px;
            height: 28px;
            flex-shrink: 0;
          }

          .location-txt {
            margin-left: 10px;
            font-size: 24px;
            font-weight: 500;
            color: #ffffff;
          }

          .text_5 {
            color: #ffffff;
          }

          .text_6 {
            margin: 0 6px;
            font-family: PingFang SC;
            font-size: 12px;
            line-height: 9px;
            color: #ffffff;
          }
        }
      }

      .section-mine-list {
        margin: -126px 30px 0;
        overflow: hidden;
        background-color: #ffffff;
        border-radius: 16px;
        filter: drop-shadow(0px 4px 2.5px #0000000a);

        .list-item {
          height: 96px;
          padding: 28px 32px;
          background-color: #ffffff;
          border-bottom: 1px solid #eee;
        }
      }

      .label-icon {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
      }

      .label-txt {
        margin-left: 20px;
        font-size: 30px;
        line-height: 30px;
        color: #131313;
      }
    }
  }
}
</style>
