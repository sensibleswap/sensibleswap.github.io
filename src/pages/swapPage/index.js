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
import PairIntro from '../pairIntro';
import { connect } from 'umi';
import BigNumber from 'bignumber.js';
import { jc } from 'common/utils';



@connect(({ service, user, loading }) => {
    const { effects } = loading;
    return {
        ...service,
        ...user,
        loading: effects['service/queryTx'] || false
    }
})
export default class SwapPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            app_pannel: false
        }
    }

    componentDidMount() {
        this.fetch();
    }
    async fetch() {

        const { dispatch } = this.props;
        let { origin_token_id, aim_token_id } = this.props;
        // 若已经有用户选择的token则不变，若未选有空值则设置个初始值
        if (!origin_token_id || !aim_token_id) {
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
        // const res = await dispatch({
        //     type: 'service/queryTx',
        //     payload: {
        //         tokenids: [origin_token_id, aim_token_id]
        //     }
        // });
        // console.log(res)

    }

    findToken = (id) => {
        const { tokens } = this.props;
        return tokens.find(v => v.tokenId === id) || {}
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
        if (this.props.loading) return <Loading />
        const { origin_token_id, aim_token_id, pair_data } = this.props;
        const origin_token = this.findToken(origin_token_id);
        const aim_token = this.findToken(aim_token_id);
        if (!pair_data.detail || !origin_token) return <div>no data</div>
        const { pairLiquidity } = pair_data;
        let price = 0;
        if (pairLiquidity) {
            if (origin_token_id.toString() === pairLiquidity[0].tokenid) {
                price = BigNumber(pairLiquidity[1].amount).div(pairLiquidity[0].amount).toFixed(4).toString();
            }
            else if (aim_token_id.toString() === pairLiquidity[0].tokenid) {
                price = BigNumber(pairLiquidity[0].amount).div(pairLiquidity[1].amount).toFixed(4).toString();
            }
        }
        return <div className={styles.content}>
            <div className={styles.main_title}>
                <h2><span className={styles.strong}>{origin_token.symbol}</span>/{aim_token.symbol}</h2>
                <div className={styles.subtitle}><span className={styles.strong}>{price}</span> {aim_token.symbol} {_('per')} {origin_token.symbol} </div>
            </div>
            <Chart />
            <PairIntro data={pair_data.detail} />

            <h3 className={styles.title}>{origin_token.symbol}/{aim_token.symbol} {_('transactions')}</h3>
            <Transactions />
            <h3 className={styles.title}>{_('pair_stat')}</h3>
            <PairStat data={pair_data} />
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