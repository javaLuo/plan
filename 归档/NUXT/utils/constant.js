// 接口返回成功值
export const API_SUCESS = 1;
export const UNAUTHORIZED = 401;
export const TIMEOUT = 15000;


export const specialChar1 = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
export const specialChar2 = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

//手机号正则
export const phone = /^[1][3,4,5,7,8][0-9]{9}$/;
//4-11位数字的国外手机号码和国内手机号码
export const interPhone = /^(\d{4,11})$/;
//email地址
export const email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

export const NCLOGIN = 'nc_login'
export const NCLOGINH5 = 'nc_login_h5'