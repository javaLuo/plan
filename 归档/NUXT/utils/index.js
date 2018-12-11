import big from './big';
import { email, phone } from './constant';
import moment from 'moment';

const Utils = {
  ...big,
  each(o, callback) {
    if (this.isObj(o)) {
      for (let key in o) {
        callback(o[key], key);
      }
    }
    if (this.isArray(o)) {
      for (let i = 0; i < o.length; i++) {
        callback(o[i], i);
      }
    }
  },
  isObj(o) {
    return Object.prototype.toString.call(o) == '[object Object]';
  },
  isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
  },
  isEmail(v) {
    return email.test(v);
  },
  isPhone(v) {
    return phone.test(v);
  },
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
  decodeUserName(val) {
    let resVal = '';
    if (this.isEmpty(val)) {
      return resVal;
    }
    let middleNum = Math.floor(val.length / 2);
    if (val.indexOf('@') > -1) {
      let mailPre = val.split('@')[0];
      if (mailPre.length <= 3) {
        resVal = '***' + '@' + val.split('@')[1];
      } else {
        resVal = mailPre.slice(0, 3) + '****@' + val.split('@')[1];
      }
    } else {
      resVal = val.slice(0, middleNum - 2) + '****' + val.slice(middleNum + 2);
    }

    return resVal;
  },
  // 去除两边的空格
  trim(name = '') {
    return name.replace(/(^\s*)|(\s*$)/g, '');
  },
  // 去重数组对象
  unique(arr, name) {
    let hash = {};
    return arr.reduce(function(item, next) {
      hash[next[name]] ? '' : (hash[next[name]] = true && item.push(next));
      return item;
    }, []);
  },
  // 首字母大写转换
  titleCase(str) {
    var array = str.toLowerCase().split(' ');
    for (var i = 0; i < array.length; i++) {
      array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);

      //array[i][0] = array[i][0] + 'A' - 'a';
    }
    var string = array.join(' ');

    return string;
  },
  clearNoNum(value) {
    value = value.replace(/[^\d.]/g, ''); //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
    value = value
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.');
    value = value.replace(/^(\-)*(\d+)\.(\d\d\d\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (value.indexOf('.') < 0 && value != '') {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      value = parseFloat(value);
    }
    return value;
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
  correctNumber(value) {
    value = value.replace(/[^\d.]/g, ''); //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
    value = value
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.');
    value = value.replace(/^(\-)*(\d+)\.(\d\d\d\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (value.indexOf('.') < 0 && value != '') {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      value = parseFloat(value);
    }
    if (`${value}`.indexOf('.') === 0 && value != '') {
      value = value.slice(1);
    }
    return value;
  },
  isMobile() {
    if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      return true;
    } else {
      return false;
    }
  },
  ForMatDate(val, format = 'YYYY-MM-DD HH:mm:ss') {
    //获取临时区时间

    return moment(val)
      .utc()
      .format(format);
  },
  ForMatDateDuBai(val, format = 'YYYY-MM-DD HH:mm:ss') {
    // 格式化时间（迪拜时间）
    return (
      moment(val)
        .utc()
        .add(4, 'h')
        .format(format) + ' (GMT+4)'
    );
  },
  scientificToNumber(num) {
    //科学计数法
    let str = num.toString();
    let reg = /^(\d+)(e)([\-]?\d+)$/;
    let arr,
      len,
      zero = '';
    /*6e7或6e+7 都会自动转换数值*/
    if (!reg.test(str)) {
      return num;
    } else {
      /*6e-7 需要手动转换*/
      arr = reg.exec(str);
      len = Math.abs(arr[3]) - 1;
      for (var i = 0; i < len; i++) {
        zero += '0';
      }
      return '0.' + zero + arr[1];
    }
  },
  getBrowserInfo() {
    //获取浏览器版本号信息
    let agent = navigator.userAgent.toLowerCase();
    let regStr_ie = /msie [\d.]+;/gi;
    let regStr_ff = /firefox\/[\d.]+/gi;
    let regStr_chrome = /chrome\/[\d.]+/gi;
    let regStr_saf = /safari\/[\d.]+/gi;

    //IE
    if (agent.indexOf('msie') > 0) {
      return agent.match(regStr_ie)[0];
    }
    //firefox
    if (agent.indexOf('firefox') > 0) {
      return agent.match(regStr_ff)[0];
    }
    //Safari
    if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
      return agent.match(regStr_saf)[0];
    }
    //Chrome
    if (agent.indexOf('chrome') > 0) {
      return agent.match(regStr_chrome)[0];
    }
  },
  getPlaformInfo() {
    return `language:${navigator.language}|os:${navigator.platform}|useragent:${this.getBrowserInfo()}|`;
  },
  sortBy(attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
      rev = 1;
    } else {
      rev = rev ? 1 : -1;
    }

    return function(a, b) {
      a = a[attr];
      b = b[attr];
      if (a < b) {
        return rev * -1;
      }
      if (a > b) {
        return rev * 1;
      }
      return 0;
    };
  },
  getdate(newDate, oldDate, language) {
    let format = 'YYYY-MM-DD HH:mm:ss';
    let startDate = new Date(
      moment(newDate)
        .utc()
        .add(4, 'h')
        .format(format),
    ).getTime();
    let endDate = new Date(
      moment(oldDate)
        .utc()
        .add(4, 'h')
        .format(format),
    ).getTime();
    let period = endDate - startDate;
    var yearLevelValue = 365 * 24 * 60 * 60 * 1000;
    var monthLevelValue = 30 * 24 * 60 * 60 * 1000;
    var dayLevelValue = 24 * 60 * 60 * 1000;
    var hourLevelValue = 60 * 60 * 1000;
    var minuteLevelValue = 60 * 1000;
    var secondLevelValue = 1000;
    function getDifference(period) {
      /*******计算出时间差中的年、月、日、天、时、分、秒*******/
      var year = parseInt(getYear(period));
      var month = parseInt(getMonth(period - year * yearLevelValue));
      var day = parseInt(getDay(period - year * yearLevelValue - month * monthLevelValue));
      var hour = parseInt(getHour(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue));
      var minute = parseInt(getMinute(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue - hour * hourLevelValue));
      var second = parseInt(getSecond(period - year * yearLevelValue - month * monthLevelValue - day * dayLevelValue - hour * hourLevelValue - minute * minuteLevelValue));
      var result = '';
      if (month <= 0 && day <= 0 && hour <= 0 && minute <= 0) {
        return `${language.late}`;
      }
      if (hour < 1 && minute !== 0) {
        result = `${minute}${language.minutes}`;
      }
      if (hour >= 1 && day === 0) {
        result = `${hour}${language.hours}`;
      }
      if (day >= 1 && month === 0) {
        result = `${day}${language.days}`;
      }
      if (month >= 1 && year === 0) {
        result = `${month}${language.months}`;
      }
      if (year >= 1) {
        result = `${year}${language.years}`;
      }
      function getYear(period) {
        return parseInt(period) / yearLevelValue;
      }
      function getMonth(period) {
        return parseInt(period) / monthLevelValue;
      }
      function getDay(period) {
        return parseInt(period) / dayLevelValue;
      }
      function getHour(period) {
        return parseInt(period) / hourLevelValue;
      }
      function getMinute(period) {
        return parseInt(period) / minuteLevelValue;
      }
      function getSecond(period) {
        return parseInt(period) / secondLevelValue;
      }
      return result;
    }
    return getDifference(period);
  },
};
export default Utils;
