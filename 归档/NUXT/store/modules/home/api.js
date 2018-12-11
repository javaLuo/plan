import axios from '~/store/axios';
import _ from 'lodash';

// 广告图列表
export function getMarquee(params) {
  return axios.post('/admin-api/banner/getMarquee', params);
}

//获取所有交易对
export function getAlltickers(params) {
  return axios.get('/front/tickers/1', params);
}

export function getAds(locale) {
  return axios.get(`https://rightbtc.zendesk.com/api/v2/help_center/${locale}/sections/360001693052/articles.json`, { withCredentials: false });
}
export function getRecommended() {
  return axios.get('/front/recommended');
}
