<template>
  <div class="panel-deposit">
    <div class="hd">
      {{i18n.App.WithDraw.assets}} / {{i18n.App.Recharge.recharge_title}}
    </div>
    <div class="bd">
      <div class="i coin">
        <div class="h">{{i18n.App.WithDraw.coin}}</div>
        <div class="b">
          <SelectServiceFee :type="'deposit'" />
        </div>
      </div>
      <div class="i address">
        <div class="h">{{i18n.App.Recharge.address}}</div>
        <div class="b">
          <DepositAddress />
        </div>
      </div>
      <div class="ft">
        <div class="h">
          <i class="iconfont icon-zhuyi"></i>{{i18n.App.WithDraw.Precautions}}</div>
        <div class="b">
          <div class="i df aifs">
            <div class="l"></div>
            <div class="r">{{i18n.App.Recharge.deposit_one}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="ft tip">
      tip
    </div> -->
  </div>
</template>

<script>
import SelectSearch from '../SelectSearch';
import DepositAddress from '../DepositAddress';
import SelectServiceFee from '../SelectServiceFee';
import { mapActions, mapState } from 'vuex';
export default {
  props: ['dataSource', 'onChange'],
  watch: {
    on() {
      this.onChange(this.on.toUpperCase());
    },
  },
  components: {
    SelectSearch,
    DepositAddress,
    SelectServiceFee,
  },
  data() {
    return {
      on: '',
    };
  },
  computed: {
    ...mapState(['assets', 'i18n']),
  },
  methods: {
    ...mapActions(['selectServiceFee']),
    querySearch(queryString, cb) {
      var dataSource = this.dataSource;
      var results = queryString ? dataSource.filter(this.createFilter(queryString)) : dataSource;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return dataSource => {
        return dataSource.coin.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    onSelect(item) {
      // console.log(item);
    },
    onClick(ev) {
      // console.log(ev);
    },
    test() {
      // console.log(this);
    },
    onCopy() {
      if (!this.address) return;
      copy(this.address);
      this.$message.success('success');
    },
  },
  async mounted() {},
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_theme-conf';
.panel-deposit {
  @include bgPair(background-color);
  padding: 30px 26px;
  .tip {
    color: #f56c6c;
    font-size: 12px;
  }
  .hd {
    margin-bottom: 38px;
    font-size: 18px;
    @include fontPair(color);
  }
  .bd {
    .i {
      .h {
        @include subFontPair(color);
        margin-bottom: 8px;
      }
      &:first-child {
        margin-bottom: 25px;
      }
    }
  }
  .ft {
    .h {
      margin-top: 46px;
      margin-bottom: 16px;
      @include fontPair(color);
      i {
        margin-right: 6px;
        color: #df543a;
      }
    }
    .b {
      .i {
        .l {
          border-radius: 10px;
          padding: 3px;
          background: #a2aaca;
          margin-right: 10px;
          margin-top: 7px;
        }
        .r {
          @include fontPair(color);
          letter-spacing: 0;
          line-height: 22px;
        }
      }
    }
  }
}
</style>