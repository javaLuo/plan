import Utils from './index';
import moment from 'moment';
// ---------------NumberFormat---------------
//将数值四舍五入(保留2位小数)后格式化成金额形式
//@precision 精度
export const formatCurrency = (num, precision = 2, keep0cents = false) => {
  if (Number.isNaN(num) && Number.parseInt(num) === 0) return 0.0;
  let pre = Math.pow(10, precision);
  num = num + '';
  num = num.replace(/\$|\,/g, '');
  if (Number.isNaN(num)) num = '0';

  num = Math.floor(num * pre + 0.50000000001);
  let cents = num % pre;
  num = Math.floor(num / pre) + '';
  if (cents === 0) {
    cents = keep0cents ? '.00' : '';
  } else if (cents < 10) {
    cents = '.0' + cents;
  } else {
    cents = '.' + cents;
  }
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  return num + cents;
};

//将金额形式转换成数字形式
export const currencyToNormal = stringNum => {
  return stringNum.replace(/[^\d\.-]/g, '');
};

//把不是数字的当0返回
export const naN = num => {
  if (Number.isNaN(num)) return 0;
  return num;
};

// ---------------StringFormat---------------

//获取最后几位字符
const DEFAULT_LAST_CHAR = 4;
export const lastChar = (str, length = DEFAULT_LAST_CHAR) => {
  str = String(str);
  return str.substring(str.length - length);
};

// 获取首个字符
export const firstUpperChar = str => {
  if (!!str) {
    str = Utils.trim(str);
    return str.substr(0, 1).toUpperCase();
  }
  return '';
};

// ---------------TimeFormat---------------
export const normalTime = time => {
  if (time) {
    const oDate = new Date();
    oDate.setTime(time);
    const y = oDate.getFullYear();
    const month = oDate.getMonth() + 1;
    const d = oDate.getDate();
    const h = oDate.getHours();
    const m = oDate.getMinutes();
    const s = oDate.getSeconds();
    return y + '-' + month + '-' + d + ' ' + h + ':' + m + ':' + s;
  }
};

export const msToMinute = msTime => {
  // console.log(msTime,msTime/60000)
  return (msTime / 60000).toFixed(2);
};

export const dateFormat = timeString => {
  let formatString = String(timeString).split('T');
  return formatString[0];
};

export const dateTimeFormat = timeString => {
  let formatString = String(timeString).replace('T', ' ');
  return formatString;
};
//订单状态
export const orderSellerStatusText = val => {
  if (!val) {
    return '';
  }
  switch (val) {
    case 'CANCEL':
      return '已取消';
      break;
    case 'PENDING':
      return '待支付';
      break;
    case 'PAID':
      return '已支付';
      break;
    case 'FINISH':
      return '已完成';
      break;
    case 'APPEALING':
      return '申诉中';
      break;
    default:
      break;
  }
};

export const dubaiDate = function(val, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(val)
    .utc()
    .add(4, 'h')
    .format(format);
};
export const Fixed = function(val) {
  if (!val) return 0;
  return Utils.toFixed8(val);
};

// ---------------XXXFormat---------------
