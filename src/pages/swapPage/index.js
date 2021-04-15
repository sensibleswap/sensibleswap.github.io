'use strict';
import React, { Component } from 'react';
import Chart from 'components/chart';
import Transactions from 'components/transactions';
import Loading from 'components/loading';
import styles from './index.less';
import _ from 'i18n';

import HeadLeft from '../layout/head/headLeft';
import HeadRight from '../layout/head/headRight';
import Swap from '../swap';
import PairStat from '../pairStat';
import { connect } from 'umi';
import Cookie from 'js-cookie';
import BigNumber from 'bignumber.js';

import walletApi from 'api/wallet';

const lang = Cookie.get('lang') || navigator.language;
const isZh = lang.toLowerCase() === 'zh-cn';


@connect(({ service, user, loading }) => {
    const { effects } = loading;
    return {
        ...service,
        ...user,
        loading: effects['service/queryTx'] || false
    }
})
export default class SwapPage extends Component {

    componentDidMount() {
        this.fetch();
    }
    async fetch() {

        const { dispatch} = this.props;
        let {origin_token_id, aim_token_id} = this.props;
        // 若已经有用户选择的token则不变，若未选有空值则设置个初始值
        if(!origin_token_id || !aim_token_id) {
            origin_token_id = 'BSV';
             aim_token_id = 'bf19e24d4e1a640be3925aa26ce9fbf38cbb7bb2';
        }
        await dispatch({
            type: 'user/save',
            payload: {
                origin_token_id,
                aim_token_id
            }
        });
        const res = await dispatch({
            type: 'service/queryTx',
            payload: {
                tokenids: [origin_token_id, aim_token_id]
            }
        })
        
    }

    findToken = (id) => {
        const {tokens} = this.props;
        return tokens.find(v => v.tokenId === id)
    }



    renderContent() {
        if(this.props.loading) return <Loading />
        const {origin_token_id, aim_token_id, pair_data} = this.props;
        const origin_token = this.findToken(origin_token_id);
        const aim_token = this.findToken(aim_token_id);
        if(!pair_data.detail || !origin_token) return <div>no data</div>
        const { pairLiquidity } = pair_data;
        let price = 0;
        if(pairLiquidity) {
            if(origin_token_id.toString() === pairLiquidity[0].tokenid) {
                price = BigNumber(pairLiquidity[1].amount).div(pairLiquidity[0].amount).toFixed(4).toString();
            }
            else if(aim_token_id.toString() === pairLiquidity[0].tokenid) {
                price = BigNumber(pairLiquidity[0].amount).div(pairLiquidity[1].amount).toFixed(4).toString();
            }
        }
        return <div className={styles.content}>
            <div className={styles.main_title}>
                <h2><span className={styles.strong}>{origin_token.symbol}</span>/{aim_token.symbol}</h2>
                <div className={styles.subtitle}><span className={styles.strong}>{price}</span> {aim_token.symbol} {_('per')} {origin_token.symbol} </div>
            </div>
            <Chart />
            {pair_data.detail.length > 0 && pair_data.detail.map((item, index) => {
                const {name, des_en, des_zh, web_url, id} = item;
                return <div key={id || index}>
                    <h3 className={styles.title}>{_('about')} {name}</h3>
                    <div className={styles.p}>
                        <p className={styles.desc}>{isZh ? des_zh : des_en}</p>
                        {web_url && <div className={styles.link}><a href={web_url} target='_blank'>{_('website')}</a></div>}
                    </div>
                </div>
            })}

            <h3 className={styles.title}>{origin_token.symbol}/{aim_token.symbol} {_('transactions')}</h3>
            <Transactions />
            <h3 className={styles.title}>{_('pair_stat')}</h3>
            <PairStat data={pair_data} />
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
                    <Swap />
                </div>
            </section>
        </section>)
    }
}