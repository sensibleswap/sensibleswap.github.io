'use strict';
import React, { Component } from 'react';
import { Spin } from 'antd';
import QRCode from 'qrcode.react';
import CustomIcon from 'components/icon';
import styles from './index.less';
import _ from 'i18n';
import Volt from 'lib/volt';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadUrls: {},
      url_loading: true,
      login_url: 'url'
    }
  }

  componentDidMount() {
    const login_url = Volt.getLoginUrl()
    this.setState({ login_url })
    let url = 'https://volt.id/download_link';
    let _self = this;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(function (res) {
      // console.log(res)
      _self.setState({
        downloadUrls: res,
        url_loading: false
      });
    });
  }

  refreshUrl = () => {
    const login_url = Volt.getLoginUrl();
    this.setState({ login_url });
    
  }

  render() {
    const { downloadUrls, url_loading, login_url } = this.state;
    return (<div className={styles.container}>
      <div className={styles.qrcode_wrap}>
        <div className={styles.title}>{_('connect_volt')}</div>
        <div className={styles.desc}>{_('scan_app')}</div>
        <div className={styles.qrcode} onClick={this.refreshUrl} title={_('refresh_url')}>
          <QRCode value={login_url} style={{ width: '160px', height: '160px' }} />
        </div>
      </div>

      <div className={styles.tk_desc}>{_('token_desc')}
        {_('download_app_1')} <a href="http://volt.id/" target="_blank  ">Volt.id</a> {_('download_app_2')}
      </div>
      <div className={styles.brands}>
        <Spin spinning={url_loading}><a href={downloadUrls.ios_store} target='_blank'><CustomIcon type="iconapple-app-store" style={{ fontSize: 128, marginRight: 20 }} /></a></Spin>
        <Spin spinning={url_loading}><a href={downloadUrls.ios_testflight} target='_blank'><CustomIcon type="icontestflight-ios" style={{ fontSize: 128, marginRight: 20 }} /></a></Spin>
        <Spin spinning={url_loading}><a href={downloadUrls.google_store} target='_blank'><CustomIcon type="icongoogle-play1" style={{ fontSize: 128, marginRight: 20 }} /></a></Spin>
        <Spin spinning={url_loading}><a href={downloadUrls.android_apk} target='_blank'><CustomIcon type="iconandroid-apk1" style={{ fontSize: 128 }} /></a></Spin>
      </div>
    </div>);
  }
}