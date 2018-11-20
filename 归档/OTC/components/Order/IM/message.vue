<template>
  <div class="row">
    <div class="message-container"
         v-if="item.attributes"
         :style="{'flex-flow': item.from !== nickName ? 'row':'row-reverse' }">
      <Avatar :name="item.from|firstUpperChar"
              defaultBkColor="#9FB1DE" />
      <div class="message"
           v-if="!!item.attributes && item.attributes.type === 1">
        {{item.text}}
      </div>
      <div v-if="!!item.attributes && item.attributes.type === 2">
        <img :src="item.text"
             class="img-message"
             alt="">
      </div>

      <label class="last-read"
             v-if="isLastRead">{{OrderDetail.read}}</label>
      <label class="last-read"
             v-if="isLastDelivered">{{OrderDetail.unread}}</label>
    </div>
    <div class="message-time"
         v-if="item.attributes">
      {{item.timestamp|dubaiDate('HH:mm:ss')}}
    </div>
    <div class="im-title"
         v-if="!item.attributes">
      <div class="waring"
           v-if="isBuy && item.text !== 'APPEALING'">{{OrderDetail.IMBuyStatus[item.text]}} {{item.timestamp|dubaiDate('HH:mm:ss')}}</div>
      <div class="waring"
           v-else-if="isBuy && item.text === 'APPEALING'">{{` ${OrderDetail.IMBuyStatus[item.text].split('#No')[0]}${tradeNo}${OrderDetail.IMBuyStatus[item.text].split('#No')[1]} `}} {{item.timestamp|dubaiDate('HH:mm:ss')}}</div>

      <div class="waring"
           v-if="isSellr && item.text !== 'APPEALING'">{{OrderDetail.IMSellStatus[item.text]}} {{item.timestamp|dubaiDate('HH:mm:ss')}}</div>
      <div class="waring"
           v-else-if="isSellr && item.text === 'APPEALING'">{{` ${OrderDetail.IMSellStatus[item.text].split('#No')[0]}${tradeNo}${OrderDetail.IMSellStatus[item.text].split('#No')[1]} `}} {{item.timestamp|dubaiDate('HH:mm:ss')}}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Avatar from '~/components/Avatar.vue';
import leancloud from '~/utils/leancloud';
export default {
  components: {
    Avatar,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    nickName: {
      type: String,
      default: '',
    },
    lastReadAt: {},
    lastDeliveredAt: {},
    nextMessage: {
      type: Object,
      default: () => {},
    },
    isBuy: {
      type: Boolean,
      default: false,
    },
    isSellr: {
      type: Boolean,
      default: false,
    },
    tradeNo: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isLastRead: false,
      isLastDelivered: false,
    };
  },
  watch: {
    // lastReadAt(newVal, oldVal) {
    //   this.setLastRead();
    // },
    // lastDeliveredAt(newVal, oldVal) {
    //   this.setLastRead();
    // },
  },
  computed: {
    ...mapState({
      OrderDetail: state => state.i18n.App.OrderDetail,
    }),
  },
  mounted() {
    let watch = this.$watch(
      () => {
        return this.lastDeliveredAt + this.lastReadAt;
      },
      () => {
        if (this.lastReadAt) {
          if (!this.nextMessage) {
            if (this.item.timestamp <= this.lastReadAt) {
              this.isLastRead = true;
            }
          } else if (this.nextMessage.timestamp) {
            if (this.nextMessage.timestamp > this.lastReadAt) {
              if (this.item.timestamp <= this.lastReadAt) {
                this.isLastRead = true;
              }
            } else {
              this.isLastDelivered = false;
              this.isLastRead = false;
              //this.setLastRead();
              return watch();
            }
          }
        }
        if (this.isLastRead) {
          this.isLastDelivered = false;
          return;
        }
        if (this.lastDeliveredAt) {
          if (!this.nextMessage) {
            if (this.item.timestamp <= this.lastDeliveredAt) {
              this.isLastDelivered = true;
            }
          } else if (this.nextMessage.timestamp) {
            if (this.nextMessage.timestamp >= this.lastDeliveredAt) {
              if (this.item.timestamp <= this.lastDeliveredAt) {
                this.isLastDelivered = true;
              }
            } else {
              this.isLastDelivered = false;
            }
          }
        }
      },
    );
  },
  methods: {
    setLastRead() {
      if (this.lastReadAt) {
        if (!this.nextMessage) {
          if (this.item.timestamp <= this.lastReadAt) {
            this.isLastRead = true;
          }
        } else if (this.nextMessage.timestamp) {
          if (this.nextMessage.timestamp > this.lastReadAt) {
            if (this.item.timestamp <= this.lastReadAt) {
              this.isLastRead = true;
            }
          }
        } else {
          this.isLastDelivered = false;
          this.isLastRead = false;
          this.setLastRead();
          //watch();
        }
      }
      if (this.isLastRead) {
        this.isLastDelivered = false;
        return;
      }
      if (this.lastDeliveredAt) {
        if (!this.nextMessage) {
          if (this.item.timestamp <= this.lastDeliveredAt) {
            this.isLastDelivered = true;
          }
        } else if (this.nextMessage.timestamp) {
          if (this.nextMessage.timestamp > this.lastDeliveredAt) {
            if (this.item.timestamp <= this.lastDeliveredAt) {
              this.isLastDelivered = true;
            }
          }
        } else {
          this.isLastDelivered = false;
        }
      }
    },
  },
};
</script>

<style>
</style>
