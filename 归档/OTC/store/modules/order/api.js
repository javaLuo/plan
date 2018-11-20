import axios from '~/store/axios';

// 订单列表
// export function tradeList(params){
//   return axios.post('/otc/trade/order/queryUserTradePage', params)
// }

// 交易列表
export function tradingList(params) {
  return axios.post('/otc/ad/queryAdPage', params);
}

export function createOrder(params) {
  let url = parseInt(params.adType) === 0 ? '/otc/trade/order/common/create' : '/otc/trade/order/big/create';
  return axios.post(url, params);
}

//获取国家列表
export function getAreaList() {
  return axios.get('/kyc/sms/arealist');
}

export function queryUserTradePage(params) {
  return axios.post('/otc/trade/order/queryUserTradePage', params);
}

//查询订单状态
export function getTradeDetail(id) {
  return axios.get(`/otc/trade/detail/getTradeDetail/${id}`);
}
//查询申诉信息的类型
export function getAppealType() {
  return axios.get('/otc/user/appeal/getAppealType');
}

//确认放行
export function confirm(params) {
  return axios.post('/otc/trade/trade/confirm', params);
}
//已支付
export function pay(params) {
  return axios.post('/otc/trade/trade/pay', params);
}
//取消订单
export function cancel(params) {
  return axios.post('/otc/trade/trade/cancel', params);
}

//获取历史通知订单
export function queryTradeWebsocket(params) {
  return axios.get('/otc/trade/queryTradeWebsocket/' + params.userid);
}

//更改通知订单已阅状态
export function updateTradeWebsocket(params) {
  return axios.get('/otc/trade/updateTradeWebsocket/' + params.userid);
}
//查询当前订单的会话id
export function queryIMConvId(orderId) {
  return axios.get(`/otc/trade/queryImInfo/${orderId}`);
}
//添加当前订单的会话
export function addIMConv(params) {
  return axios.post('/otc/trade/insertImInfo', params);
}
