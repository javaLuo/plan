<template>
  <div class="panel-address">
    <el-form class="p-add">
      <div class="panel-ads-header df jcsb">
        <h4>{{i18n.App.WithDraw.addAddress}}</h4>
        <span @click="toWithdraw()">{{i18n.App.AccountDetail.Withdraw}}({{assets.onCoin}})</span>
        <!-- <div class="l">{{i18n.App.WithDraw.addAddress}}</div>
        <div class="r">
          <el-button type="text"
                     @click="toWithdraw()">{{i18n.App.AccountDetail.Withdraw}}({{assets.onCoin}})</el-button>
        </div> -->
      </div>

      <div class="b df jcsb">
        <div class="i coin">
          <div class="u">
            {{i18n.App.WithDraw.coin}}
          </div>
          <div class="m">
            <SelectServiceFee style="width:172px" />
          </div>
        </div>
        <div class="i">
          <div class="u">
            <!-- Withdraw Address -->
          </div>
          <div class="d">
            <el-form-item :label="i18n.App.WithDraw.withdraw_address"
                          prop="address">
              <el-input @input="onInputAddress()"
                        style="width:324px"
                        v-model="address.value"></el-input>
              <div class="tip"
                   v-if="form.address.dirty && !form.address.require.valid">
                {{i18n.App.Address.address_req}}
              </div>
            </el-form-item>

          </div>
        </div>
        <div class="i">
          <div class="u">
            <!-- Note -->
          </div>
          <div class="d">
            <el-form-item :label="i18n.App.AccountDetail.remark"
                          prop="note">
              <el-input @input="onInputNote()"
                        style="width:324px"
                        v-model="note.value"></el-input>
              <div class="tip"
                   v-if="form.note.dirty && !form.note.require.valid">
                {{i18n.App.Address.remarks}}
              </div>
            </el-form-item>

          </div>
        </div>
      </div>

      <div class="add-btn">
        <el-button :disabled="!form.valid"
                   :style="{width:'180px'}"
                   type="primary"
                   @click="submitForm()"
                   :loading="assets.saveWALoading">{{isEdit ? i18n.App.WithDraw.edit:i18n.App.WithDraw.add}}</el-button>
      </div>
    </el-form>

    <div class="p-lists">
      <div class="h df jcsb">
        <div class="l">{{i18n.App.WithDraw.tabTitle2}}</div>
        <div class="r">
        </div>
      </div>
      <div class="p-list-inner">
        <el-table :empty-text="i18n.App.AccountDetail.emptyData"
                  v-loading="loading"
                  height="325"
                  :data="addressLists"
                  style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left"
                       inline
                       class="assets-table-expand">
                <el-form-item :label="i18n.App.WithDraw.coin">
                  <span>{{ props.row.coin }}</span>
                </el-form-item>
                <el-form-item :label="i18n.App.WithDraw.withdraw_address">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
                <el-form-item :label="i18n.App.AccountDetail.remark">
                  <span>{{ props.row.remark }}</span>
                </el-form-item>
                <el-form-item :label="i18n.App.AccountDetail.Option">
                  <span>{{ props.row.action }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column :label="i18n.App.WithDraw.coin">
            <template slot-scope="scope">
              <i :class="`token-logo default-icon ${scope.row.coin}`"></i>
              <span>{{scope.row.coin}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="i18n.App.WithDraw.withdraw_address"
                           prop="address">
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.remark"
                           prop="remark">
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.Option"
                           width="120"
                           header-align='right'>
            <template slot-scope="scope">
              <div class="action df jcfe">
                <!-- //暂时没有 -->
                <!-- <el-button v-if="false"
                           type="text"
                           @click="onSave(scope.row)">{{i18n.App.WithDraw.edit}}</el-button> -->
                <a href="javascript:;"
                   @click="onDel(scope.row)"
                   class="delete-action">{{i18n.App.WithDraw.del}}</a>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div class="f"
           v-if="total">
        <el-pagination @current-change="onChangePage($event)"
                       :page-size="4"
                       background
                       layout="prev, pager, next"
                       :total="total * 4">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~assets/css/_theme-conf';

.panel-address {
  .p-add {
    padding: 22px;
    @include bgPair(background-color);
    .tip {
      color: #f56c6c;
      font-size: 12px;
    }
    .panel-ads-header {
      font-size: 18px;
      @include fontPair(color);
      margin-bottom: 24px;
      h4 {
        @include fontPair(color);
        font-weight: 500;
      }

      span {
        font-size: 14px;
        @include interactionPair(color);
      }
    }
    .b {
      margin-bottom: 24px;
      .i {
        &.coin {
          .u {
            height: 38px;
            line-height: 38px;
            @include subFontPair(color);
          }
          .d {
            color: #f56c6c;
            font-size: 12px;
            height: 12px;
            line-height: 12px;
            padding-top: 4px;
          }
        }
        & > .el-form-item__label {
          text-align: left !important;
        }
      }
    }

    .add-btn {
      text-align: right;
    }
  }
  .p-lists {
    @include bgPair(background-color);
    .h {
      padding: 22px 26px;
      margin-top: 20px;
      font-size: 18px;
      @include fontPair(color);
    }
    .f {
      padding: 22px;
    }
    .p-list-inner {
      margin: 0 8px;

      .action {
        text-align: right;
        .delete-action {
          @include interactionPair(color);
        }
      }
    }
  }
}
</style>

<script>
import SelectServiceFee from '../SelectServiceFee';
import WithdrawAddress from '../WithdrawAddress';
import InputSearch from '../InputSearch';
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';
export default {
  watch: {
    p() {},
    'assets.onCoin'() {
      this.validateOn(valid => {
        if (valid) {
          return true;
        } else {
          return false;
        }
      });
      this.initAddressLists({ p: 1 });
    },
  },
  components: {
    SelectServiceFee,
    WithdrawAddress,
    InputSearch,
  },
  data() {
    return {
      on: '',
      loading: false,
      isEdit: false,
      search: {
        val: '',
      },
      coin: {
        validate: true,
        value: '',
      },
      address: {
        value: '',
      },
      note: {
        value: '',
      },
      id: {
        value: '',
      },
      total: 0,
      // page size
      p: 1,
      form: {
        address: {
          valid: true,
          require: {
            valid: true,
          },
          dirty: false,
          markAsDirty() {
            this.dirty = true;
          },
        },
        note: {
          valid: true,
          require: {
            valid: true,
          },
          dirty: false,
          markAsDirty() {
            this.dirty = true;
          },
        },
        valid: false,
      },
    };
  },
  computed: {
    ...mapState(['assets', 'i18n']),
    addressLists() {
      return this.assets.addressLists;
    },
  },
  methods: {
    toWithdraw() {
      this.$router.push({ path: 'assets', query: { coin: this.assets.onCoin, type: 'withdraw' } });
    },
    onInputAddress() {
      // console.log(this.address.value);
      this.validateForm(v => {
        this.form.address.markAsDirty();
      });
    },
    onInputNote() {
      // console.log(this.note.value);
      this.validateForm(v => {
        this.form.note.markAsDirty();
      });
    },
    getFormState() {
      return {
        address: {
          valid: true,
          require: {
            valid: true,
          },
          dirty: false,
          markAsDirty() {
            this.dirty = true;
          },
        },
        note: {
          valid: true,
          require: {
            valid: true,
          },
          dirty: false,
          markAsDirty() {
            this.dirty = true;
          },
        },
        valid: false,
      };
    },
    validateForm(cb) {
      cb = cb || function() {};

      if (!!this.address.value) {
        this.form.address.require.valid = true;
      } else {
        this.form.address.require.valid = false;
      }
      //不需要必填 修改人Fred by-2018/11/08
      // if (!!this.note.value) {
      //   this.form.note.require.valid = true;
      // } else {
      //   this.form.note.require.valid = false;
      // }

      let valid = true;

      for (let key in this.form) {
        if (this.form[key] && this.form[key].hasOwnProperty('valid')) {
          const item = this.form[key];
          let itemValid = true;
          for (let k in item) {
            if (item[k] && item[k].hasOwnProperty('valid')) {
              valid = valid && item[k].valid;
              itemValid = itemValid && item[k].valid;
            }
          }
          this.form[key].valid = itemValid;
        }
      }

      this.form.valid = valid;

      cb(this.form);
    },
    onSearchCoin(val) {
      this.search.val = val;
    },
    validateOn(fn) {
      let b = false;
      if (!!this.assets.onCoin) {
        b = fn(true);
      } else {
        b = fn(false);
      }
      this.coin.validate = b;
    },
    async submitForm() {
      const res = await this.$store.dispatch('assets/saveWA', {
        address: this.address.value,
        alias: this.note.value,
        asset: this.assets.onCoin,
        id: this.id.value,
      });
      if (200 === res.code) {
        this.$message.success(this.i18n.App.Address.add_address_success);
        this.resetForm();
        await this.initAddressLists({ p: 1 });
      }
    },
    resetForm(formName) {
      this.address.value = '';
      this.note.value = '';
      this.id.value = '';
      this.form = this.getFormState();
    },
    async initAddressLists({ p }) {
      this.loading = true;
      const res = await this.$store.dispatch('assets/selectWA', {
        pageSize: 4,
        pageNum: p,
      });
      this.loading = false;
      if (res.data) {
        this.total = res.data.totalPages;
      }
      return res;
    },
    async init() {
      const res = await this.initAddressLists({ p: 1 });
    },
    async onChangePage(e) {
      await this.initAddressLists({ p: e });
    },
    onSave(row) {
      this.address.value = row.address;
      // this.coin.value = row.coin;
      this.note.value = row.remark;
      this.id.value = row.id;
      this.isEdit = true;
      this.validateForm();
    },
    async onDel(item) {
      this.$confirm(this.i18n.App.Address.delete_content, this.i18n.App.Address.tips, {
        confirmButtonText: this.i18n.App.Address.okText,
        cancelButtonText: this.i18n.App.Address.cancelText,
        type: 'warning',
      }).then(async () => {
        this.$set(item, 'loading', true);
        const res = await this.$store.dispatch('assets/delWA', {
          id: item.id,
        });
        this.$set(item, 'loading', false);
        if (200 === res.code) {
          await this.initAddressLists({ p: 1 });
          this.resetForm();
        } else {
          this.$message({
            type: 'error',
            message: this.i18n.App.Address.delete_error,
          });
        }
      });
    },
  },
  async mounted() {
    await this.init();
  },
};
</script>