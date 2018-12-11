<template>
  <div class="invitation-content">
    <div class="invitation-head">
      <div class="title">
        {{Invitation.myInvitationCode}}
      </div>
      <div class="invitation-head-body">
        <div class="group">
          <div class="font">{{Invitation.InvitationLink}}</div>
          <div class="input">
            <el-input suffix-icon="iconfont icon-erweima"
                      :value="link"
                      disabled>
            </el-input>
            <div class="qr-btn">
              <qrcode-vue :value="link"
                          :size="80"
                          level="H"
                          class="QRcode" />
            </div>
            <el-button type="primary"
                       @click="handleCopy(link)">
              {{Invitation.copy}}
            </el-button>
          </div>
        </div>
        <div class="group group-code">
          <div class="font">{{Invitation.InvitationCode}}</div>
          <div class="input-code input">
            <el-input :value="invit.invitCode"
                      disabled>
              <label slot="suffix"
                     @click="handleCopy(invit.invitCode)">{{Invitation.copy}}</label>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="invitation-body">
      <div class="tab">
        <div class="tab-content"
             :class="{'active': type === 'invited'}"
             @click="buttonClick('invited')">{{Invitation.InviteHistory}}</div>
        <div class="tab-content"
             :class="{'active': type === 'cashback'}"
             @click="buttonClick('cashback')">{{Invitation.RewardHistory}}</div>
      </div>
      <div class="Table">
        <el-table :data="list"
                  :empty-text="i18n.App.AccountDetail.emptyData"
                  v-if="type === 'invited'"
                  style="width: 100%">
          <el-table-column prop="userName"
                           :label="Invitation.UserName"
                           width="180">
          </el-table-column>
          <el-table-column :label="Invitation.RegistrationTime"
                           width="180">
            <template slot-scope="scope">
              {{scope.row.registerTime |dubaiDate('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column align="right"
                           :label="Invitation.status">
            <template slot-scope="scope">
              {{Invitation.statusList[scope.row.status]}}
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="list"
                  :empty-text="i18n.App.AccountDetail.emptyData"
                  v-if="type === 'cashback'"
                  style="width: 100%">
          <el-table-column prop="userName"
                           :label="Invitation.UserName"
                           width="180">
          </el-table-column>
          <el-table-column :label="Invitation.ReleaseTime"
                           width="180">
            <template slot-scope="scope">
              {{scope.row.createTime |dubaiDate('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column :label="Invitation.status">
            <template slot-scope="scope">
              {{Invitation.rewardstatus[scope.row.status]}}
            </template>
          </el-table-column>
          <el-table-column :label="Invitation.type">
            <template slot-scope="scope">
              {{Invitation.rewardMethod[scope.row.rewardMethod]}}
            </template>
          </el-table-column>
          <el-table-column align="right"
                           :label="Invitation.amount">
            <template slot-scope="scope">
              {{scope.row.amount}}
              {{scope.row.assetType}}
            </template>
          </el-table-column>
        </el-table>
        <div class="table-page"
             v-if="list && list.length > 0">
          <el-pagination @current-change="onChangePage"
                         background
                         layout="prev, pager, next"
                         :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="invitation-footer">
      <div class="title"><i class="icon iconfont icon-yiwen"></i> Activity Details</div>
      <div>
        <ul>
          <li>1. After the friend accepts the invitation, each time a real transaction fee is generated, a corresponding proportion of rebates will be generated.</li>
          <li>2. The form of rebate will be returned to your trading account in the form of USDT or point card. The return rate of USDT is 30%, and the rebate rate of point card is 30%.</li>
          <li>3. When the invitee uses the point card transaction, the commission actually obtained by the inviter will be calculated by the equivalent amount of points and returned to the inviter. When the invitee uses the non-dot card transaction, the commission actually obtained by the inviter will be executed by USDT. The calculation is converted back to the inviter.</li>
          <li>4. The friend trades the rebate on the day of the statistics, the next day to arrive at the account; the rebate amount (USDT or point card) = the actual transaction volume * the fee ratio * the commission ratio.</li>
          <li>5. Inviting people to enjoy the loyalty of the loyalty to the loyalty of the loyalty of the singer. The effective time of the inviting person to start the registration is calculated. After the effective time (90 days), you will not be entitled to the commission of the inviting transaction.</li>
          <li>6. The platform will take the market price every 5 minutes to calculate the USDT real-time conversion of the corresponding currency. The rebate amount is subject to the actual rebate amount.</li>
          <li>7. Monthly monthly list can only see the data of last month.</li>
          <li>8. The daily settlement time is: 0:00 payment time is 10 o'clock before the next day</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import { GET_INVIT, QUERYINVITEE, QUERYINVITEEREWARD } from '~/store/modules/user/type';
import copy from 'copy-to-clipboard';
import { relativeTimeThreshold } from 'moment';
import Configs from '~/common/config';
export default {
  components: {
    QrcodeVue,
  },

  data() {
    return {
      actions: new Map([
        [
          'invited',
          async () => {
            let res = await this.queryInvitee(this.pagination);
            this.list = res.data.list;
            this.total = res.data.total;
          },
        ],
        [
          'cashback',
          async () => {
            let res = await this.queryInviteReward(this.pagination);
            this.list = res.data.list;
            this.total = res.data.total;
          },
        ],
      ]),
      type: 'invited',
      list: [],
      total: 0,
      pagination: {
        pageNo: 1,
        pageSize: 10,
      },
    };
  },
  async mounted() {
    await this.getInvit();
    const actions = () => {
      return new Map([
        [
          { rewardCount: 1 },
          () => {
            this.$tlmessage.show({
              text: this.Invitation.message,
              title: this.Address.tips,
              okText: this.ForgotPassword.button,
              cancelText: this.Address.cancelText,
              onOk: () => {
                this.tabState('security');
                this.$router.push({ path: '/u', query: { section: 'security' } });
              },
            });
          },
        ],
        [
          { rewardCount: 2 },
          () => {
            this.$tlmessage.show({
              text: this.Invitation.message,
              title: this.Address.tips,
              okText: this.ForgotPassword.button,
              cancelText: this.Address.cancelText,
              onOk: () => {
                this.tabState('security');
                this.$router.push({ path: '/u', query: { section: 'security' } });
              },
            });
          },
        ],
      ]);
    };
    let action = [...actions()].filter(([key, value]) => key.rewardCount === this.invit.rewardCount);
    action.forEach(([key, value]) => value.call(this));
    this.getList();
  },
  computed: {
    ...mapState({
      i18n: state => state.i18n,
      invit: state => state.user.invit,
      Recharge: state => state.i18n.App.Recharge,
      Invitation: state => state.i18n.App.Invitation,
      Address: state => state.i18n.App.Address,
      ForgotPassword: state => state.i18n.App.ForgotPassword,
    }),
    link() {
      // debugger;
      return !!this.invit && `${Configs.DEFAULT.RB}/u/register?code=${this.invit.invitCode}`;
    },
  },
  methods: {
    ...mapMutations(['tabState']),
    ...mapActions({
      getInvit: GET_INVIT,
      queryInvitee: QUERYINVITEE,
      queryInviteReward: QUERYINVITEEREWARD,
    }),
    buttonClick(key) {
      this.type = key;
      this.pagination.pageNo = 1;
      this.getList();
    },
    getList() {
      let action = this.actions.get(`${this.type}`);
      action.call(this);
    },
    handleCopy(val) {
      if (!val) return;
      copy(val);
      this.$message.success(this.Recharge.copyMes);
    },
    onChangePage(page) {
      this.pagination.pageNo = page;
      this.getList();
    },
  },
};
</script>

<style lang="scss">
.invitation-content {
  flex: 1;
  margin-left: 20px;
  .invitation-head {
    background: #ffffff;
    border-radius: 2px;
    height: 180px;
    padding: 22px 26px 34px 26px;
    .title {
      font-weight: 500;
      font-size: 18px;
      color: #354989;
      margin-left: 4px;
    }
    .invitation-head-body {
      margin-top: 32px;
      display: flex;
      .group-code {
        margin-left: 72px;
      }
      .group {
        .font {
          font-size: 14px;
          color: #7d86ac;
        }
        .input-code {
          width: 240px !important;
        }
        .input {
          margin-top: 12px;
          position: relative;
          display: flex;
          width: 546px;
          .qr-btn {
            position: absolute;
            width: 40px;
            height: 100%;
            right: 95px;
            top: 0px;
            display: flex;
            align-items: center;
            .QRcode {
              width: 100%;
              height: 100%;
              display: flex;
              position: absolute;
              top: -85px;
              right: 20px;
              display: none;
            }
            &::after {
              content: '';
              width: 1px;
              height: 16px;
              border-right: 1px solid #e9ecf4;
            }
            &:hover {
              .QRcode {
                display: block;
              }
            }
          }
        }
      }
    }
  }
  .invitation-body {
    background: #ffffff;
    border-radius: 2px;
    margin-top: 20px;
    padding: 22px 8px 33px 8px;
    .tab {
      display: flex;
      margin-left: 18px;
      .tab-content {
        font-weight: 500;
        font-size: 16px;
        color: #7d86ac;
        margin-bottom: 22px;
        cursor: pointer;
        &:nth-child(2) {
          margin-left: 42px;
        }
      }
      .active {
        color: #6aa0ff;
        border-bottom: 2px solid #6aa0ff;
        padding-bottom: 10px;
      }
    }
  }
  .invitation-footer {
    background: #ffffff;
    border-radius: 2px;
    height: 383px;
    margin-top: 20px;
    padding: 22px 26px 24px 26px;
    .title {
      font-size: 14px;
      color: #354989;
      font-weight: 500;
      i {
        color: #6aa0ff;
      }
    }
    ul {
      margin-top: 12px;
      font-size: 12px;
      li {
        margin-top: 10px;
        color: #354989;
      }
    }
  }
  .el-input {
    width: 450px;
    font-size: 14px;
    color: #354989;
  }
  .el-input.is-disabled .el-input__inner {
    background: #f5f9ff;
    border: 1px solid #e9ecf4;
    border-radius: 0;
    color: #354989;
  }
  .el-button {
    background: #6aa0ff;
    padding: 12px 28px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 0px 2px 2px 0px;
  }
  .el-input__suffix {
    align-items: center;
    display: flex;
    font-size: 14px;
    color: #6aa0ff;
    i {
      color: #7d86ac;
    }
    label {
      margin-right: 20px;
      cursor: pointer;
    }
  }
  .Table {
    .table-page {
      text-align: right;
      margin-top: 20px;
    }
    .el-table {
      .address-copy {
        color: #5693ff;
        margin-left: 15px;
        cursor: pointer;
      } // .el-table__expanded-cell {
      //   border-bottom: 0;
      // }
      .detail-title {
        width: 60px;
        font-size: 12px;
        color: #7d86ac;
        margin-right: 94px;
        display: inline-block;
        margin-left: 30px;
      }
      .detail-content {
        font-size: 12px;
        color: #354989;
        display: inline-block;
      }
      .el-table__header-wrapper {
        background-color: #f6f8fd;
        padding: 0 32px;
        & th {
          & > .cell {
            font-size: 12px;
            color: #7d86ac;
            font-weight: 400;
          }
        }
      }
      .el-table__body-wrapper {
        padding: 0 32px;
        color: #354989;
      }
      & th.is-leaf {
        border-bottom: 0;
      }
      & th {
        padding: 10px 0;
        font-size: 12px;
        color: #a9abb7;
        background-color: #f6f8fd;
        & > .cell {
          line-height: 20px;
          word-break: break-word;
        }
      }
      & td {
        padding: 14px 0;
        font-size: 14px;
        & > .cell {
          line-height: 20px;
          word-break: break-word;

          a {
            &:first-child {
              margin-left: 0;
            }
            margin-left: 21px;
          }
        }
      }
      .el-table__body,
      .el-table__footer,
      .el-table__header {
        table-layout: auto;
        width: 100% !important;
      }
      .el-table__empty-block {
        width: 100% !important;
      }
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #fff;
    }
  }
}
</style>
