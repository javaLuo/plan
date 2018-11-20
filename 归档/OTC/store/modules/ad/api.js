import axios from '~/store/axios';

//创建广告
export function create(params) {
  let api = parseInt(params.adType) === 0 ? '/otc/ad/common/create' : '/otc/ad/big/create';
  return axios.post(api, params);
}
//广告列表
export function list(params) {
  return axios.post('/otc/ad/queryUserAdPage', params);
}
//获取交易广告 这个都没用到啊，另外一个地方还有一个
export function adPageList(params) {
  return axios.post('/otc/ad/queryAdPage', params);
}
//获取个人广告信息
export function userAdList(postParams, getParams) {
  return axios.post('/otc/ad/queryOneUserAd/' + getParams.userId, postParams);
}

export function operateAdStatus(params) {
  return axios.post('/otc/ad/operateAdStatus', params);
}
//获取法币资产
export function getUserAccount(params) {
  return axios.post('/otc/ad/queryUserAccount', params);
}
//获取参考价格
export function getAveragePrice(params) {
  return axios.post('/otc/ad/getAveragePrice', params);
}
//获取支付方式
export function getUserPayList(params) {
  return axios.post('/otc/user/pay/getUserPayList', params);
}
//查询单价排名
export function adRankQuery(params) {
  return axios.post('/otc/ad/adRankQuery', params);
}
//价格排名
export function rankUnitPrice(params) {
  return axios.post('/otc/ad/rankUnitPrice', params);
}

//查询单挑广告信息
export function queryOneAdEdit(id) {
  return axios.get(`/otc/ad/queryOneAdEdit/${id}`);
}

//修改广告
export function edit(params) {
  return axios.post('/otc/ad/edit', params);
}
//验证资金密码
export function verifySecret(params) {
  return axios.post('/user/apikey/verifySecret', params);
}

//创建申诉
export function createAppeal(params) {
  return axios.post('/otc/trade/appeal/createAppeal', params);
}

//重新发布
export function rePublish(id) {
  return axios.get(`/otc/ad/rePublish/${id}`);
}

//查询当前币种的数量限制
export function rateAmount(params) {
  return axios.post('/otc/ad/limitRateAmount', params);
}
//广告交易历史
export function getAdTradeHistory(params) {
  return axios.get(`/otc/trade/trade/getAdTradeHistory/${params.id}`, { params: params });
}
//广告操作历史
export function getAdOperationHistory(params) {
  return axios.get(`/otc/trade/trade/getAdOperationHistory/${params.id}`, { params: params });
}
