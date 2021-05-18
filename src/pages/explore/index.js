'use strict';
import React, { Component } from 'react';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { jc } from 'common/utils';
import styles from './index.less';
import _ from 'i18n';

import Header from '../layout/header';
import Footer from '../layout/footer';
import CustomIcon from 'components/icon';

export default class Explore extends Component {
    renderAbstract() {
        return <div className={styles.abstract}>
            <div className={styles.abs_item}>
                <div className={styles.label}>{_('volume_24')}</div>
                <div className={styles.value}>$10,000,000.00</div>
            </div>
            <div className={styles.abs_item}>
                <div className={styles.label}>{_('txs_24')}</div>
                <div className={styles.value}>$100,000,000.00</div>
            </div>
            <div className={styles.abs_item}>
                <div className={styles.label}>{_('fees_24')}</div>
                <div className={styles.value}>$60,000.00</div>
            </div>
            <div className={styles.abs_item}>
                <div className={styles.label}>{_('users_24')}</div>
                <div className={styles.value}>1,000</div>
            </div>
        </div>
    }

    gotoPage = () => {
        this.props.history.push('swap');
    }

    renderList() {
        return (<div className={styles.list_wrap}>
            <div className={styles.list}>
                <div className={styles.list_hd}>
                    <div className={styles.col_1}>{_('asset')}</div>
                    <div className={styles.col_2}>{_('price')}</div>
                    <div className={styles.col_3}>{_('change_24')}</div>
                    <div className={styles.col_4}>{_('last_7')}</div>
                    <div className={styles.col_5}>{_('volume')}</div>
                    <div className={styles.col_6}>{_('market_cap')}</div>
                </div>
                <div className={styles.list_item} onClick={() => this.gotoPage()}>
                    <div className={styles.col_1}>
                        <div className={styles.icon}><CustomIcon type='iconlogo-bitcoin' style={{ fontSize: 40 }} /></div>
                        <div className={styles.item_title}>
                            <div className={styles.item_fullname}>Bitcoin SV</div>
                            <div className={styles.item_symbol}>BSV</div>
                        </div>
                    </div>
                    <div className={styles.col_2}>$290.38</div>
                    <div className={jc(styles.col_3, styles.red)}><CaretUpOutlined /> 23.32%</div>
                    <div className={styles.col_4}>$102.42m</div>
                    <div className={styles.col_5}>$102.42m</div>
                    <div className={styles.col_6}>$5.65b</div>
                </div>
                <div className={styles.list_item} onClick={() => this.gotoPage()}>
                    <div className={styles.col_1}>
                        <div className={styles.icon}><CustomIcon type='iconlogo-vusd' style={{ fontSize: 40 }} /></div>
                        <div className={styles.item_title}>
                            <div className={styles.item_fullname}>vUSD</div>
                            <div className={styles.item_symbol}>vUSD</div>
                        </div>
                    </div>
                    <div className={styles.col_2}>$1.00</div>
                    <div className={jc(styles.col_3, styles.green)}><CaretDownOutlined /> 0.16%</div>
                    <div className={styles.col_4}>$210.23m</div>
                    <div className={styles.col_5}>$210.23m</div>
                    <div className={styles.col_6}>$2.56m</div>
                </div>
            </div>
        </div>);
    }

    render() {
        return (<section className={styles.container}>
            <Header />
            <section className={styles.content}>
                {this.renderAbstract()}
                <div className={styles.title}>{_('tokens_coins')}</div>
                {this.renderList()}
            </section>
            <Footer />
        </section>)
    }
}