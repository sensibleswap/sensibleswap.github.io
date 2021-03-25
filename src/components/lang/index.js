'use strict';
import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import {CaretDownOutlined} from '@ant-design/icons';
import { connect } from 'umi';
import Cookie from 'js-cookie';
import langs from 'i18n/langs';
import styles from './index.less';

// 获取当前页面的域名
const cookieDomain = '.' + document.domain.split('.').slice(document.domain.split('.').length - 2).join('.');

// 语言选择保存在cookie中
let currentLang = Cookie.get('lang') || navigator.language;
currentLang = currentLang.toLowerCase();
let langMatch = false;
for (let item of langs) {
  if (item.name === currentLang) {
    langMatch = true;
    break;
  }
}

// 默认中文
if (!langMatch) {
  currentLang = 'en-us';
}


// 生成语言选择的下拉菜单
let currentLangLabel;
let currentLangFlag;
const langMenus = langs.map(item => {
  if (item.name === currentLang) {
    currentLangLabel = item.label;
    currentLangFlag = 'flag-' + item.name
  }
  return (<Menu.Item key={item.name}>
    <i className={[styles.flag, styles['flag-' + item.name]].join(' ')}></i>
    {item.label}
  </Menu.Item>);
});

@connect(({ user }) => {
  return {
    ...user
  }
})
export default class PageFooter extends Component {
  changeLang({ key }) {
    if (currentLang === key) return;
    this.props.dispatch({
      type: 'user/save',
      payload: {
        lang: key,
      }
    })
    Cookie.remove('lang');
      Cookie.set('lang', key, {
        domain: cookieDomain,
      });
    // window.localStorage.setItem('lang', key);
    window.location.reload();
  }

  render() {
    const overlay = <Menu onClick={this.changeLang.bind(this)}>
      {langMenus}
    </Menu>
    return (<div style={this.props.style} className={styles.lang}>
      <Dropdown overlay={overlay}>
        <span className="ant-dropdown-link">
          <i className={[styles.flag, styles[currentLangFlag]].join(' ')}></i>
          {currentLangLabel} <CaretDownOutlined />
        </span>
      </Dropdown>
    </div>);
  }
}
