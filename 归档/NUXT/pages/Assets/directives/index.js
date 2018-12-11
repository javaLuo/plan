import app from '~/app';
import copy from 'copy-to-clipboard';

const directives = {};

directives.dateAgo = {
  bind: function () {},
  format(el, m) {
    const ago = m.value.ago;
    const now = m.value.now;
    const locale = m.value.locale;
    const i18n = {
      en_us: {
        m: 'minutes ago',
        h: 'hours ago',
        d: 'days ago',
        mon: 'months ago',
        y: 'years ago',
        now: 'just now',
      },
      zh_cn: {
        m: '分钟以前',
        h: '小时以前',
        d: '天以前',
        mon: '月以前',
        y: '年以前',
        now: '刚刚',
      },
      ja_jp: {
        m: '分前',
        h: '時間前',
        d: '日前',
        mon: 'ヶ月前',
        y: '年前',
        now: 'ちょうど今',
      },
      ru_ru: {
        m: 'Минуты назад',
        h: 'часа назад',
        d: 'Дня назад',
        mon: 'Месяца назад',
        y: 'Года назад',
        now: 'Только что',
      },
    };

    const lang = i18n[locale];

    const stpAgo = new Date(ago).getTime();
    const stpNow = new Date(now).getTime();
    const stpDiffer = stpNow - stpAgo;
    // 1 s
    const s1 = 1000;
    // 1 m
    const m1 = s1 * 60;

    // 1 hour
    const h1 = m1 * 60;

    // 1 day
    const d1 = h1 * 24;

    // 1 month
    const mon1 = d1 * 30;

    // 1 year
    const y1 = mon1 * 12;

    if (stpDiffer < h1) {
      //min
      const min = stpDiffer / m1;
      el.innerText = Math.floor(min) ? `${Math.floor(min)} ${lang.m}` : lang.now;
      return;
    }

    if (stpDiffer < d1) {
      //hour
      const hour = stpDiffer / h1;
      el.innerText = `${Math.floor(hour)} ${lang.h}`;
      return;
    }

    if (stpDiffer < mon1) {
      //day
      const day = stpDiffer / d1;
      el.innerText = `${Math.floor(day)} ${lang.d}`;
      return;
    }

    if (stpDiffer < y1) {
      //month
      const month = stpDiffer / mon1;
      el.innerText = `${Math.floor(month)} ${lang.mon}`;
      return;
    }

    //year
    const year = stpDiffer / y1;
    el.innerText = `${Math.floor(year)} ${lang.y}`;
  },
  inserted(el, m) {
    m.def.format(el, m);
  },
  update: function () {},
  componentUpdated: function (el, m) {
    m.def.format(el, m);
  },
  unbind: function () {},
};

directives.copy = {
  bind: function (el, m) {},
  format(el, m) {
    const val = m.value.val;
    const success = m.value.success;
    const error = m.value.error;
    const $ = require('jqlite');
    $(el)
      .off('click')
      .on('click', () => {
        if (copy(val)) {
          app.$message.success(success);
        } else {
          app.$message.error(error);
        }
      });
  },
  inserted(el, m) {
    m.def.format(el, m);
  },
  update: function () {},
  componentUpdated: function (el, m) {
    m.def.format(el, m);
  },
  unbind: function () {},
};

export default {
  ...directives,
};
