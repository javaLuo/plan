/** 交易类型 */
export const TRADE_TYPE_SELL = '0'; // 出售
export const TRADE_TYPE_BUY = '1'; // 购买

export const TRADE_TRAN_IN = 1; // 转入
export const TRADE_TRAN_OUT = 2; // 转出
export const TRADE_BUY_IN = 3; // 买入
export const TRADE_SODL_OUT = 4; // 卖出
export const TRADE_FREEZE = 5; // 冻结
export const TRADE_THAW = 6; // 解冻

/** 交易状态 */
export const TRADE_STATUS_CANCEL = 0; // 已取消
export const TRADE_STATUS_PAY_NO = 1; // 待支付
export const TRADE_STATUS_PAY_FINISH = 2; // 已支付
export const TRADE_STATUS_FINISH = 3; // 已完成
export const TRADE_STATUS_APPEAL = 4; // 申诉中

/**  广告类型 */
export const AD_TYPE_COMMON = 0; // 普通交易广告
export const AD_TYPE_SPECIAL = 1; // 大宗交易广告

/** 广告状态 */
export const AD_STATUS_ON = 0; // 发布中
export const AD_STATUS_OFF = 1; // 已下架
export const AD_STATUS_REST = 2; // 休息中
export const AD_STATUS_FINISH = 3; // 已完成
export const AD_STATUS_NONE = 4; // 售罄中

/** 交易币种 */
export const COIN_LIST = ['BTC', 'ETH', 'ETP', 'USD'];
export const BTC = 0; // BTC
export const ETH = 1; // ETH
export const USD = 2; // USD
export const ETP = 3; // ETP

/** 支付使用的币种 */
export const CNY = 0; // 人民币
export const USA = 1; // 美元

/** 支付方式 */
export const PAYPAL = 100; // PayPal
export const ALIPAY = 101; // 支付宝
export const WECHAT = 102; // 微信
export const BANK = 103; // 银行卡
export const EPAY = 104; // epay
export const PAYPAL_ID = 1; // PayPal
export const ALIPAY_ID = 2; // 支付宝
export const WECHAT_ID = 3; // 微信
export const BANK_ID = 4; // 银行卡
export const EPAY_ID = 5; // epay

/** 一口价 市场相对价格 */
export const PRICE_TYPE_COMMON = 0; //固定一口价
export const PRICE_TYPE_RELATIVE = 1; //市场相对溢价

/** 黑名单用户状态 */
export const DEF_STATUS_ENABLED = 1; //拉黑
export const DEF_STATUS_DISABLED = 0; //未拉黑

export const CUR_CASH = '2000 USD';
// const giftDictData = {
//   // 状态
//   state: {
//     '1': '启用',
//     '2': '禁用'
//   },
//   // 礼包类型
//   package_type: {
//     '1': '单次使用',
//     '2': '多次使用'
//   },
//   // 使用状态
//   usedState: {
//     '1': '未使用',
//     '2': '已使用'
//   }
// }

// export const giftDict = (key, dictType) => {
//   return giftDictData[dictType][key]
// }
