import axios from '~/store/axios';
import Configs from '~/common/config';

//获取资金记录
export function getTradeAssetList(params) {
  return axios.post('/otc/trade/asset/search', params);
}

//获取用户所有资产
export function getTradeAssetAll() {
  return axios.get('/otc/trade/asset/all');
}

// String currency// 0:"BTC",1:"ETH",2:"USD"
// Boolean otcToEx// true:法币转币币 false:币币转法币
// Integer amount //数量
//用户划账
export function transferAsset(params) {
  return axios.post('/otc/trade/asset/transferAsset', params);
}

//获取充币地址 ???
export function getDepositUrl(params) {
  return axios.get(`/newAudit-api/getUserDepositAddress/${params.asset}`);
}

//商家认证
export function businessAsk(params) {
  return axios.post('/otc/user/business/businessAsk', params);
}

//商家审批状态
export function getBusiInfo(params) {
  return axios.post('/otc/user/business/getBusiInfo', params);
}

// 商家取消认证
export function cancelBusiness(params) {
  return axios.post('/otc/user/business/businessRelieve', params);
}

/**
 * 普通商家升级大宗商家
 * params:
 * language:语言zh_cn/en_us
 * userName:昵称
 *  */
export function upLevel(params) {
  return axios.post('/otc/user/business/busiPromotion', params);
}
