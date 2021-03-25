'use strict';
import Cookie from 'js-cookie';
const zh_cn = require('./locales/zh-ch');
const en_us = require('./locales/en-us');

// let locale = zh_cn;
export const lang = Cookie.get('lang') || navigator.language;

const langData = {
  'en-us': en_us,
  'zh-cn': zh_cn,
}
let locale = langData[lang.toLowerCase()];

if (!locale) {
  Cookie.set('lang', 'en-us', {
    domain: '.' + document.domain.split('.').slice(document.domain.split('.').length - 2).join('.')
  });
  locale = en_us;
}


export default function(key, params) {
  const args = arguments;
  if (!key) {
    return locale;
  }
  const val = locale[key];
  if (!val) {
    return '';
  }
  if (typeof val !== 'string') {
    return val;
  }
  let index = 1;
  if (typeof params === 'object') {
    return val.replace(/\$\{([\w]+)\}/g, (_, name) => {
      return params[name];
    });
  }
  return val.replace(/%s/g, () => {
    return args[index++];
  });
};
