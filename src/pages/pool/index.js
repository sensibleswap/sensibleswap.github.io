'use strict';
import React, { Component } from 'react';
import Chart from 'components/chart';
import Loading from 'components/loading';
import styles from './index.less';
import _ from 'i18n';

import HeadLeft from '../layout/head/headLeft';
import HeadRight from '../layout/head/headRight';
import Liquidity from '../liquidity';
import PairStat from '../pairStat';
import PairIntro from '../pairIntro';
import { connect } from 'umi';

@connect(({ service, user, loading }) => {
    const { effects } = loading;
    return {
        ...service,
        ...user,
        loading: effects['service/queryTx'] || false
    }
})
export default class Pool extends Component {

    // componentDidMount() {
    //     this.init()
    // }
    // async init() {
    //     const { dispatch } = this.props;
    //     await dispatch({
    //         type: 'user/save',
    //         payload: {
    //             origin_token_id: 'BSV',
    //             aim_token_id: ''
    //         }
    //     });
    // }


    findToken = (id) => {
        const { tokens } = this.props;
        return tokens.find(v => v.tokenId === id)
    }

    renderContent() {

        const { loading, origin_token_id, aim_token_id, pair_data, tokens } = this.props;
        if (loading || tokens.length < 1) return <Loading />
        const origin_token = this.findToken(origin_token_id);
        const aim_token = this.findToken(aim_token_id);
        return <div className={styles.content}>
            <div className={styles.main_title}>
                <h2><span className={styles.strong}>{origin_token.symbol}</span>/{aim_token ? aim_token.symbol : 'Select Token'}</h2>
                <div className={styles.subtitle}>{_('pair_lip_pool')}</div>
            </div>
            {pair_data.brokenLine ? <Chart /> : <div className={styles.first}>
                <div className={styles.first_title}>{_('first_liq_er')}</div>
                <div className={styles.first_desc}>{_('first_liq_er_desc')}</div>
            </div>}

            <PairIntro data={pair_data.detail} />

            {(origin_token_id && aim_token_id && pair_data.totalLiquidity) && <><h3 className={styles.title}>{_('pair_stat')}</h3><PairStat data={pair_data} /></>}
            {/*<h3 className={styles.title}>BSV/vUSD {_('transactions')}</h3>
    <Transactions />*/}
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