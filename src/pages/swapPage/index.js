'use strict';
import React, { Component } from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Chart from 'components/chart';
import Transactions from 'components/transactions';
import Loading from 'components/loading';
import styles from './index.less';
import _ from 'i18n';

import Header from '../layout/header';
import Swap from '../swap';
import PairStat from '../pairStat';
// import PairIntro from '../pairIntro';
import { connect } from 'umi';
import BigNumber from 'bignumber.js';
import { jc } from 'common/utils';



@connect(({  pair, loading }) => {
    const { effects } = loading;
    return {
        ...pair,
        loading: effects['pair/getAllPairs'] || effects['pair/getPairData']
    }
})
export default class SwapPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            app_pannel: false
        }
    }


    showPannel = () => {
        this.setState({
            app_pannel: true
        })
    }

    hidePannel = () => {
        this.setState({
            app_pannel: false
        })
    }


    renderContent() {
        const {loading, token1, token2, currentPair, pairData} = this.props
        if (loading) return <Loading />
        const price = BigNumber(pairData.swapToken1Amount).div(pairData.swapToken2Amount).toFixed(4).toString();
       
        return <div className={styles.content}>
            <div className={styles.main_title}>
                <h2><span className={styles.strong}>{token1.symbol}</span>/{token2.symbol}</h2>
                <div className={styles.subtitle}><span className={styles.strong}>{price}</span> {token2.symbol} {_('per')} {token1.symbol} </div>
            </div>
            <Chart />

            <h3 className={styles.title}>{token1.symbol}/{token2.symbol} {_('transactions')}</h3>
            <Transactions />
        </div>;
    }

    render() {
        const { app_pannel } = this.state;
        return (<section className={styles.container}>
            <section className={app_pannel ? jc(styles.left, styles.app_hide) : styles.left}>
                <div className={styles.left_inner}>
                    <Header />
                    {this.renderContent()}
                    <Button type="primary" className={styles.app_start_btn} onClick={this.showPannel}>{_('start_swapping')}</Button>
                </div>
            </section>
            <section className={styles.right}>
                <div className={app_pannel ? styles.sidebar : jc(styles.sidebar, styles.app_hide)}>
                    <div className={styles.app_title}>
                        {_('swap')}
                        <div className={styles.close} onClick={this.hidePannel}><CloseOutlined /></div>
                    </div>
                    <Swap />
                </div>
            </section>
        </section>)
    }
}