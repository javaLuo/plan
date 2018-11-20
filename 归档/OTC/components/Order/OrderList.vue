<template>
  <div class="order-list">
    <ul class="order-item"
        v-for="item in orderList"
        :key='item.id'>
      <li class="order-item-id">
        <a href="javascript:void(0)">{{item.id}}</a>
      </li>
      <li class="order-item-type">
        {{item.type}}
        <span>BTC</span>
      </li>
      <li class="order-item-amount">
        {{item.amount}}
        <span>BTC</span>
      </li>
      <li class="order-item-price">
        {{item.price}}
        <span>CNY</span>
      </li>
      <li class="order-item-total">
        {{item.total}}
        <span>CNY</span>
      </li>
      <li class="order-item-date">{{item.date}}</li>
      <li class="order-item-status">{{item.status}}</li>
      <li class="order-item-person">
        <a href="javascript:void(0)">{{item.person}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    orderList: {
      type: Array,
      required: true,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
  .order-list{
    .order-item{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      list-style: none;
      padding: 25px 32px;
      border-bottom: 2px solid #e2e1f0;
      a{
        color: #241c40;
        &:hover{
          color:#6858e8;
        }
      }
      &-id{
        flex: 0 0 180px;
      }
      &-type{
        flex: 0 0 80px;
      }
      &-amount{
        flex: 0 0 150px;
        text-align: right;
      }
      &-price{
        flex: 0 0 150px;
        text-align: right;
      }
      &-total{
        flex: 0 0 150px;
        text-align: right;
      }
      &-date{
        flex: 0 0 200px;
        margin-left: 75px;
      }
      &-status{
        flex: 0 0 80px;
      }
    }
  }
</style>

