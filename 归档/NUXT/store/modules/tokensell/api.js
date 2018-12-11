import axios from '~/store/axios';

// 根据ID获取打新活动详情
export function getTokenSellById(params) {
  return axios.get(`/admin-api/tokenSell/queryTokenSell/${params}`);
}

/** 获取换购记录
 * "tokenSellId":1,
	"currentPage":1,
	"pageSize":5
 * **/
export function getRecords(params) {
  return axios.post('/admin-api/ipo/getRecords', params);
}

// 查询用户某母币拥有的数量
export function queryUserSpecifiedAssetBalance(params) {
  return axios.get(`/finMan-api/NOTC/queryUserSpecifiedAssetBalance/${params}`);
}

/**
 * 下单
 *  **/
export function purchase(params) {
  return axios.post('/admin-api/ipo/purchase', params);
}

/**
 * 获取最新的活动
 * **/
export function getNewTokenSell(params) {
  return axios.get('/admin-api/tokenSell/queryLastTokenSell');
}
