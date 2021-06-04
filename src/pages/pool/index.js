'use strict';
import React, { Component } from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Chart from 'components/chart';
import Loading from 'components/loading';
import styles from './index.less';
import _ from 'i18n';

import Header from '../layout/header';
import Liquidity from '../liquidity';
// import PairStat from '../pairStat';
// import PairIntro from '../pairIntro';
import { connect } from 'umi';
import { jc } from 'common/utils';

@connect(({ pair, loading }) => {
    const { effects } = loading;
    return {
        ...pair,
        loading: effects['pair/getAllPairs'] || effects['pair/getPairData']
    }
})
export default class Pool extends Component {
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

        const { loading, token1, token2 } = this.props;
        if (loading) return <Loading />
        return <div className={styles.content}>
            <div className={styles.main_title}>
                <h2><span className={styles.strong}>{token1.symbol}</span>/{token2.symbol}</h2>
                <div className={styles.subtitle}>{_('pair_lip_pool')}</div>
            </div>
            <Chart />
        </div>;
    }

    render() {
        const { app_pannel } = this.state;
        return (<section className={styles.container}>
            <section className={app_pannel ? jc(styles.left, styles.app_hide) : styles.left}>
                <div className={styles.left_inner}>
                    <Header />
                    {this.renderContent()}
                    <Button type="primary" className={styles.app_start_btn} onClick={this.showPannel}>{_('start_pooling')}</Button>
                </div>
            </section>
            <section className={styles.right}>
                <div className={app_pannel ? styles.sidebar : jc(styles.sidebar, styles.app_hide)}>
                    <div className={styles.app_title}>
                        {_('pool')}
                        <div className={styles.close} onClick={this.hidePannel}><CloseOutlined /></div>
                    </div>
                    <Liquidity />
                </div>
            </section>
        </section>)
    }
}