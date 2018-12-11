import axios from '~/store/axios';
import qs from 'qs';

// 订单列表
export function newslist(params) {
  return axios.post('/user/newslist', params);
}

// 订单列表
export function selectOpenOrder(params) {
  let filter = null;
  if (params.filter == 'buy') {
    filter = '/1';
  }
  if (params.filter == 'sell') {
    filter = '/2';
  }
  if (params.filter == 'all') {
    filter = '';
  }
  return axios.get(`/transaction/activeOrders/${params.symbol}${filter}`).then(res => {
    const ret = res.data.activeOrders.map(item => {
      // private Long id;               //订单id
      // private String market;         //交易对
      // private BigDecimal lots;       //数量
      // private BigDecimal ticks;      //价格
      // private String side;           //1:bid,2:ask
      // private BigDecimal complots;   //已撮合数量
      // private BigDecimal fee;        //手续费
      // private String status;        //订单状态
      // private Integer createdBy;    //创建者
      // private Date createdAt;  //创建时间
      // private String type; //请求类型 LIMIT,MARKET
      return {
        id: item.id,
        date: item.createdAt,
        symbol: item.market,
        type: item.side == 1 ? 'buy' : 'sell',
        price: item.ticks,
        amount: item.lots,
        total: item.lots,
        executed: item.complots,
        loading: false,
      };
    });
    return {
      code: res.code,
      data: ret,
      msg: res.msg,
    };
  });
}

export function selectHistoryOrder(params) {
  let filter = null;
  if (params.filter == 'buy') {
    filter = '1';
  }
  if (params.filter == 'sell') {
    filter = '2';
  }
  if (params.filter == 'all') {
    filter = '';
  }
  return axios.get(`/transaction/historyOrders/${params.symbol}/${filter ? filter + '/' : ''}${params.page || 0}/${params.pageSize || 1000}`).then(res => {
    const ret =
      (res.data &&
        res.data.historyOrders &&
        res.data.historyOrders.map(item => {
          // private Long id;               //订单id
          // private String market;         //交易对
          // private BigDecimal lots;       //数量
          // private BigDecimal ticks;      //价格
          // private String side;           //1:bid,2:ask
          // private BigDecimal complots;   //已撮合数量
          // private BigDecimal fee;        //手续费
          // private String status;        //订单状态
          // private Integer createdBy;    //创建者
          // private Date createdAt;  //创建时间
          // private String type; //请求类型 LIMIT,MARKET
          return {
            id: item.id,
            date: item.createdAt,
            symbol: item.market,
            type: item.side == 1 ? 'buy' : 'sell',
            price: item.ticks,
            amount: item.lots,
            total: item.lots,
            executed: item.complots,
            loading: false,
          };
        })) ||
      [];
    return {
      code: res.code,
      data: ret,
      msg: res.msg,
    };
  });
}

export function saveWithDraw(params) {
  return axios.get(`/api/tvorders/?${qs.stringify(params)}`);
}

export function saveOrder(params) {
  const payload = {
    market: params.symbol.replace('/', ''),
    orderId: params.id,
  };
  //撤单
  if (params.type == 'withdraw') {
    return axios.post(`/transaction/cancelOrder/${payload.market}/${payload.orderId}`, params);
  }
}

export function addOrder(params) {
  //  private  String tradingPair; // 交易对
  //   private  String direction;//买卖方向 ，买：BUY，卖：SELL
  //   private BigDecimal limit; //价钱
  //   private BigDecimal coinCount; //交易数量
  //   private  String payPassword; // 交易密码
  //   private Integer userId;//用户id
  //   private BigDecimal balance; //可用资金
  //   private BigDecimal forzen; //冻结资金
  //   private Long orderId; //订单id
  //   private String asset; //资产
  //   private BigDecimal volume; //交易额
  const payload = {
    market: params.symbol,
    // "asset": "",       //
    // "balance": 0,
    coinCount: params.amount, //总数
    direction: params.type, // BUY || SELL
    // "forzen": 0,       //
    limit: params.price,
    // "orderId": 0,
    // "payPassword": "string",
    tradingPair: params.symbol,
    userId: params.userId,
    // "volume": 0
  };

  if (params.type == 'BUY') {
    return axios.post(`/transaction/createOrder/${params.symbol}`, payload);
  }

  if (params.type == 'SELL') {
    return axios.post(`/transaction/createOrder/${params.symbol}`, payload);
  }
}

/**  获取所有交易对信息 **/
export function selectGroup(params = {}) {
  // 0银榜，1主板，现在不分里，由前端手动筛选
  return axios.get(`/front/tickers/1`);
}

// {
//   collect,
//   market,
//   last,
//   rate,
//   high24,
//   low24,
//   vol24,
// selectMarked
// /front/collection/tickets/1
// }
// export function selectMarked(params = {}) {
//   // 以前分为0银榜，1主板，现在没分了，手动来筛选
//   return axios.get('/front/collection/tickets/1').then(res => {
//     let ret = [];
//     if (res && res.code === 200) {
//       Object.keys(data).forEach(key => {
//         ret.push({
//           symbol: key,
//           lists: data[key].map(it => {
//             return {
//               isLove: it.collect,
//               symbol: it.market,
//               lastPrice: it.last,
//               change: it.rate,
//               h: it.high24,
//               l: it.low24,
//               v: it.vol24,
//             };
//           }),
//         });
//       });

//       // 如果是银榜，需要筛选
//       if (params.isS) {
//         const tradeS = { mu: ['BTC', 'ETH'], zi: ['CL', 'MVC', 'IIC'] };
//         ret = ret.filter(item => tradeS.mu.includes(item.symbol));
//         ret.forEach(item => {
//           item.lists = item.lists.filter(itemli => tradeS.zi.includes(itemli.symbol));
//         });
//       }
//     }
//     return {
//       code: res.code,
//       data: ret,
//       msg: res.msg,
//     };
//   });
// }

// 获取用户所有收藏的交易对列表（貌似没用到啊，selectGroup里已经带有当前交易对是否被收藏的信息 collect）
export function selectMarked(params) {
  params = params || {};
  return axios
    .get(`/front/collection/tickets/${params.isS ? '0' : '1'}`)
    .then(res => {
      function formatGroup(data) {
        if (!data.length) {
          return [];
        }
        const ret = data.map(it => {
          return {
            isLove: it.collect,
            symbol: it.market,
            lastPrice: it.last,
            change: it.rate,
            h: it.high24,
            l: it.low24,
            v: it.vol24,
          };
        });
        return ret;
      }

      return {
        code: res.code,
        data: formatGroup(res.data),
        msg: res.msg,
      };
    })
    .then(res => {
      if (res.code == 200) {
        return res;
      }
      return {
        code: res.code,
        data: [],
        msg: res.msg,
      };
    });
}

// 获取最小交易量
export function selectMinAmount() {
  return axios.get(`/front/minAmount`).then(res => {
    const ret = {};
    for (let key in res.data) {
      const item = res.data[key];
      const arr = (item.min + '').split('.');
      ret[key] = {
        ...item,
        point: arr.length >= 2 ? arr[1].length : 0,
      };
    }
    return {
      code: res.code,
      data: ret,
      msg: res.msg,
    };
  });
}

// 获取交易对最新价格
export function findLastPrice(params) {
  const payload = {
    market: params.symbol,
  };
  return axios.get(`/transaction/latestTicker/${payload.market}`).then(res => {
    const ret = {};
    return {
      code: res.code,
      data: JSON.parse(res.data)[params.symbol],
      msg: res.msg,
    };
  });
}
// /finMan-api/NOTC/queryUserSpecifiedAssetBalance/{asset}

//获取用户可用 指定 币种 余额
export function selectAvaCoin(params) {
  // /finMan-api/NOTC/queryUserAllAssetBalance/{userId}
  // `/finMan-api/NOTC/queryUserSpecifiedAssetBalance/${params.coin}`
  return axios.get(`/finMan-api/NOTC/queryUserAllAssetBalance/${params.userId}`).then(res => {
    const ret = {};
    res.data.finlist.map(item => {
      ret[item.asset] = {
        coin: item.asset,
        ava: item.available_balance,
      };
    });
    // console.log(big.BigBumber(big.Number(Number(0.00000001))).toFixed(),9999999);
    return {
      code: res.code,
      data: ret,
      msg: res.msg,
    };
  });
}

export function saveLove(params) {
  console.log('参数都是什么：', params);
  const payload = {
    status: params.isLove ? '0' : '1',
    symbol: params.symbol,
  };
  return axios.get(`/front/marketCollect/${payload.symbol}/${payload.status}`);
}
