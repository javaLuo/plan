<template>
  <div class="container">
    <div class="setting c1Auth">
      <el-breadcrumb class="breadcrumb"
                     separator="/">
        <el-breadcrumb-item :to="{path: '/'}">{{Prompt.home}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u'}">{{Prompt.myCenter}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u/C1Auth'}">{{Prompt.C1Auth}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main">
        <div class="nav-bar">{{Prompt.C1Auth}}</div>
        <div class="content">
          <el-form :model="c1Form"
                   ref="c1Form"
                   :rules="rules"
                   label-position="right"
                   label-width="414px">
            <el-form-item :label="C1Auth.name"
                          prop="name">
              <el-input v-model="c1Form.name"
                        :placeholder="C1Auth.namePlaceholder"
                        maxLength="100">
              </el-input>
            </el-form-item>
            <el-form-item :label="C1Auth.country"
                          prop="nation"
                          :rules="[{ required: true, message: C1Auth.selectPlaceholder, trigger: 'change'}]">
              <el-select style="max-width:450px;"
                         filterable
                         v-model="c1Form.nation"
                         :placeholder="C1Auth.selectPlaceholder">
                <el-option v-for="item in areaList"
                           :key="item.id"
                           :label="locale === 'zh_cn' ? item.national : item.nationalCode"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="C1Auth.credentials"
                          prop="certifyType"
                          :rules="[{ required: true, message: C1Auth.credentialsPlaceholder, trigger: 'change'}]">
              <el-select style="max-width:450px;"
                         v-model="c1Form.certifyType"
                         :placeholder="C1Auth.credentialsPlaceholder">
                <el-option v-for="item in certifyList"
                           :key="item.value"
                           :label="Settings.certifyList[item.name]"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="C1Auth.cardId"
                          prop="idNumber">
              <el-input v-model="c1Form.idNumber"
                        :placeholder="C1Auth.credentialCodePlaceholder"
                        maxLength="50">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="determine"
                         :loading="loading"
                         @click="handlerAuth">
                {{C1Auth.button}}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-dialog :title="C1Auth.title"
                 :show-close="false"
                 :close-on-click-modal="false"
                 :close-on-press-escape="false"
                 :visible.sync="dialogVisible"
                 width="30%"
                 center>
        <p>{{C1Auth.content}}</p>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="hideDialog">{{C1Auth.cancelText}}</el-button>
          <el-button @click="hideAndTurn">{{C1Auth.okText}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { GET_AREA_LIST } from '~/store/modules/user/type';
import * as type from '~/store/modules/settings/type';
import * as userType from '~/store/modules/user/type';
import { specialChar1, specialChar2 } from '~/utils/constant';
import Configs from '~/common/config';

export default {
  data() {
    return {
      loading: false,
      c1Form: {
        name: '',
        nation: '',
        certifyType: '',
        idNumber: '',
      },
      certifyList: [{ name: 0, value: 1 }, { name: 1, value: 2 }, { name: 2, value: 3 }],
      dialogVisible: false,
      rules: {
        name: [{ validator: this.validateName, trigger: 'change' }],
        idNumber: [{ validator: this.validateIdNumber, trigger: 'change' }],
      },
    };
  },
  watch: {
    locale() {
      this.$refs['c1Form'].clearValidate();
    },
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      Prompt: state => state.i18n.App.Prompt,
      Settings: state => state.i18n.App.Settings,
      ErrorCode: state => state.i18n.App.ErrorCode,
      C1Auth: state => state.i18n.App.C1Auth,
      areaList: state => state.user.areaList,
      SettingData: state => state.settings,
      userInfo: state => state.user.userInfo,
    }),
  },
  async mounted() {
    await this.getUserInfo();
    await this.getAreaList();
    if (this.userInfo.c1Status === 2) {
      await this.c1Info();
    }
  },
  methods: {
    ...mapActions({
      getUserInfo: userType.GET_USER_INFO,
      getAreaList: GET_AREA_LIST,
      c1Auth: type.POST_C1_AUTH,
    }),
    c1Info() {
      this.c1Form.name = this.userInfo.realName;
      this.c1Form.idNumber = this.userInfo.idNumber;
      this.c1Form.certifyType = this.userInfo.credential;
      const locale = this.locale;
      let areaName = this.userInfo.nationalName;
      const area = this.areaList.filter(item => item.national === areaName);
      // let areaName = locale === 'zh_cn' ? this.userInfo.nationalName : this.userInfo.nationalEnName;
      // const area = this.areaList.filter(item => (locale === 'zh_cn' ? item.national === areaName : item.nationalCode === areaName));
      const areaId = !!area[0] && area[0]['id'] ? area[0]['id'] : undefined;
      this.c1Form.nation = areaId;
    },
    hideDialog() {
      this.dialogVisible = false;
      this.goToBackUrl(`/u?section=${this.SettingData.section}`);
    },
    hideAndTurn() {
      this.dialogVisible = false;
      this.$router.push('/u/C2Auth');
    },
    validateName(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.C1Auth.realNameError));
      }
      console.log(specialChar1.test(value));
      console.log(specialChar2.test(value));
      if (specialChar1.test(value) || specialChar2.test(value)) {
        callback(new Error(this.C1Auth.realNameError));
      }
      callback();
    },
    validateIdNumber(rule, value, cb) {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (value === '') {
        cb(this.C1Auth.wrongIDNumber);
      }
      if (specialChar1.test(value) || specialChar2.test(value) || /\s/g.test(value)) {
        this.c1Form.idNumber = value.substring(0, value.length - 1);
        cb(this.C1Auth.wrongIDNumber);
      }
      if (this.c1Form.nation === 37 && this.c1Form.certifyType === 1 && !reg.test(value)) {
        cb(this.C1Auth.wrongIDNumber);
      }
      cb();
    },
    goToBackUrl(url) {
      if (this.$route.query && this.$route.query.returnUrl) {
        // 这是从OTC跳过来的
        location.href = `${Configs.DEFAULT.OTC}/${this.$route.query.returnUrl.replace(/^\//, '')}`;
      } else {
        this.$router.push(url);
      }
    },
    handlerAuth() {
      this.$refs.c1Form.validate(async valid => {
        if (valid) {
          this.loading = true;
          const res = await this.c1Auth({
            realName: this.c1Form.name,
            nationalityId: this.c1Form.nation,
            credential: this.c1Form.certifyType,
            credentialCode: this.c1Form.idNumber,
          });
          if (res && res.code === 200) {
            this.dialogVisible = true;
            this.loading = false;
          } else {
            this.$message.error(this.ErrorCode[res.code]);
            this.loading = true;
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>

