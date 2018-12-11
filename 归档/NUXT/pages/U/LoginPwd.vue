<template>
  <div class="container">
    <div class="setting loginPwd">
      <el-breadcrumb class="breadcrumb"
                     separator="/">
        <el-breadcrumb-item :to="{path: '/'}">{{Prompt.home}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u'}">{{Prompt.myCenter}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u/LoginPwd'}">{{Prompt.password}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main">
        <div class="nav-bar">{{Prompt.password}}</div>
        <div class="content">
          <el-form :model="userPwd"
                   ref="userPwd"
                   :rules="rules"
                   label-position="right"
                   label-width="414px">
            <el-form-item :label="Password.PwLabel.oldPassword"
                          prop="oldPwd">
              <el-input type="password"
                        v-model="userPwd.oldPwd"
                        :placeholder="Password.PwPlaceholder.oldPassword">
              </el-input>
            </el-form-item>
            <el-form-item :label="Password.PwLabel.newPassword"
                          prop="newPwd">
              <el-input type="password"
                        v-model="userPwd.newPwd"
                        :placeholder="Password.PwPlaceholder.newPassword">
              </el-input>
            </el-form-item>
            <el-form-item :label="Password.PwLabel.confirmPw"
                          prop="confirmPwd">
              <el-input type="password"
                        v-model="userPwd.confirmPwd"
                        :placeholder="Password.PwPlaceholder.confirmPw">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="determine"
                         @click="modifyPwd">
                {{Password.confirm}}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { userLogout } from '~/store/modules/user/api';
import * as type from '~/store/modules/settings/type';
import Storage from '~/utils/storage';

export default {
  data() {
    return {
      userPwd: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
      },
      rules: {
        oldPwd: [{ validator: this.validateOld, trigger: 'change' }],
        newPwd: [{ validator: this.validateNew, trigger: 'change' }],
        confirmPwd: [{ validator: this.validateConfirm, trigger: 'change' }],
      },
    };
  },
  watch: {
    locale() {
      this.$refs['userPwd'].clearValidate();
    },
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      Prompt: state => state.i18n.App.Prompt,
      Common: state => state.i18n.App.Common,
      Password: state => state.i18n.App.Password,
      Register: state => state.i18n.App.Register,
      ErrorCode: state => state.i18n.App.ErrorCode,
    }),
  },
  methods: {
    ...mapActions({
      loginPassword: type.POST_LOGIN_PWD,
    }),
    goToBackUrl(url) {
      let param = '';
      if (this.$route.query && this.$route.query.returnUrl) {
        // 这是从OTC跳过来的
        param = `?returnUrl=${this.$route.query.returnUrl}`;
      }
      location.href = `/u/login${param}`;
    },
    validateOld(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.Password.message.oldPassword));
      }
      callback();
    },
    validateNew(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.Password.PwPlaceholder.newPassword));
      } else {
        const isPassword = value.length > 7 && /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]/.test(value) && !/\s/.test(value);
        if (!isPassword) {
          callback(new Error(this.Register.pwdTypeError));
        }
        if (value === this.userPwd.oldPwd) {
          callback(new Error(this.Password.message.checkErr));
        }
        callback();
      }
    },
    validateConfirm(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.Register.confirmPwdEmpty));
      }
      if (value !== this.userPwd.newPwd) {
        callback(new Error(this.Common.passwordNoMA));
      }
      callback();
    },
    modifyPwd() {
      this.$refs.userPwd.validate(async valid => {
        if (valid) {
          const res = await this.loginPassword({
            newPassword: this.userPwd.newPwd,
            oldPassword: this.userPwd.oldPwd,
          });
          if (res && res.code === 200) {
            userLogout();
            Storage.remove('globals');
            Storage.remove('isLogin');
            Storage.remove('username');
            this.goToBackUrl('/u/login');
          } else {
            this.$message.error(this.ErrorCode[res.code]);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
