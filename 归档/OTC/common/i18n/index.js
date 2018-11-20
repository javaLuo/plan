import Storage from '~/utils/storage';
class i18n {
  constructor() {
    let lang = Storage.get('locale');
    // 目前只有中文和英文，但从rightBTC可能以日文跳转到OTC，所以这里处理一下
    if (!['zh_cn', 'en_us'].includes(lang)) {
      lang = 'en_us';
    }
    this.locale = this.get(lang);
  }
  get(locale) {
    return {
      App: {
        demo: require('./' + locale + '/Demo'),
        Header: require('./' + locale + '/Header'),
        Footer: require('./' + locale + '/Footer'),
        Common: require('./' + locale + '/Common'),
        Settings: require('./' + locale + '/Settings'),
        TradeList: require('./' + locale + '/TradeList'),
        AdList: require('./' + locale + '/AdList'),
        PublishAd: require('./' + locale + '/PublishAd'),
        OrderList: require('./' + locale + '/OrderList'),
        OrderDetail: require('./' + locale + '/OrderDetail'),
        Asset: require('./' + locale + '/Asset'),
        UserInfo: require('./' + locale + '/UserInfo'),
        Business: require('./' + locale + '/Business'),
        OrderMessage: require('./' + locale + '/OrderMessage'),
        ErrCode: require('./' + locale + '/ErrCode'),
      },
    };
  }
}

export default new i18n();
