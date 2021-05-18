'use strict';
import React, { Component } from 'react';
import { Spin, Button } from 'antd';
import TokenLogo from 'components/tokenicon';
import styles from './index.less';
import _ from 'i18n';

export default class pay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posting: false
        }
    }

    render() {
        const { payCallback, data } = this.props;
        const { accountName, tokens, toAddress, } = data;
        return <Spin spinning={this.state.posting}>
            <div className={styles.pay_container}>
                <div className={styles.title}>{_('pay_account_title')}</div>
                {tokens.map(item => (
                    <div className={styles.amount}><TokenLogo name={item.name} icon={item.icon} style={{fontSize: 25}} /> {item.amount} {item.symbol} ≈  USD</div>
                ))}

                <div className={styles.item}>
                    <div className={styles.label}>{_('from_your')}</div>
                    <div className={styles.value}>{accountName}</div>
                </div>
                <div className={styles.item}>
                    <div className={styles.label}>{_('send_to')}</div>
                    <div className={styles.value}>{toAddress}</div>
                </div>
                <div className={styles.btns}>
                    <Button type="primary" className={styles.btn} onClick={() => payCallback(true)}>{_('pay')}</Button>
                    <span className={styles.cancel} onClick={() => payCallback(false)}>{_('cancel')}</span>
                </div>
            </div>
        </Spin>
    }
}