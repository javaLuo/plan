<template>
  <div class="ad">
    <ad-header />
    <div class="ad-no">
      {{PublishAd.pubNo}}：{{params.adNo}}
    </div>
    <div class="container edit">
      <el-form :model="params"
               ref="form"
               class="publish-form">
        <el-form-item :label="PublishAd.adsLabel"
                      :rules="[
        { required: true, message: PublishAd.message.amount}]">
          <div class="row">
            <div class="select">
              <el-select v-model="params.adType"
                         :disabled="true"
                         @change="handleTypeChange"
                         :placeholder="Common.placeholder[4]">
                <el-option :key="0"
                           :label="PublishAd.adsType[0]"
                           :value="0"
                           :disabled="!!otcUserInfo && otcUserInfo[userInfo.userId] && otcUserInfo[userInfo.userId].busiType === 0?true:false">
                  {{PublishAd.adsType[0]}}
                </el-option>
                <el-option :key="1"
                           :label="PublishAd.adsType[1]"
                           :value="1"
                           :disabled="!!otcUserInfo && otcUserInfo[userInfo.userId] && otcUserInfo[userInfo.userId].busiType !== 2 && businessInfo.isBlack !== 0?true:false">
                  {{PublishAd.adsType[1]}}
                </el-option>
              </el-select>
            </div>
            <label style="margin-left:32px">{{PublishAd.at}}</label>
            <div class="select">
              <el-select v-model="params.countryArea"
                         :placeholder="Common.placeholder[4]"
                         :disabled="true">
                <el-option v-for="item in areaList"
                           :key="item.value"
                           :label="locale === 'zh_cn' ? item.national : item.nationalCode"
                           :value="item.id">
                  <!-- <span>{{ item.value }}</span> -->
                  <span style="padding-left:5px;">{{ locale === 'zh_cn' ? item.national : item.nationalCode }}</span>
                </el-option>
              </el-select>
            </div>
            <label style="margin-left:32px">{{PublishAd.use}}</label>
            <div class="select">
              <el-select v-model="params.payAsset"
                         :placeholder="Common.placeholder[4]"
                         @change="handleChangePrice"
                         :disabled="true">
                <el-option key="0"
                           :label="Common.legalType[0]"
                           :value="0" />
                <el-option key="1"
                           :label="Common.legalType[1]"
                           :value="1" />
              </el-select>
            </div>
            <div class="select">
              <el-select v-model="params.tradeType"
                         :disabled="true"
                         @change="handleChange">
                <el-option key="0"
                           :value="0"
                           :label="Common.tradeItem[0]">
                  {{Common.tradeItem[0]}}
                </el-option>
                <el-option key="1"
                           :value="1"
                           :label="Common.tradeItem[1]">
                  {{Common.tradeItem[1]}}
                </el-option>
              </el-select>
            </div>
            <div class="select">
              <el-select v-model="params.tradeAsset"
                         :disabled="true"
                         @change="handleChange">

                <el-option key="0"
                           :value="0"
                           label="BTC" />
                <el-option key="1"
                           :value="1"
                           label="ETH" />
                <el-option key="2"
                           :value="2"
                           label="USD" />
                <el-option key="3"
                           :value="3"
                           label="ETP" />

              </el-select>
            </div>
          </div>
        </el-form-item>
        <!-- 交易数量 -->
        <el-form-item :label="PublishAd.amountLabel"
                      prop="amount"
                      :rules="[
        { required: true, message: PublishAd.message.amount},
        { validator: validateAmount, trigger:'change'}]">
          <div class="row">
            <div class="Input">
              <el-input :placeholder="PublishAd.emptyInput"
                        v-model="params.amount">
              </el-input>
              <span class="company">{{componeyText}}</span>
            </div>
          </div>
        </el-form-item>
        <!-- 下面部分 价格设置 -->
        <div class="price-title">{{PublishAd.setPrice}}</div>
        <div class="price-setting">
          <!-- 价格类型 和 参考价格 -->
          <div class="setting">
            <el-form-item :label="PublishAd.priceLabel"
                          prop="priceType">
              <div class="row">
                <div class="Input">
                  <el-radio-group v-model="params.priceType"
                                  @change="handleChangePrice">
                    <el-radio :label="0">{{PublishAd.priceType[0]}}</el-radio>
                    <el-radio :label="1">{{PublishAd.priceType[1]}}</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="PublishAd.referLabel"
                          prop="referMarket">
              <div class="row">
                <div class="Input">
                  <div class="select"
                       style="margin-left:0px;">
                    <el-select v-model="params.referMarket"
                               @change="handleChangeMarket"
                               :placeholder="Common.placeholder[4]">
                      <el-option key="1"
                                 :disabled="params.tradeAsset === 3"
                                 :value="1"
                                 :label="PublishAd.referType[0]"></el-option>
                      <el-option key="3"
                                 :value="3"
                                 :label="PublishAd.referType[2]"></el-option>
                    </el-select>
                  </div>
                  <div class="price">
                    <label>
                      {{referPrice|formatCurrency}} {{payAssetText}}
                    </label>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
          <!-- 单价 和 浮动率 -->
          <div class="setting">
            <el-form-item :label="PublishAd.relativePrice"
                          prop="relativePremium"
                          :rules="[
                          { validator:this.validateRelativePremium , trigger:'change'}]"
                          v-if="params.priceType === 1">
              <div class="row">
                <div class="Input">
                  <el-input name="input_number"
                            v-model="params.relativePremium">

                  </el-input>
                  <!-- <el-input-number @change="handleInputNumberChange"
									                 name="input_number"
									                 v-model="params.relativePremium"
									                 :min="-30"
									                 :max="30"></el-input-number> -->
                  <span class="company">%</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="PublishAd.unitLabel"
                          prop="unitPrice"
                          :rules="[{ required: true, message: PublishAd.message.unit},
                          { validator:this.validateUnitPrice , trigger:'change'}
                  ]">
              <div class="row">
                <div class="Input">
                  <el-input :placeholder="PublishAd.emptyInput"
                            v-model="params.unitPrice"
                            @blur="handleBlurUnitPrice"
                            :disabled="params.priceType === 1">
                  </el-input>
                  <span class="company">{{payAssetText}}</span>
                </div>
              </div>
            </el-form-item>
          </div>
          <!-- 最低价 和 价格排名 -->
          <div class="setting">
            <el-form-item :label="params.tradeType == 0 ? PublishAd.floorPrice:PublishAd.ceilPrice"
                          prop="minPrice"
                          :rules="[{ validator:this.validateMinPrice , trigger:'change'}]"
                          v-if="params.priceType === 1">
              <div class="row">
                <div class="Input">
                  <el-input :placeholder="PublishAd.emptyInput"
                            v-model="params.minPrice">
                  </el-input>
                  <span class="company">{{payAssetText}}</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="PublishAd.rankLabel">
              <div class="row">
                <div class="Input">
                  <div class="font">
                    {{PublishAd.rankDes[0]}}
                    <span>{{rank}}</span>
                    {{PublishAd.rankDes[1]}}
                    <i class="iconfont icon-CombinedShapeCopy"
                       @click="rankUnitPrice(0)" />
                    <i class="iconfont icon-CombinedShape"
                       style="margin-left:6px"
                       @click="rankUnitPrice(1)" />
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
          <!-- 最小限额 和 最大限额 -->
          <div class="setting">
            <el-form-item :label="PublishAd.minLimitLabel"
                          prop="limitMin"
                          :rules="[{ required: true, message: PublishAd.message.minLimit},
                  { validator: validatelimitMin, trigger:'change'}]">
              <div class="row">
                <div class="Input">
                  <el-input :placeholder="PublishAd.emptyInput"
                            maxlength="20"
                            v-model="params.limitMin">
                  </el-input>
                  <span class="company">{{payAssetText}}</span>
                </div>
                <!-- <div class="message">
							{{PublishAd.minLimitDes}}
						</div> -->
              </div>
            </el-form-item>
            <el-form-item :label="PublishAd.maxLimitLabel"
                          prop="limitMax">
              <!-- :rules="[{ required: true, message: PublishAd.message.maxLimit},{ validator: validatelimitMax, trigger:'change'}]" -->
              <!--  -->
              <div class="row">
                <div class="Input">
                  {{limitMax}}

                  <!-- <el-input :placeholder="PublishAd.emptyInput"
                            v-model="params.limitMax"
                            maxlength="20">
                  </el-input> -->
                  <span class="company">{{payAssetText}}</span>
                </div>
                <!-- <div class="message">
							{{PublishAd.maxLimitDes}}
						</div> -->
              </div>
            </el-form-item>
          </div>
          <div class="setting">
            <el-form-item :label="Common.payment"
                          prop="payMethod"
                          :rules="[{ required: true, message: PublishAd.message.selPayment}]">
              <div class="row"
                   style="height:auto;">
                <div class="checkbox-container">
                  <div class="checkbox"
                       v-if="userPayList && userPayList.length > 0">
                    <el-checkbox-group v-model="params.payMethod">
                      <el-checkbox v-for="item in userPayList.filter(x=>x.payStatus === 1)"
                                   :key="item.id"
                                   :label="item.typeCode">{{Common.payments[`item${item.typeCode}`]}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <!-- <el-form-item class="bank"
									              v-if="params.payMethod.find(x=>x === 4)?true:false"
									              prop="bank"
									              :rules="[{ required: true, message: PublishAd.message.selBank}]">
										<div class="bank">
											<el-select :placeholder="Common.placeholder[4]"
											           v-model="params.bank">
												<el-option v-for="item in userPayList.filter(x=>x.typeCode === 4)"
												           :label="item.openBank"
												           :key="item.id"
												           :value="item.id"></el-option>
											</el-select>
										</div>
									</el-form-item> -->
                  <div class="add-bank">
                    <i class="iconfont icon-tianjia" />
                    <a @click="toEnabledAddType">
                      {{PublishAd.addPayment}}
                    </a>
                  </div>
                </div>
                <!-- <div class="message">
									{{PublishAd.paymentDes}}
								</div> -->
              </div>
            </el-form-item>
            <el-form-item :label="PublishAd.mesLabel"
                          prop="content">
              <div class="row"
                   style="height:auto;">
                <div class="Input">
                  <el-input type="textarea"
                            :autosize="{ minRows: 4, maxRows: 4}"
                            maxlength="200"
                            :placeholder="PublishAd.mesPlaceholder"
                            v-model="params.content">
                  </el-input>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
        <el-form-item style="display: flex;justify-content: center;margin-top:96px;">
          <div class="Input">
            <el-checkbox v-model="checked">{{PublishAd.agreetment[0]}}
              <a target="_blank"
                 :href="`https://support.rightbtc.com/hc${terms[locale][0]}`">{{PublishAd.agreetment[1]}}</a>
            </el-checkbox>
          </div>
          <div class="button">
            <el-button type="primary"
                       :disabled="businessInfo.isBlack === 1"
                       @click="handleSubmit">{{PublishAd.publishBtn}}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <capital-pwd-modal v-if="showModal"
                       :modal-cancel="modalCancel"
                       :handle-callback="handleCallback" />
    <div v-if="showModal"
         class="opacity" />
    <PayKYCModal :display="modalDisplayPayKyc"
                 :close="toDisabledPayKyc" />
    <!-- 添加支付方式 弹框 -->
    <AddPayTypeModal :realName="userInfo.realName||''"
                     :display="modalDisplayAddType"
                     :close="toDisabledAddType"
                     :ok="addPayTypeHandle" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CapitalPwdModal from '~/components/Modal/CapitalPwdModal.vue';
import { GET_USER_INFO_ACTIONS, GET_KYC_USER_INFO_ACTIONS, GET_OTC_USER_INFO_ACTIONS } from '~/store/modules/member/type';
import { GET_AREALIST_ACTIONS } from '~/store/modules/order/type';
import * as type from '~/store/modules/ad/type';
import Utils from '~/utils';
import { formatCurrency } from '~/utils/filter.js';
import AdHeader from '~/components/AdHeader.vue';
import AddPayTypeModal from '~/components/Modal/AddPayTypeModal.vue';
import PayKYCModal from '~/components/Modal/PayKYCModal.vue';

export default {
  components: {
    CapitalPwdModal,
    AdHeader,
    AddPayTypeModal,
    PayKYCModal,
  },
  data() {
    return {
      checked: false,
      showModal: false, //是否显示资金弹框
      params: {
        adType: 0,
        tradeAsset: 0, // 0 BTC 1ETH 2 USD
        tradeType: 0,
        payAsset: '',
        amount: 0,
        priceType: 0,
        relativePremium: 0,
        unitPrice: 0,
        minPrice: '',
        limitMin: '0.00',
        limitMax: '0.00',
        payMethod: [],
        countryArea: '',
        content: '',
        referMarket: 1,
        payMethodId: [],
      },
      adNo: this.$route.params.id,
      countAmount: 0,
      saleAmunt: 0, //编辑时可用、、、可用库存数量
      modalDisplayAddType: false,
      modalDisplayPayKyc: false,
      terms: {
        en_us: ['/en-us/articles/360015805652'],
        zh_cn: ['/zh-cn/articles/360015805652'],
      },
    };
  },
  watch: {
    locale() {
      this.$refs.form.clearValidate();
    },
  },
  async mounted() {
    // 正在处罚不能发布或编辑广告
    if (this.businessInfo && this.businessInfo.isBlack === 1) {
      this.$alert(this.AdList.isblack, this.Settings.notice, {
        confirmButtonText: this.Settings.ok,
        callback: action => {
          this.$router.replace('/');
        },
      });
      return;
    }

    await this.getUserInfo();
    await this.getOtcUserInfo({
      userId: this.userInfo.userId,
    });
    await this.getUserPayList();
    await this.getAreaList();
    let params = await this.getAdInfo(this.adNo);
    this.params = Object.assign(this.params, params);
    if (this.params.tradeAsset === 3) {
      // 是ETP的话，只能选Coinmarketcap
      this.params.referMarket = 3;
    } else {
      this.params.referMarket = this.params.referMarket || 1;
    }
    this.handleBlurUnitPrice();
    this.saleAmunt = Number(Utils.minus(params.amount, params.stockStr)); //当前出售数量

    await this.getRateAmount({
      adType: this.params.adType,
      tradeAsset: this.params.tradeAsset,
    });
    // this.countAmount = params.am
    await this.getAssestList({
      assetType: this.params.tradeAsset,
    });
    await this.getAveragePrice({
      market: this.params.referMarket,
      tradeAsset: this.params.tradeAsset,
    });
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      Common: state => state.i18n.App.Common,
      PublishAd: state => state.i18n.App.PublishAd,
      Settings: state => state.i18n.App.Settings,
      AdList: state => state.i18n.App.AdList,
      areaList: state => state.order.areaList,
      businessInfo: state => state.account.businessInfo,
      userInfo: state => {
        return state.member.userInfo;
      },
      averagePrice: state => {
        return state.ad.averagePrice;
      },
      userAmount: state => {
        return state.ad.userAmount;
      },
      userPayList: state => {
        return state.ad.userPayList;
      },
      rank: state => {
        return state.ad.rank;
      },
      ErrCode: state => {
        return state.i18n.App.ErrCode;
      },
      rateAmount: state => state.ad.rateAmount,
      otcUserInfo: state => {
        return state.member.otcUserInfo;
      },
    }),
    countrayArea() {
      return this.areaList.find(x => x.nationalCode === this.userInfo.nationalEnName) ? this.areaList.find(x => x.nationalCode === this.userInfo.nationalEnName).id : '';
    },
    componeyText() {
      switch (parseInt(this.params.tradeAsset)) {
        case 0:
          return 'BTC';
          break;
        case 1:
          return 'ETH';
          break;
        case 2:
          return 'USD';
          break;
        case 3:
          return 'ETP';
          break;
        default:
          return 'BTC';
      }
    },
    payAssetText() {
      return parseInt(this.params.payAsset) === 0 ? 'CNY' : 'USD';
    },
    referPrice() {
      let { tradeType, payAsset } = this.params;
      let res = 0.0;
      if (parseInt(tradeType) === 0 && parseInt(payAsset) === 0) {
        res = !!this.averagePrice && this.averagePrice.sellPriceCny;
      } else if (parseInt(tradeType) === 0 && parseInt(payAsset) === 1) {
        res = !!this.averagePrice && this.averagePrice.sellPriceUsd;
      } else if (parseInt(tradeType) === 1 && parseInt(payAsset) === 0) {
        res = !!this.averagePrice && this.averagePrice.buyPriceCny;
      } else if (parseInt(tradeType) === 1 && parseInt(payAsset) === 1) {
        res = !!this.averagePrice && this.averagePrice.buyPriceUsd;
      }
      // 处理NaN的情况
      return res || 0.0;
    },
    unitPriceType() {
      let res = 0.0;
      if (parseInt(this.params.tradeType) === 0 && parseInt(this.params.payAsset) === 0) {
        res = Utils.toFixed2(Utils.multi(this.averagePrice.sellPriceCny, this.params.relativePremium / 100));
      } else if (parseInt(this.params.tradeType) === 0 && parseInt(this.params.payAsset) === 1) {
        res = Utils.toFixed2(Utils.multi(this.averagePrice.sellPriceUsd, this.params.relativePremium / 100));
      } else if (parseInt(this.params.tradeType) === 1 && parseInt(this.params.payAsset) === 0) {
        res = Utils.toFixed2(Utils.multi(this.averagePrice.buyPriceCny, this.params.relativePremium / 100));
      } else if (parseInt(this.params.tradeType) === 1 && parseInt(this.params.payAsset) === 1) {
        res = Utils.toFixed2(Utils.multi(this.averagePrice.buyPriceUsd, this.params.relativePremium / 100));
      }
      // 处理NaN的情况
      return res || 0.0;
    },
    limitMax() {
      return Utils.toFixed2(Number(this.params.amount) * Number(this.params.unitPrice));
    },
  },
  methods: {
    ...mapActions({
      created: 'ad/create',
      getUserInfo: GET_USER_INFO_ACTIONS,
      getKycUserInfo: GET_KYC_USER_INFO_ACTIONS,
      getAssestList: type.AD_GET_ASSETLIST_ACTIONS,
      getAveragePrice: type.AD_GET_AVERAGEPRICE_ACTIONS,
      createdAd: type.AD_CREATE_ACTIONS,
      getUserPayList: type.AD_GET_USERPAYLIST_ACTIONS,
      getAdRank: type.AD_GET_RANKQUERY_ACTIONS,
      setRank: type.AD_RANKUNITPRICE_ACTIONS,
      getAdInfo: type.AD_ONEQUERY_EDIT_ACTIONS,
      edit: type.AD_EDIT,
      getAreaList: GET_AREALIST_ACTIONS,
      getRateAmount: type.AD_RATEAMOUNT_ACTIONS,
      getOtcUserInfo: GET_OTC_USER_INFO_ACTIONS,
      resetRateAmount: type.AD_RESET_RATEMOUNT,
    }),
    async handleChange(value) {
      //[this.params.tradeAsset, this.params.tradeType] = value.split('-'); //赋值
      await this.getAssestList({
        assetType: this.params.tradeAsset,
      });
      await this.getAveragePrice({
        market: this.params.referMarket,
        tradeAsset: this.params.tradeAsset,
      });
      await this.handleChangePrice();
      await this.getRateAmount({
        adType: this.params.adType,
        tradeAsset: this.params.tradeAsset,
      });
    },
    setUserPay() {
      this.params.payMethod = [];
      if (this.userPayList) {
        this.userPayList.forEach(x => {
          if (x.payStatus === 1) {
            this.params.payMethod.push(x.typeCode);
          }
        });
      }
    },
    handleChangePremium(value) {
      this.params.relativePremium = value;
    },
    handleSubmit() {
      // 正在处罚（1）不能发广告
      if (this.businessInfo && this.businessInfo.isBlack === 1) {
        this.$message.error(this.AdList.isblack);
        return;
      }
      // 正在处罚（2）中不能发大宗广告，但可以发普通广告
      if (this.businessInfo && this.businessInfo.isBlack === 2 && Number(this.params.adType) === 1) {
        this.$message.error(this.AdList.isblack);
        return;
      }

      this.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.checked) {
            this.$message.warning(this.PublishAd.message.checked);
            return false;
          }

          if (this.userInfo.secertStatus === 0) {
            this.$message.warning(this.Settings.messageErr[0]);
            return false;
          }
          this.showModal = true;
        } else {
          return false;
        }
      });
    },
    modalCancel() {
      this.showModal = false;
    },
    async handleCallback() {
      this.showModal = false;
      let res;
      let params = { ...this.params };
      params.payMethodId = [];
      params.limitMax = this.limitMax;
      //后端需要payMethodId
      params.payMethod.forEach(x => {
        params.payMethodId.push(this.userPayList.find(u => u.typeCode === x).id);
      });
      // params.amount = Utils.minus(params.amount, this.saleAmunt); //编辑时 amount数量减去可用库存

      res = await this.edit(params);
      document.body.style.overflow = 'auto';
      if (res && res.code === 200) {
        this.$router.push('/ad/adList');
      } else {
        this.$message.error(this.ErrCode[res.code] || res.code);
      }
    },
    async handleChangeMarket() {
      await this.getAveragePrice({
        market: this.params.referMarket,
        tradeAsset: this.params.tradeAsset,
      });
      await this.handleChangePrice();
    },
    validateUnitPrice(rule, value, callback) {
      if (value === '') {
        callback();
        return;
      }
      value = value + '';
      this.params.unitPrice = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      if (!/^\d+(\.\d{0,2})?$/.test(value)) {
        callback(this.PublishAd.callbackTxt[0]);
      }
      if (Number(value) <= 0) {
        callback(this.PublishAd.callbackTxt[6]);
      }
      callback();
    },
    validatelimitMin(rule, value, callback) {
      if (value === '') {
        callback();
        return;
      }
      value = value + '';
      this.params.limitMin = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      if (!/^\d+(\.\d{0,2})?$/.test(value)) {
        callback(this.PublishAd.callbackTxt[0]);
      }
      if (Number(value) > this.limitMax || Number(value) < 100) {
        callback(this.PublishAd.callbackTxt[2]);
      }
      callback();
    },
    validatelimitMax(rule, value = '', callback) {
      if (value === '') {
        callback();
        return;
      }
      value = value + '';
      this.params.limitMax = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      if (!/^\d+(\.\d{0,2})?$/.test(value)) {
        callback(this.PublishAd.callbackTxt[0]);
      }
      if (!/^\d+(\.\d{0,2})?$/.test(value) && Number(value) > 0) {
        callback(this.PublishAd.callbackTxt[5]);
      }
      if (Number(value) < this.params.limitMin || Number(value) > Number(Utils.multi(this.params.amount, this.params.unitPrice))) {
        callback(this.PublishAd.callbackTxt[1]);
      }
      callback();
    },
    validateAmount(rule, value, callback) {
      //let amount = Number(Utils.plus(this.userAmount, this.params.stockStr)); //当前可用法币数量
      let { limitMin, limitMax } = this.rateAmount;
      if (value === '') {
        callback();
        return;
      }
      value = value + '';
      this.params.amount = value.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3');
      if (!/^\d+(\.\d{0,4})?$/.test(value)) {
        callback(this.PublishAd.callbackTxt[3]);
      } else if (Number(value) < this.saleAmunt) {
        //编辑的时候 吧之前发布的数量 + 可用数量 等于总量tradeType
        callback(this.PublishAd.callbackTxt[7]);
      } else if (Number(value) < Number(limitMin) || Number(value) > Number(limitMax)) {
        callback(
          `${parseInt(this.params.adType) === 0 ? this.PublishAd.adsType[0] : this.PublishAd.adsType[1]}${this.PublishAd.adslimit.split('$$$')[0]}${value}
							${this.PublishAd.adslimit.split('$$$')[1]}
							${limitMin} - ${limitMax}
							${this.PublishAd.adslimit.split('$$$')[3]}`,
        );
      }
      callback();
      // else if(Number(value))
    },
    validateMinPrice(rule, value, callback) {
      let v = value;
      if (!v && v !== 0) {
        callback();
        return;
      }
      // this.params.minPrice = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

      if (Number.isNaN(Number(v)) || !/^\d+(\.\d{0,2})?$/.test(v)) {
        callback(this.PublishAd.callbackTxt[5]);
      }
      callback();
    },
    async handleChangePrice() {
      if (parseInt(this.params.priceType) === 1) {
        this.params.unitPrice = this.unitPriceType;
        //document.getElementsByName('input_number')[0].disabled = true; //修改elment ui input-number 不允许输入
        this.handleBlurUnitPrice();
      } else {
        this.params.unitPrice = 0.0;
        this.handleBlurUnitPrice();
      }
    },
    validateRelativePremium(rule, value, callback) {
      if (value === '') {
        callback();
        return;
      }
      if (!/^[1-9]\d*$/.test(value)) {
        this.params.relativePremium = value.replace(/\D/g, '');
        callback();
        return;
      }
      if (Number(value) < 70 || Number(value) > 130) {
        callback(this.PublishAd.callbackTxt[8]);
        return;
      }
      this.params.unitPrice = this.unitPriceType;
      this.handleBlurUnitPrice();
      callback();
    },
    async handleBlurUnitPrice() {
      let { tradeType, tradeAsset, unitPrice } = this.params;

      await this.getAdRank({
        tradeType,
        tradeAsset,
        unitPrice,
      });
    },
    async rankUnitPrice(type) {
      let { tradeAsset, tradeType, unitPrice, priceType } = this.params;
      if (!unitPrice || unitPrice === 0) {
        return;
      }
      let rankUnitPrice = await this.setRank({
        tradeAsset,
        tradeType,
        unitPrice,
        operateFlag: type,
        referPrice: parseInt(priceType) === 1 ? this.referPrice : '',
      });

      this.params.unitPrice = rankUnitPrice.fuckPrice;

      parseInt(priceType) === 1 ? (this.params.relativePremium = rankUnitPrice.referPrice) : '';
      // if (priceType) {

      // }
      await this.getAdRank({
        tradeType,
        tradeAsset,
        unitPrice: this.params.unitPrice,
      });
    },
    async handleTypeChange() {
      //获取广告的限制数量
      await this.getRateAmount({
        adType: this.params.adType,
        tradeAsset: this.params.tradeAsset,
      });
    },
    toEnabledAddType() {
      // this.modalDisplayAddType = true
      // return;
      // 如果用户没设置资金密码，弹框提示
      if (!!this.userInfo && this.userInfo.secertStatus === 0) {
        this.setSecertPwdShow = true;
      }
      //c2IsCerting will be delete
      if (!!this.userInfo.c1Status && !!this.userInfo.c2Status) {
        this.modalDisplayAddType = true;
        return;
      }
      this.modalDisplayPayKyc = true;
    },
    toDisabledPayKyc() {
      this.modalDisplayPayKyc = false;
    },
    async addPayTypeHandle() {
      this.AddPayTypeModal = false;
      await this.getUserPayList();
      await this.setUserPay();
    },
    toDisabledAddType() {
      this.modalDisplayAddType = false;
    },
  },
  filters: {
    formatCurrency(val) {
      return formatCurrency(val);
    },
  },
  beforeDestroy() {
    // 退出前清除某些数据
    this.resetRateAmount();
  },
};
</script>

<style lang="scss" scoped>
.ad {
  margin-top: 58px;
  .ad-no {
    text-align: right;
    width: 1180px;
    margin: 0 auto;
    margin-top: 0px;
    margin-top: 28px;
    font-size: 12px;
    color: #a8afcd;
  }
  .container {
    width: 1180px;
    margin: 0 auto;
    background: #fff;
    border-radius: 2px;
    margin-top: 24px;
    padding: 44px 63px 64px 28px;
    margin-bottom: 170px;
    .button {
      width: 225px;
      height: 44px;
      margin-top: 20px;
    }
    .price-title {
      font-size: 18px;
      color: #241c40;
      margin-top: 48px;
    }
    .price-setting {
      .setting {
        display: flex;
        justify-content: space-between;
      }
    }
    .row {
      font-size: 14px;
      color: #7d86ac;
      display: flex;
      // justify-content: space-between;
      margin-top: 50px;
      height: 40px;
      line-height: 40px;
      .requied {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #d0021b;
        letter-spacing: 0;
        text-align: right;
        margin-right: 4px;
      }
      &:first-child {
        margin-top: 0px;
      }
      .label {
        width: 90px;
        font-size: 14px;
        color: #797780;
      }
      .slider {
        width: 380px;
      }
      .checkbox-container {
        width: 380px;
        .add-bank {
          line-height: 40px;
          margin-left: 20px;
          i {
            color: #6aa0ff;
            font-size: 14px;
          }
          cursor: pointer;
          a {
            color: #6aa0ff;
          }
        }
      }
      .select {
        width: 148px;
        height: 40px;
        margin-left: 24px;
      }
      .Input {
        width: 380px;
        position: relative;
        display: flex;
        // line-height: 40px;
        // align-items: center;
        margin-left: 24px;
        button {
          width: 225px;
          height: 44px;
        }
        .company {
          position: absolute;
          font-size: 14px;
          color: #a8afcd;
          right: 12px;
        }
        .select {
          width: 198px;
        }
        .price {
          font-size: 14px;
          color: #6aa0ff;
          letter-spacing: 0;
          line-height: 40px;
          margin-left: 50px;
        }
        .font {
          font-size: 14px;
          color: #354989;
          // line-height: 3px;
          span {
            color: #6aa0ff;
          }
        }
      }
      .message {
        font-size: 14px;
        color: #b7b6ba;
        width: 590px;
      }
    }
  }
}
</style>
