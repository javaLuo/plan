<template>
  <div class="container">
    <div class="setting c2Auth">
      <el-breadcrumb class="breadcrumb"
                     separator="/">
        <el-breadcrumb-item :to="{path: '/'}">{{Prompt.home}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u'}">{{Prompt.myCenter}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u/FundPwd'}">{{Prompt.C2Auth}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main">
        <div class="nav-bar">{{Prompt.C2Auth}}</div>
        <div class="personInfo">
          <h3>
            <i class="iconfont icon-yonghu"></i>
            <span>{{C2Auth.title}}</span>
          </h3>
          <p>{{C2Auth.desc}}</p>
          <div class="info">
            <div>
              <dl>
                <dt>{{C1Auth.name}}：</dt>
                <dd>{{userInfo.realName}}</dd>
              </dl>
              <dl>
                <dt>{{C1Auth.credentials}}：</dt>
                <dd>{{docuType(userInfo.credential)}}</dd>
              </dl>
            </div>
            <div>
              <dl>
                <dt>{{C1Auth.country}}：</dt>
                <dd>{{locale === 'zh_cn' ? userInfo.nationalName : userInfo.nationalEnName}}</dd>
              </dl>
              <dl>
                <dt>{{C1Auth.cardId}}：</dt>
                <dd>{{idNumber}}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="content">
          <el-form :model="c2AuthForm"
                   ref="c2AuthForm">
            <el-row class="uploadCon">
              <el-form-item prop="pic1Url">
                <el-col :span="12">
                  <el-upload class="upload"
                             accept="image/jpg,image/png,image/gif,image/jpeg"
                             :action="uploadUrl"
                             list-type="picture"
                             :show-file-list="false"
                             :with-credentials="true"
                             :on-success="handlerUpload1"
                             :before-upload="beforeUpload"
                             :on-error="errUpload">
                    <img :src="c2AuthForm.pic1Url"
                         class="avatar">
                    <div class="el-upload__text"
                         style="{'white-space': 'nowrap'}">{{C2Auth.faceTitle}}</div>
                  </el-upload>
                </el-col>
                <el-col :span="12">
                  <dl class="demo">
                    <dd><img src="~static/images/upload1.png"
                           alt=""></dd>
                    <dt>{{C2Auth.faceIndex}}</dt>
                  </dl>
                </el-col>
              </el-form-item>
              <el-form-item prop="pic2Url">
                <el-col :span="12">
                  <el-upload class="upload"
                             accept="image/jpg,image/png,image/gif,image/jpeg"
                             :action="uploadUrl"
                             list-type="picture"
                             :show-file-list="false"
                             :with-credentials="true"
                             :on-success="handlerUpload2"
                             :before-upload="beforeUpload"
                             :on-error="errUpload">
                    <img :src="c2AuthForm.pic2Url"
                         class="avatar">
                    <div class="el-upload__text">{{C2Auth.backTitle}}</div>
                  </el-upload>
                </el-col>
                <el-col :span="12">
                  <dl class="demo">
                    <dd><img src="~static/images/upload2.png"
                           alt=""></dd>
                    <dt>{{C2Auth.backIndex}}</dt>
                  </dl>
                </el-col>
              </el-form-item>
              <el-form-item prop="pic3Url">
                <el-col :span="12">
                  <el-upload class="upload"
                             accept="image/jpg,image/png,image/gif,image/jpeg"
                             :action="uploadUrl"
                             list-type="picture"
                             :show-file-list="false"
                             :with-credentials="true"
                             :on-success="handlerUpload3"
                             :before-upload="beforeUpload"
                             :on-error="errUpload">
                    <img :src="c2AuthForm.pic3Url"
                         class="avatar">
                    <div class="el-upload__text">{{C2Auth.holdTitle}}</div>
                  </el-upload>
                </el-col>
                <el-col :span="12">
                  <dl class="demo">
                    <dd><img src="~static/images/upload3.png"
                           alt=""></dd>
                    <dt>{{C2Auth.holdIndex}}</dt>
                  </dl>
                </el-col>
              </el-form-item>
              <el-form-item prop="pic4Url">
                <el-col :span="12">
                  <el-upload class="upload"
                             accept="image/jpg,image/png,image/gif,image/jpeg"
                             :action="uploadUrl"
                             list-type="picture"
                             :show-file-list="false"
                             :with-credentials="true"
                             :on-success="handlerUpload4"
                             :before-upload="beforeUpload"
                             :on-error="errUpload">
                    <img :src="c2AuthForm.pic4Url"
                         class="avatar">
                    <div class="el-upload__text">{{C2Auth.annotationTitle}}</div>
                  </el-upload>
                </el-col>
                <el-col :span="12">
                  <dl class="demo">
                    <dd><img src="~static/images/upload4.png"
                           alt=""></dd>
                    <dt>{{C2Auth.annotationIndex}}</dt>
                  </dl>
                </el-col>
              </el-form-item>
            </el-row>
            <dl class="notice"
                style="width:60%; max-width:606px;">
              <dt>{{C2Auth.formatTitle}}</dt>
              <dd>{{C2Auth.formatCon1}}</dd>
              <dd>{{C2Auth.formatCon2}}</dd>
              <dd>{{C2Auth.formatCon3}}</dd>
              <dd>{{C2Auth.formatCon4}}</dd>
            </dl>
            <el-form-item>
              <el-col :span="24">
                <el-button class="determine"
                           @click="handlerAuth"
                           :loading="loading">{{C2Auth.okBtn}}</el-button>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Configs from '~/common/config';
import { mapState, mapActions } from 'vuex';
import * as userType from '~/store/modules/user/type';
import * as type from '~/store/modules/settings/type';

export default {
  data() {
    return {
      loading: false,
      c2AuthForm: {
        pic1Url: '',
        pic2Url: '',
        pic3Url: '',
        pic4Url: '',
      },
      uploadUrl: Configs.DEFAULT.UPLOAD_API,
      fileList: [],
    };
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      SettingData: state => state.settings,
      Prompt: state => state.i18n.App.Prompt,
      C2Auth: state => state.i18n.App.C2Auth,
      C1Auth: state => state.i18n.App.C1Auth,
      Common: state => state.i18n.App.Common,
      ErrorCode: state => state.i18n.App.ErrorCode,
      Settings: state => state.i18n.App.Settings,
      userInfo: state => state.user.userInfo,
    }),
    idNumber() {
      if (this.userInfo.idNumber) {
        let idNumber = this.userInfo.idNumber;
        return idNumber.substring(0, 2) + '******' + idNumber.substring(idNumber.length - 3);
      }
    },
  },
  async created() {
    await this.getUserInfo();
    // if (!this.userInfo.c1Status) {
    //   this.$router.push('/u');
    //   return;
    // }
    // if (this.userInfo.c2Status) {
    //   this.$router.push('/u');
    //   return;
    // }
  },
  methods: {
    ...mapActions({
      getUserInfo: userType.GET_USER_INFO,
      c2Auth: type.POST_C2_AUTH,
      updateC2Auth: type.POST_C2_UPDATE,
    }),
    docuType(val) {
      if (!val) {
        return '';
      }
      switch (val) {
        case 1:
          return this.Settings.certifyList[0];
          break;
        case 2:
          return this.Settings.certifyList[1];
          break;
        case 3:
          return this.Settings.certifyList[2];
          break;
        default:
          break;
      }
    },
    beforeUpload(file) {
      const isGIF = file.type === 'image/gif';
      const isPNG = file.type === 'image/png';
      const isJPG = file.type === 'image/jpg';
      const isJPEG = file.type === 'image/jpeg';
      const ltSize = file.size / 1024 / 1024 < 3;
      if (!isGIF && !isPNG && !isJPG && !isJPEG) {
        this.$message.error(this.Common.uploadImgTypeError);
        return false;
      }
      if (!ltSize) {
        this.$message.error(this.Common.uploadImgSizeError);
        return false;
      }
    },
    handlerUpload1(response, file, fileList) {
      if (response.code === 200) {
        this.fileList = [{ name: response.data.fileName, url: response.data.filePath }];
        this.c2AuthForm.pic1Url = response.data.filePath;
      }
      if (response.code === 500) {
        this.$message.error(this.Common.loadFail);
      }
    },
    handlerUpload2(response, file, fileList) {
      if (response.code === 200) {
        this.fileList = [{ name: response.data.fileName, url: response.data.filePath }];
        this.c2AuthForm.pic2Url = response.data.filePath;
      }
      if (response.code === 500) {
        this.$message.error(this.Common.loadFail);
      }
    },
    handlerUpload3(response, file, fileList) {
      if (response.code === 200) {
        this.fileList = [{ name: response.data.fileName, url: response.data.filePath }];
        this.c2AuthForm.pic3Url = response.data.filePath;
      }
      if (response.code === 500) {
        this.$message.error(this.Common.loadFail);
      }
    },
    handlerUpload4(response, file, fileList) {
      if (response.code === 200) {
        this.fileList = [{ name: response.data.fileName, url: response.data.filePath }];
        this.c2AuthForm.pic4Url = response.data.filePath;
      }
      if (response.code === 500) {
        this.$message.error(this.Common.loadFail);
      }
    },
    errUpload() {
      this.$message.error(this.Common.loadFail);
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
      const isUpload = !this.c2AuthForm.pic1Url && !this.c2AuthForm.pic2Url && !this.c2AuthForm.pic3Url && !this.c2AuthForm.pic4Url;
      if (isUpload) {
        this.$message.error(this.C2Auth.dialogCon[0]);
      } else if (!this.c2AuthForm.pic1Url) {
        this.$message.error(this.C2Auth.dialogCon[1]);
      } else if (!this.c2AuthForm.pic2Url) {
        this.$message.error(this.C2Auth.dialogCon[2]);
      } else if (!this.c2AuthForm.pic3Url) {
        this.$message.error(this.C2Auth.dialogCon[3]);
      } else if (!this.c2AuthForm.pic4Url) {
        this.$message.error(this.C2Auth.dialogCon[4]);
      } else {
        this.$refs.c2AuthForm.validate(async valid => {
          if (valid) {
            this.loading = true;
            const res =
              this.userInfo.c2Status === 2
                ? await this.updateC2Auth({
                    pic1Path: this.c2AuthForm.pic1Url,
                    pic2Path: this.c2AuthForm.pic2Url,
                    pic3Path: this.c2AuthForm.pic3Url,
                    pic4Path: this.c2AuthForm.pic4Url,
                  })
                : await this.c2Auth({
                    pic1Path: this.c2AuthForm.pic1Url,
                    pic2Path: this.c2AuthForm.pic2Url,
                    pic3Path: this.c2AuthForm.pic3Url,
                    pic4Path: this.c2AuthForm.pic4Url,
                  });
            if (res && res.code === 200) {
              this.$message.success(this.C2Auth.C2Suc);
              this.loading = false;
              this.goToBackUrl(`/u?section=${this.SettingData.section}`);
            } else {
              this.loading = false;
              this.$message.error(this.ErrorCode[res.code]);
            }
          } else {
            return false;
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~assets/css/_theme-conf';
.c2Auth {
  .personInfo {
    margin: 0 48px;
    padding: 48px 0;
    border-bottom: 1px dashed;
    @include cutLinePair(border-bottom-color);
    h3 {
      font-size: 16px;
      @include fontPair(color);
      i {
        padding-right: 8px;
        @include subFontPair(color);
      }
    }
    p {
      font-size: 12px;
      line-height: 24px;
      @include subFontPair(color);
    }
    .info {
      margin-top: 28px;

      > div {
        display: flex;
        justify-content: space-between;
        > dl {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          line-height: 36px;
        }

        dt {
          margin-right: 60px;
          @include subFontPair(color);
        }
        dd {
          @include fontPair(color);
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          font-weight: 500;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .content {
    margin: 0 48px;
    text-align: center;
    .uploadCon {
      border-bottom: 1px dashed;
      @include cutLinePair(border-bottom-color);
      .el-form-item {
        margin-bottom: 120px !important;
      }
      .upload {
        padding-right: 85px;
        overflow: hidden;

        img {
          width: 100%;
        }
      }
    }
    .demo {
      padding-left: 85px;
      line-height: 150% !important;
      dd {
        text-align: left;
        img {
          width: 212px;
        }
      }
      dt {
        width: 212px;
        text-align: center;
        font-size: 12px;
        line-height: 36px;
        @include fontPair(color);
      }
    }
    .determine {
      max-width: 280px;
      margin: 0 auto;
    }
  }
  .notice {
    font-size: 12px;
    line-height: 20px;
    text-align: left;
    padding: 72px 0px;
    @include subFontPair(color);
    dt {
      @include fontPair(color);
      margin-bottom: 15px;
    }
  }
}
</style>
