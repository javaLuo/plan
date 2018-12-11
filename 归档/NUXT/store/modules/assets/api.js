import axios from '~/store/axios';
import big from './big';

//查询用户所有资产信息
export function selectAvaCoin(params) {
  return axios.get('/finMan-api/NOTC/queryUserAllAssetBalance').then(res => {
    res.data.finlist = res.data.finlist.concat().map(item => {
      return {
        coin: item.asset.toUpperCase(),
        ava: big.toFixed8(item.available_balance),
        total: big.toFixed8(item.totalAmount),
        frozen: big.toFixed8(item.frozen),
      };
    });
    //后台字段 有歧义
    res.data.eqBtc = big.toFixed8(res.data.totalUsdt);
    res.data.eqUsd = big.toFixed8(res.data.totalUsdt);
    return res;
  });
}

//查询用户充币地址   DA => deposit address
export function findDA(params) {
  return axios.get(`/newAudit-api/getUserDepositAddress/${params}`);
}

// 查询用户提币地址
// private String asset; WA => withdraw address
export async function selectWA(params) {
  return axios.post(`/newAudit-api/queryUserWithDrawAddress`, params).then(res => {
    res.data.content = res.data.content.concat().map(d => {
      return {
        coin: d.asset,
        address: d.address,
        remark: d.alias,
        id: d.id,
      };
    });

    return res;
  });
}

// 新增用户提币地址
// private String asset;
// private String alias;
// private String address;
export async function saveWA(params) {
  return axios.post(`/newAudit-api/saveUserWithDrawAddress`, params);
}

// 删除用户提币地址 http://10.10.10.247:8080/
export async function delWA(params) {
  return axios.post(`/newAudit-api/delUserWithDrawAddress`, params);
}
// params =>
// asset: ""
// pageNum: 1
// pageSize: 10
//查询充币记录 D => deposit
export function selectD(params) {
  return axios.post('/newAudit-api/queryDepositRecord', params).then(res => {
    res.data.content = res.data.content.concat().map(d => {
      return {
        coin: d.asset,
        time: d.depositTime,
        fee: big.toFixed8(d.indeedAmount),
        status: d.status,
        now: d.now,
        id: d.orderId,
        txid: d.txHash,
        address: d.depositDestAddress,
      };
    });
    return res;
  });
}

// params =>
// asset: ""
// pageNum: 1
// pageSize: 10
//查询提币记录 W => withdraw
export function selectW(params) {
  return axios.post('/newAudit-api/queryWithDrawAudit', params).then(res => {
    res.data.content = res.data.content.concat().map(d => {
      return {
        coin: d.asset,
        time: d.auditTime,
        fee: big.toFixed8(d.amount),
        status: d.withDrawStatus,
        now: d.now,
        txid: d.txHash,
        address: d.withdrawDestAddress,
        auditStatus: d.auditStatus,
      };
    });
    return res;
  });
}

// asset: "ODE"
// assetDecimal: 5
// baseFee: 20
// batchGeneratorAddressAmount: 10
// canAutoWithdraw: false
// canDeposit: true
// canWithDraw: true
// chnName: "ODE"
// exchangeMeomo: null
// fullName: "ODE"
// iconUrl: null
// id: 46
// isMemo: 0
// maxAutoWithdrawAmount: 3125
// maxDeposit: 0
// maxWithdraw: 1500
// minDeposit: 0
// minRecheckWithdrawAmount: 15625
// minSafeHeight: 12
// minSaveAddressAmount: 1
// minWithdraw: 20
// prefix: null
// withdrawalFeeRatio: 0.01
//所有币种手续费配置
// 提币手续费 = 基本费 + (数量 × 费率)
//
export function selectServiceFee(params = {}) {
  return axios.post('/newAudit-api/queryAuditConfig', params).then(res => {
    res.data = res.data.concat().map(item => {
      return {
        coin: item.asset,
        point: item.assetDecimal,
        fee: item.baseFee,
        canWithdraw: item.canWithDraw,
        canDeposit: item.canDeposit,
        minDeposit: item.minDeposit,
        minWithdraw: item.minWithdraw,
        maxWithdraw: item.maxWithdraw,
        maxDeposit: item.maxDeposit,
        feeRatio: item.withdrawalFeeRatio,
        baseFee: item.baseFee,
      };
    });
    return res;
  });
}

//验证资金密码接口
export function findPayPwd(params) {
  return axios.post(`/user/apikey/verifySecret`, params);
}

//提币接口
export function saveWOrder(params) {
  return axios.post(`/newAudit-api/saveUserAudit`, params);
}

//查询指定资产信息
export function findAvaCoin(params) {
  return axios.get(`/finMan-api/NOTC/queryUserSpecifiedAssetBalance/${params.coin}`).then(res => {
    if (!!res.data) {
      res.data = {
        coin: res.data.asset,
        ava: big.toFixed8(res.data.available_balance),
        frozen: big.toFixed8(res.data.frozen),
        id: res.data.id,
        total: big.toFixed8(res.data.totalAmount),
      };
      return res;
    }
    res.data = {
      coin: '',
      ava: '',
      frozen: '',
      id: '',
      total: '',
    };
    return res;
  });
}

// params =>
// asset: ""
// pageNum: 1
// pageSize: 10
//查询活动流水信息 AWb => active water bills
export function selectA(params) {
  return axios.post('/activity-api/sign/getTurnover', params).then(res => {
    res.data.list = res.data.list.concat().map(d => {
      return {
        coin: d.assetType,
        time: d.createTime,
        fee: big.toFixed8(d.amount),
        status: d.status,
        id: d.activityId,
        remark: d.name,
        description: d.description,
        name: d.name,
      };
    });
    return res;
  });
}

//获取交易对

// {
//   collect,
//   market,
//   last,
//   rate,
//   high24,
//   low24,
//   vol24,
// }
export function selectGroup(params) {
  params = params || {};
  return axios.get(`/front/tickers/${params.isS ? '0' : '1'}`).then(res => {
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

// 获取烘培资金历史
export function selectAssetsBake(params = {}) {
  return axios.post('/baker/order/queryAssetLogHistory', params);
}
