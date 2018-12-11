import Storage from '~/utils/storage';

class i18n {
  constructor() {
    const lang = Storage.get('locale') || 'en_us';
    this.locale = this.get(lang);
  }
  get(locale) {
    return {
      App: {
        Home: require('./' + locale + '/App/Home'),
        Common: require('./' + locale + '/App/Common'),
        Login: require('./' + locale + '/App/Login'),
        Register: require('./' + locale + '/App/Register'),
        EhFindUser: require('./' + locale + '/App/EhFindUser'),
        Header: require('./' + locale + '/App/Header'),
        Footer: require('./' + locale + '/App/Footer'),
        C1Auth: require('./' + locale + '/App/C1Auth'),
        C2Auth: require('./' + locale + '/App/C2Auth'),
        Settings: require('./' + locale + '/App/Settings'),
        Password: require('./' + locale + '/App/Password'),
        FundsPwd: require('./' + locale + '/App/FundsPwd'),
        ForgotPassword: require('./' + locale + '/App/ForgotPassword'),
        Fee: require('./' + locale + '/App/Fee'),
        AccountDetail: require('./' + locale + '/App/AccountDetail'),
        Recharge: require('./' + locale + '/App/Recharge'),
        Trade: require('./' + locale + '/App/Trade'),
        WithDraw: require('./' + locale + '/App/WithDraw'),
        Address: require('./' + locale + '/App/Address'),
        PwdLevel: require('./' + locale + '/App/PwdLevel'),
        Prompt: require('./' + locale + '/App/Prompt'),
        Google: require('./' + locale + '/App/Google'),
        ErrorCode: require('./' + locale + '/App/ErrorCode'),
        RiskHints: require('./' + locale + '/App/RiskHints'),
        SilverList: require('./' + locale + '/App/SilverList'),
        TokenSell: require('./' + locale + '/App/TokenSell'),
        Bake: require('./' + locale + '/App/Bake'),
        Invitation: require('./' + locale + '/App/Invitation'),
      },
    };
  }
}

export default new i18n();
