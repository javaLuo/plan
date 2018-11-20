import Storage from '~/utils/storage';

const env = process.env.__ENV || 'dev';
// otc-api host
const otcHost = {
  rightbtccc: 'https://api.rightbtc.cc',
  szzc: 'https://api.szzc.io',
  btcright: 'https://api.btcright.pro',
  prod: 'https://api.rightbtc.com',
  rc: 'https://api.btchft.com',
  test: 'http://api.tulipex.space',
  dev: 'http://api.wengtianmeng.com',
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

const rightbtcHost = {
  rightbtccc: 'https://www.rightbtc.cc',
  szzc: `https://www.szzc.io`,
  btcright: 'https://www.btcright.pro',
  prod: `https://www.rightbtc.com`,
  rc: `https://www.btchft.com`,
  test: `http://www.tulipex.space`,
  dev: `http://wengtianmeng.com:4000`,
};

const domainHost = {
  rightbtccc: `.rightbtc.cc`,
  szzc: `.szzc.io`,
  btcright: '.btcright.pro',
  prod: `.rightbtc.com`,
  rc: `.btchft.com`,
  test: `.tulipex.space`,
  dev: ``,
  // dev: `.wengtianmeng.com`,
};

const socketHost = {
  rightbtccc: 'wss://api.rightbtc.cc',
  szzc: `wss://api.szzc.io`,
  prod: `wss://api.rightbtc.com`,
  btcright: 'wss://api.btcright.pro',
  rc: `wss://api.btchft.com`,
  test: `ws://api.tulipex.space`,
  dev: `ws://api.wengtianmeng.com`,
};

class Configs {
  static get DEFAULT() {
    return {
      ENV: env,
      UPLOAD_API: originalHost[env] + '/kyc/manager/file/uploadPublicFile',
      OTC_API: otcHost[env],
      ORIGINAL_API: originalHost[env],
      LOGIN_URL: rightbtcHost[env] + '/u/login',
      TULIPEX_URL: rightbtcHost[env],
      TRADE_URL: rightbtcHost[env] + '/trade',
      SOCKET_URL: socketHost[env],
      DOMAIN_URL: domainHost[env],
    };
  }
}
export default Configs;
