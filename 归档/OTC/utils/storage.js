import cookies from 'js-cookie';
import Configs from '~/common/config';
// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

const Storage = {
  get(key) {
    let value;
    try {
      value = cookies.get(key);
    } catch (ex) {
      // debug('cookies.get报错, ', ex.message);
    } finally {
      return value;
    }
  },
  set(key, val, path = '/') {
    try {
      cookies.set(key, val, { path, domain: Configs.DEFAULT.DOMAIN_URL });
    } catch (ex) {
      // debug('cookies.set报错, ', ex.message);
    }
  },
  remove(key) {
    cookies.remove(key, { domain: Configs.DEFAULT.DOMAIN_URL });
  },

  getItem(key) {
    let value;
    try {
      value = localStorage.getItem(key);
    } catch (ex) {
      // debug("localStorage.getItem报错, ", ex.message);
    } finally {
      return value;
    }
  },

  setItem(key, val) {
    try {
      // ios safari 无痕模式下，直接使用 localStorage.setItem 会报错
      localStorage.setItem(key, val);
    } catch (ex) {
      // debug("localStorage.setItem报错, ", ex.message);
    }
  },

  removeItem(key) {
    return localStorage.removeItem(key);
  },

  // Basic Data Type for zlib 加密方式暂时注释
  // getItemBasicZlib(key) {
  //   return Utils.zlibDecryption(this.getItem(key));
  // },
  // setItemBasicZlib(key, val) {
  //   this.setItem(key, Utils.zlibEncryption(val));
  // },

  // Reference Data Type
  getItemJson(key) {
    return this.getItem(key) !== null ? JSON.parse(this.getItem(key)) : {};
  },

  setItemJson(key, val) {
    this.setItem(key, JSON.stringify(val));
  },
  sessionsetItem(key, val) {
    try {
      // ios safari 无痕模式下，直接使用 localStorage.setItem 会报错
      sessionStorage.setItem(key, val);
    } catch (ex) {
      // debug("localStorage.setItem报错, ", ex.message);
    }
  },
  sessiongetItem(key) {
    let value;
    try {
      // ios safari 无痕模式下，直接使用 localStorage.setItem 会报错
      value = sessionStorage.getItem(key);
    } catch (ex) {
      // debug("localStorage.setItem报错, ", ex.message);
    } finally {
      return value;
    }
  },

  // getItemJsonZlib(key) {
  //   return this.getItem(key) !== null
  //     ? JSON.parse(Utils.zlibDecryption(this.getItem(key)))
  //     : {};
  // },
  // setItemJsonZlib(key, val) {
  //   this.setItem(key, Utils.zlibEncryption(JSON.stringify(val)));
  // }
};

export default Storage;
