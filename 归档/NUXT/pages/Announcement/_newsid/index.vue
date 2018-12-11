<template>
  <div class="detail">
    <el-breadcrumb class="breadcrumb"
                   separator="/">
      <el-breadcrumb-item :to="{path: '/'}">{{Prompt.about}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/announcement'}">{{Prompt.news}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: ''}">{{Prompt.newsDetail}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main"
         v-if="newsDetail.noticeId">
      <h2 class="title">{{newsDetail.title}}</h2>
      <p class="date">{{newsDetail.createTimeStamp | moment('YYYY-MM-DD HH:mm:ss')}}</p>
      <div class="content"
           v-html="newsDetail.content"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import * as type from '~/store/modules/settings/type';

export default {
  data() {
    return {};
  },
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.newsid);
  },
  computed: {
    ...mapState({
      Prompt: state => state.i18n.App.Prompt,
      newsDetail: state => state.settings.newsDetail,
    }),
  },
  methods: {
    ...mapActions({
      getActiveNews: type.GET_NEWS_DETAIL,
    }),
  },
  async mounted() {
    await this.getActiveNews({
      noticeID: this.$router.history.current.params.newsid,
    });
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/_theme-conf';
.detail {
  margin: 30px auto 96px;
  padding: 0 10px;
  max-width: 1200px;
  .main {
    margin-top: 20px;
    padding: 48px 60px;
    background-color: #fff;
    .title {
      font-weight: normal;
      font-size: 18px;
      color: $light003;
      text-align: center;
    }
    .date {
      font-size: 12px;
      color: $light004;
      text-align: center;
      margin: 10px auto 48px;
    }
    .content {
      font-size: 14px;
      color: $light003;
      line-height: 21px;
      letter-spacing: 0.36px;
      word-break: break-all;
      p {
        margin-bottom: 45px;
      }
    }
  }
}
</style>

