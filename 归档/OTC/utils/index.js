import big from './big';
import moment from 'moment';

const Utils = {
  ...big,
  isString(v) {
    return Object.prototype.toString.call(v) === '[object String]';
  },
  isObject(v) {
    return Object.prototype.toString.call(v) === '[object Object]';
  },
  isEmptyString(v) {
    if (this.isString(v) && !v) {
      return true;
    }
    if (this.isString(v) && !v.length) {
      return true;
    }
    return false;
  },
  isEmpty(v) {
    if (!v) {
      return true;
    }
    if (!v.length) {
      return true;
    }
    return false;
  },
  // 去除两边的空格
  trim(name = '') {
    return name.replace(/(^\s*)|(\s*$)/g, '');
  },
  unique(arr, name) {
    let hash = {};
    return arr.reduce(function(item, next) {
      hash[next[name]] ? '' : (hash[next[name]] = true && item.push(next));
      return item;
    }, []);
  },
  getCookie(cookie, name) {
    //取cookies函数
    if (!!!cookie) {
      return null;
    }
    let arr = cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
    if (arr !== null) return unescape(arr[2]);
    return null;
  },
  getscientificToNumber(num) {
    //科学计数法
    let value = new Number(num);
    return value
      .toLocaleString()
      .split(',')
      .join();
  },
  // 格式化时间（迪拜时间）
  formatDateDuBai(val, format = 'YYYY-MM-DD HH:mm:ss') {
    return (
      moment(val)
        .utc()
        .add(4, 'h')
        .format(format) + ' (GMT+4)'
    );
  },
};
export default Utils;
