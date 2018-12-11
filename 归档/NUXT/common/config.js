import Storage from '~/utils/storage';

const env = process.env.myEnv || 'dev';
// otc-api host
const otcHostAPI = {
  rightbtccc: 'https://api.rightbtc.cc',
  szzc: 'https://api.szzc.io',
  btcright: 'https://api.btcright.pro',
  prod: 'https://api.rightbtc.com',
  rc: 'https://api.btchft.com',
  test: 'http://api.tulipex.space',
  dev: 'http://api.wengtianmeng.com',
};

const otcHost = {
  rightbtccc: 'https://otc.rightbtc.cc',
  szzc: 'https://otc.szzc.io',
  btcright: 'https://otc.btcright.pro',
  prod: 'https://otc.rightbtc.com',
  rc: 'https://otc.btchft.com',
  test: 'http://otc.tulipex.space',
  dev: 'http://10.10.10.250:3000',
};

const rgihtBTCAPIHost = {
  rightbtccc: 'https://api.rightbtc.cc',
  szzc: 'https://api.szzc.io',
  btcright: 'https://api.btcright.pro',
  prod: 'https://api.rightbtc.com',
  rc: 'https://api.btchft.com',
  test: 'http://api.tulipex.space',
  dev: 'http://api.wengtianmeng.com',
};

const rgihtBTCHost = {
  rightbtccc: 'https://www.rightbtc.cc',
  szzc: 'https://www.szzc.io',
  btcright: 'https://www.btcright.pro',
  prod: 'https://www.rightbtc.com',
  rc: 'https://www.btchft.com',
  test: 'http://www.tulipex.space',
  dev: 'http://10.10.10.250:4000',
};

const wsHost = {
  rightbtccc: 'wss://api.rightbtc.cc',
  szzc: 'wss://api.szzc.io',
  btcright: 'wss://api.btcright.pro',
  prod: 'wss://api.rightbtc.com',
  rc: 'wss://api.btchft.com',
  test: 'ws://api.tulipex.space',
  dev: 'ws://api.wengtianmeng.com',
};

const domainHost = {
  rightbtccc: `.rightbtc.cc`,
  szzc: `.szzc.io`,
  btcright: `.btcright.pro`,
  prod: `.rightbtc.com`,
  rc: `.btchft.com`,
  test: `.tulipex.space`,
  dev: ``,
};

// user 开头等
const originalHost = {
  rightbtccc: 'https://api.rightbtc.cc',
  szzc: 'https://api.szzc.io',
  btcright: 'https://api.btcright.pro',
  prod: 'https://api.rightbtc.com',
  rc: 'https://api.btchft.com',
  test: 'http://api.tulipex.space',
  dev: 'http://api.wengtianmeng.com',
};

// ticket 开头www.leftbtc.pro api.btchft.com backend.leftbtc.pro
const ticketHost = {
  rightbtccc: 'https://api.rightbtc.cc',
  szzc: 'https://api.szzc.io',
  btcright: 'https://api.btcright.pro',
  prod: 'https://api.rightbtc.com',
  rc: 'https://api.btchft.com',
  test: 'http://api.tulipex.space',
  dev: 'http://api.wengtianmeng.com',
};

// const locale = Storage.get('locale') || 'en_us'; //这个TMD locale是tulipex的,不是OTC的  vue-cookies  PK  universal-cookie

class Configs {
  static get DEFAULT() {
    return {
      mu: 'USD', //默认交易对 主板
      zi: 'BTC', //主板
      smu: 'BTC', //默认交易对 创业板
      szi: 'CL', //创业板
      ENV: env,
      UPLOAD_API: originalHost[env] + '/kyc/manager/file/s3upload',
      OTC_API: otcHostAPI[env],
      OTC: otcHost[env],
      RB_API: rgihtBTCAPIHost[env],
      RB: rgihtBTCHost[env],
      ORIGINAL_API: originalHost[env],
      TICKET_API: ticketHost[env],
      WS_API: wsHost[env],
      DOMAIN_URL: domainHost[env],
    };
  }
}
export default Configs;
