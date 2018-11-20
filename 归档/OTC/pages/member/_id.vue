<template>
  <section class="user-info"
           v-loading="loading">
    <section class="user-info-card">
      <div class="user-info-card-top">
        <dl>
          <Avatar style="margin-right:20px;"
                  v-if="!!otcUserInfo && otcUserInfo[this.$route.params.id] && otcUserInfo[this.$route.params.id].nickname"
                  :name="otcUserInfo[this.$route.params.id].nickname|firstUpperChar"
                  :online="!!otcUserInfo && otcUserInfo[this.$route.params.id] && otcUserInfo[this.$route.params.id].onLineStatus === 1"
                  :id="this.$route.params.id" />
          <Avatar style="margin-right:20px;"
                  v-else
                  :online="!!otcUserInfo && otcUserInfo[this.$route.params.id] && otcUserInfo[this.$route.params.id].onLineStatus === 1"
                  :name="String(this.$route.params.id)|firstUpperChar" />
        </dl>
        <dl class="user-name"
            v-if="!!otcUserInfo && otcUserInfo[this.$route.params.id] && otcUserInfo[this.$route.params.id].nickname">{{otcUserInfo[this.$route.params.id].nickname}}</dl>
        <dl class="user-name"
            v-else>{{this.$route.params.id}}</dl>
        <dl>
          <dt>{{!!otcUserInfo && otcUserInfo[this.$route.params.id] && otcUserInfo[this.$route.params.id].finishRateStr||'0%'}}</dt>
          <dd>{{UserInfo.tradeInfo[0]}}</dd>
        </dl>
        <dl>
          <dt>{{!!otcUserInfo && otcUserInfo[this.$route.params.id] && otcUserInfo[this.$route.params.id].orderNo||0}}{{UserInfo.times}}</dt>
          <dd>{{UserInfo.tradeInfo[1]}}</dd>
        </dl>
        <dl>
          <dt>{{!!otcUserInfo && otcUserInfo[this.$route.params.id] && otcUserInfo[this.$route.params.id].dealInThirty||0}}{{UserInfo.times}}</dt>
          <dd>{{UserInfo.tradeInfo[2]}}</dd>
        </dl>
        <dl>
          <dt>{{!!otcUserInfo && otcUserInfo[this.$route.params.id] && otcUserInfo[this.$route.params.id].appealTimes||0}}{{UserInfo.times}}</dt>
          <dd>{{UserInfo.tradeInfo[3]}}</dd>
        </dl>
        <dl>
          <dt>{{!!otcUserInfo && otcUserInfo[this.$route.params.id] && otcUserInfo[this.$route.params.id].appealSuccess||0}}{{UserInfo.times}}</dt>
          <dd>{{UserInfo.tradeInfo[4]}}</dd>
        </dl>
        <dl>
          <dt>{{!!otcUserInfo && otcUserInfo[this.$route.params.id] && otcUserInfo[this.$route.params.id].avgPassMin||0}}{{UserInfo.minute}}</dt>
          <dd>{{UserInfo.tradeInfo[5]}}</dd>
        </dl>
      </div>
      <div class="user-info-card-bottom">
        <dl>{{UserInfo.resDate}}：{{otcUserInfo && otcUserInfo[this.$route.params.id] && otcUserInfo[this.$route.params.id].registerTime|dubaiDate}}</dl>
        <div>
          <span>{{UserInfo.authType[0]}}</span>
          <i class="iconfont icon-weixuanzhong icon-on"
             v-if="!!bindStatus.emailBind" />
          <i class="iconfont icon-weixuanzhong icon-off"
             v-else />
        </div>
        <!-- <div>
          <span>{{UserInfo.authType[1]}}</span>
          <i class="iconfont icon-weixuanzhong icon-on"
             v-if="!!bindStatus.phoneBind" />
          <i class="iconfont icon-weixuanzhong icon-off"
             v-else />
        </div> -->
        <div>
          <span>{{UserInfo.authType[2]}}</span>
          <i class="iconfont icon-weixuanzhong icon-on"
             v-if="!!bindStatus.kycC1State" />
          <i class="iconfont icon-weixuanzhong icon-off"
             v-else />
        </div>
        <div>
          <span>{{UserInfo.authType[3]}}</span>
          <i class="iconfont icon-weixuanzhong icon-on"
             v-if="!!bindStatus.kycC2State" />
          <i class="iconfont icon-weixuanzhong icon-off"
             v-else />
        </div>
      </div>
    </section>
    <!-- 在售广告 -->
    <section class="user-sell-card">
      <article>{{UserInfo.onSale}}</article>
      <MemberAdItem :listData="sellAdList"
                    :shielding="shielding" />
    </section>
    <!-- 在购广告 -->
    <section class="user-buy-card">
      <article>{{UserInfo.inPurchase}}</article>
      <MemberAdItem :listData="buyAdList"
                    :shielding="shielding" />
    </section>
    <section class="drop-member"
             v-if="shielding">
      <span>{{UserInfo.dropTxt[0]}}</span>
      <u @click="cancelShielding">{{UserInfo.dropTxt[1]}}</u>
    </section>
    <section class="drop-member"
             v-else>
      <span>{{UserInfo.information}}</span>
      <u @click="confirmShielding">{{UserInfo.shield}}</u>
    </section>
  </section>
</template>

<script>
/* eslint-disable */
/** 个人信息页 **/
import { mapActions, mapState, mapMutations } from 'vuex';
import * as Dict from '~/store/dict';
import * as memberType from '~/store/modules/member/type';
import * as adType from '~/store/modules/ad/type';
import MemberAdItem from '~/components/Member/MemberAdItem.vue';
import Avatar from '~/components/Avatar.vue';

export default {
  components: {
    MemberAdItem,
    Avatar,
  },
  data() {
    return {
      buyTest: [
        {
          stock: 1000,
          id: 123124,
          payAsset: 'USD',
          tradeAsset: 'BTC',
          unitPrice: 90000,
          limitMin: 100,
          limitMax: 10000,
          payMethodList: [100, 101, 102],
        },
      ],
      loading: true, // 页面loading
    };
  },

  filters: {
    firstUpperChar(str) {
      if (!!str) {
        str = String.trim(str);
        return str.substr(0, 1).toUpperCase();
      }
      return '';
    },
  },

  // async created() {
  //   await this.getNickNameByUserId({ userId: this.$route.params.id });
  //   await this.getOtcUserInfoByUserId({ userId: this.$route.params.id });
  //   await this.getUserBindInfo({ userId: this.$route.params.id });
  //   await this.getAdList({ userId: this.$route.params.id });
  //   await this.checkDefriend({
  //     defrindID: this.$route.params.id,
  //   });
  // },
  async mounted() {
    this.getNickNameByUserId({ userId: this.$route.params.id });
    let res = await this.getOtcUserInfoByUserId({ userId: this.$route.params.id });
    if (res && res.code !== 200) {
      this.$message.error(this.ErrCode[res.code] || `${res.code}`);
    }
    this.loading = false;
    this.getUserBindInfo({ userId: this.$route.params.id });
    await this.getAdList({ userId: this.$route.params.id });
    await this.checkDefriend({
      defrindID: this.$route.params.id,
    });
  },
  computed: {
    ...mapState({
      UserInfo: state => state.i18n.App.UserInfo,
      ErrCode: state => state.i18n.App.ErrCode,
      nickName: state => state.member.nickName,
      otcUserInfo: state => state.member.otcUserInfo,
      bindStatus: state => state.member.userBindInfo,
      sellAdList: state => state.ad.memberSellAdList,
      buyAdList: state => state.ad.memberBuyAdList,
      addDefriendResult: state => state.member.addDefriend,
      removeDefriendResult: state => state.member.removeDefriend,
      checkDefriendResult: state => state.member.checkDefriend,
    }),
    //是否屏蔽
    shielding() {
      if (this.checkDefriendResult.defStatus === Dict.DEF_STATUS_ENABLED) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapMutations([]),
    ...mapActions({
      getNickNameByUserId: memberType.GET_NICKNAME_ACTIONS,
      getOtcUserInfoByUserId: memberType.GET_OTC_USER_INFO_ACTIONS,
      getUserBindInfo: memberType.GET_USER_BIND_INFO_ACTIONS,
      getAdList: adType.AD_GET_AdLIST_ACTIONS,
      addDefriend: memberType.ADD_DEFRIEND_ACTIONS,
      removeDefriend: memberType.REMOVE_DEFRIEND_ACTIONS,
      checkDefriend: memberType.CHECK_DEFRIEND_ACTIONS,
    }),
    async cancelShielding() {
      await this.removeDefriend({
        defrindID: this.$route.params.id,
      });
      await this.checkDefriend({
        defrindID: this.$route.params.id,
      });
    },
    confirmShielding() {
      this.$confirm(this.UserInfo.confirmTxt)
        .then(async _ => {
          await this.addDefriend({
            defrindID: this.$route.params.id,
            defrindName: this.otcUserInfo[this.$route.params.id].nickname, //被拉黑用户昵称
            nickName: this.nickName, //用户昵称
          });
          await this.checkDefriend({
            defrindID: this.$route.params.id,
          });
        })
        .catch(_ => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  padding-top: 58px;
  // height: 1170px;
  margin-bottom: 170px;
  font-family: PingFangSC-Medium;

  .user-info-card {
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(39, 34, 58, 0.04), 0 2px 8px 0 rgba(25, 16, 54, 0.1);
    border-radius: 2px;
    width: 1180px;
    height: 154px;
    margin: 0 auto;
    margin-top: 30px;
    .user-info-card-top {
      width: 1129px;
      height: 90px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 0 auto;
      border-bottom: 2px solid #f6f6f9;
      .user-name {
        font-size: 16px;
        color: #354989;
        margin-right: 230px;
        flex: 1;
      }
      dl {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      dl:nth-child(n + 3) {
        margin-left: 15px;
      }
      dt {
        font-size: 14px;
        line-height: 14px;
        color: #354989;
        min-width: 60px;
        height: 14px;
        text-align: center;
      }
      dd {
        line-height: 12px;
        font-size: 12px;
        color: #a8afcd;
        min-width: 60px;
        height: 12px;
        text-align: center;
        margin-top: 8px;
      }
    }
    .user-info-card-bottom {
      width: 1129px;
      height: 60px;
      display: flex;
      align-items: center;
      margin: 0 auto;

      dl {
        flex: auto;
        font-size: 12px;
        color: #a8afcd;
        letter-spacing: 0;
        line-height: 12px;
      }
      & > div {
        flex: none;
        font-size: 12px;
        color: #354989;
        display: flex;
        align-items: center;
        margin-left: 20px;
        i {
          margin-left: 3px;
          font-size: 12px;
        }
      }
      .icon-off {
        color: #dcdce6;
      }
      .icon-on {
        color: #6aa0ff;
      }
    }
  }
  .user-sell-card {
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(39, 34, 58, 0.04), 0 2px 8px 0 rgba(25, 16, 54, 0.1);
    border-radius: 2px;
    width: 1180px;
    // height:372px;
    min-height: 172px;
    margin: 0 auto;
    margin-top: 30px;
    article {
      font-size: 18px;
      color: #354989;
      letter-spacing: 0;
      line-height: 18px;
      margin: 0px 0px 24px 28px;
      padding-top: 30px;
    }
  }
  .user-buy-card {
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(39, 34, 58, 0.04), 0 2px 8px 0 rgba(25, 16, 54, 0.1);
    border-radius: 2px;
    width: 1180px;
    // height:372px;
    min-height: 172px;
    margin: 0 auto;
    margin-top: 30px;
    article {
      font-size: 18px;
      color: #354989;
      letter-spacing: 0;
      line-height: 18px;
      margin: 0px 0px 24px 28px;
      padding-top: 30px;
    }
  }
  .bottom-line {
    &:last-of-type {
      border-bottom: 0px !important;
    }
  }
  .drop-member {
    width: 1180px;
    margin: 0 auto;
    margin-top: 30px;
    text-align: right;
    span {
      font-size: 12px;
      color: #a8afcd;
    }
    u {
      font-size: 12px;
      color: #354989;
      cursor: pointer;
    }
  }
}
</style>
