<template>
  <div class="announcement">
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{path: '/'}">{{Prompt.about}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/announcement/list'}">{{Prompt.news}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="layer">
      <div class="list">
        <el-row
          class="item"
          v-for="(item, index) in newsData.list"
          :key="index"
          >
          <el-col class="subject" :xs="18" :md="18" :lg="18">
            <nuxt-link :to="`/announcement/${item.noticeId}`">{{item.title}}</nuxt-link>
          </el-col>
          <el-col class="date" :xs="4" :md="4" :lg="4" :offset="2">{{item.publicationDate}}</el-col>
        </el-row>
      </div>
      <el-pagination
        background
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        @size-change="handlerSizeChange"
        @current-change="handlerCurrentChange"
        :current-page.sync="currentPage"
        layout="prev, pager, next, sizes"
        :total="newsData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import * as type from '~/store/modules/settings/type';

export default {
  data(){
    return{
      currentPage: 1,
      pageSize: 10,
      listParams: {
        language: 'en_us',
        currentPage: 1,
        pageSize: 10 
      }
    }
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      Prompt: state => state.i18n.App.Prompt,
      newsData: state => state.settings.newsData
    })
  },
  mounted(){
    this.handlerSizeChange();
  },
  methods:{
    ...mapActions({
      getNewsData: type.GET_NEWS_LIST
    }),
    handlerSizeChange(size){
      this.listParams.language = this.locale;
      this.listParams.pageSize = size;
      this.listParams.currentPage = this.currentPage;
      this.getNewsData(this.listParams)
    },
    handlerCurrentChange(page){
      this.listParams.language = this.locale;
      this.listParams.currentPage = page;
      this.listParams.pageSize = this.pageSize;
      this.getNewsData(this.listParams)
    }
  }  
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/_theme-conf';

  .announcement{
    max-width: 1180px;
    min-width: 1024px;
    min-height: 65vh;
    padding: 0 10px;
    margin: 30px auto 96px;
    .layer{
      margin-top: 20px;
      padding: 39px 29px 48px; 
      background-color: #fff;
      .item{
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: 10px 0;
        border-bottom:1px solid #ededef;
        .subject{
          color: $light003;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:after{
            content: 'Top';
            color: #fff;
            font-size: 6px;
            padding: 0 3px;
            margin-left: 5px;
            border-radius: 2px;
            transform: scale(0.5);
            background-color: #60cd8a;
          }
          a{
            color: $light003;
            &:hover{
              color: #7160ca;
            }
          }
        }
        .date{
          text-align: right;
          color:#727272;
        }
      }
      .el-pagination{
        margin-top: 22px;
        text-align: right;
      }
    }
  }
</style>
