import axios from '~/store/axios';

// 获取用户所有资产数据
export function getUserAllMoney(params) {
  return axios.get(`/finMan-api/NOTC/queryUserAllAssetBalance/${params.userId}`);
}

// 获取烘焙活动详情
export function getProductList(params) {
  return axios.post('/baker/product/getProductList');
}

// 获取烘焙历史记录
export function getBakeHistory(params) {
  return axios.post('/baker/order/history', params);
}

// 创建订单
export function createBakeOrder(params) {
  return axios.post('/baker/order/createOrder', params);
}

// 取消烘焙
export function cancelBakeOrder(params) {
  return axios.post('/baker/order/cancelOrder', params);
}

// 获取市场数据
export function selectMarketData(params) {
  return axios.get('/front/tickers/1').then(res => {
    function formatGroup(data) {
      const ret = [];
      for (let key in data) {
        let item = data[key];

        ret.push({
          symbol: key,
          lists: item.map(it => {
            return {
              isLove: it.collect,
              symbol: it.market,
              lastPrice: it.last,
              change: it.rate,
              h: it.high24,
              l: it.low24,
              v: it.vol24,
            };
          }),
        });
      }
      return ret;
    }
    return {
      code: res.code,
      data: formatGroup(res.data),
      msg: res.msg,
    };
  });
}
