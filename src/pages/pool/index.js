'use strict';
import React, { Component } from 'react';
import Chart from 'components/chart';
import Transactions from 'components/transactions';
import styles from './index.less';
import _ from 'i18n';

import HeadLeft from '../layout/head/headLeft';
import HeadRight from '../layout/head/headRight';
import Liquidity from '../liquidity';
import PairStat from '../pairStat';

export default class Pool extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    renderContent() {

        return <div className={styles.content}>
            <div className={styles.main_title}>
                <h2><span className={styles.strong}>BSV</span>/vUSD</h2>
                <div className={styles.subtitle}>{_('pair_lip_pool')}</div>
            </div>
            <Chart />
            <h3 className={styles.title}>Understanding Impermanent Loss</h3>
            <div className={styles.p}>
                <p className={styles.desc}>Before becoming a Liquidity Provider, please understand the risks involved with Impermanent Loss. You can learn more about it  Here. Providing liquidity to Tokenswap is highly risky. Before using the protocol, we highly recommend understanding the risks involved with being a Liquidity Provider (LP) and/or using the AMM to trade crypto assets. Dex is significantly safer than cex, but keep in mind there are still risks.</p>

            </div>
            <h3 className={styles.title}>Liquidity Provider Rewards</h3>
            <div className={styles.p}>
                <p className={styles.desc}>Liquidity Providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.</p>
            </div>
            <h3 className={styles.title}>{_('pair_stat')}</h3>
            <PairStat />
            <h3 className={styles.title}>BSV/vUSD {_('transactions')}</h3>
            <Transactions />
        </div>;
    }

    render() {
        return (<section className={styles.container}>
            <section className={styles.left}>
                <div className={styles.left_inner}>
                    <HeadLeft />
                    {this.renderContent()}
                </div>
            </section>
            <section className={styles.right}>
                <div className={styles.sidebar}>
                    <HeadRight />
                    <Liquidity />
                </div>
            </section>
        </section>)
    }
}