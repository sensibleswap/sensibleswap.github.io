'use strict';
import React, { Component } from 'react';
import { jc } from 'common/utils';
import CustomIcon from 'components/icon';
import styles from './index.less';
import _ from 'i18n';
import { Button } from 'antd';
import {DownOutlined, SettingOutlined, CloseOutlined} from '@ant-design/icons';
import SelectToken from '../selectToken';
import Setting from '../setting';
import { connect } from 'umi';
import Volt from 'lib/volt';

const toAddress = "1EgWmJUAXpB9ruMg67eAkuEvjqXu9jd7iA";
const amount = 0.1;

const menu = [
    {
        key: 'market',
        label: _('market')
    },
    // {
    //     key: 'limit',
    //     label: _('limit'),
    // }
];

@connect(({ user }) => {
    return {
        ...user
    }

})
export default class Swap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'form',
            formFinish: false,
            showDetail: false,
            bsvToToken: true,
            bsvValue: 0,
            tokenValue: 0
        }
    }

    componentDidMount() {

    }

    switch = () => {
        this.setState({
            bsvToToken: !this.state.bsvToToken
        })
    }

    showUI = (name) => {

        this.setState({
            page: name
        })
    }

    renderBsv() {
        const {bsvValue} = this.state;
        return <div className={styles.box}>
            <div className={styles.coin}>
                <CustomIcon type='iconlogo-bitcoin' style={{ fontSize: 40, marginRight: 10 }} />
                <div className={styles.name}>BSV</div>
                <DownOutlined onClick={() => this.showUI('selectToken')} />
            </div>
            <input className={styles.input} value={bsvValue} onChange={(e)=>{
                this.setState({
                    bsvValue: e.target.value
                })
            }} />
        </div>
    }

    renderToken() {
        const { tokenValue} = this.state;
        return <div className={styles.box}>
            <div className={styles.coin}>
                <CustomIcon type='iconlogo-vusd' style={{ fontSize: 40, marginRight: 10 }} />
                <div className={styles.name}>vUSD</div>
                <DownOutlined onClick={() => this.showUI('selectToken')} />
            </div>
            <input className={styles.input} value={tokenValue} onChange={(e) => {
                this.setState({
                    tokenValue: e.target.value
                })
            }} />
        </div>
    }

    renderForm() {
        const { bsvToToken } = this.state;
        const { balance } = this.props;
        return <div className={styles.content}>
            <div className={styles.title}>
                <h3>{_('you_pay')}</h3>
                <div className={styles.balance} onClick={()=>{
                    this.setState({
                        bsvValue: balance
                    })
                }}>{_('your_balance')}: <span>{balance} BSV</span></div>
            </div>
            {bsvToToken ? this.renderBsv() : this.renderToken()}

            <div className={styles.switch_icon}>
                <div className={styles.icon} onClick={this.switch}>
                    <CustomIcon type='iconswitch' style={{ fontSize: 20 }} />
                </div>
                <div className={styles.line}></div>
            </div>

            <div className={styles.title}>
                <h3>{_('you_receive')} <span className={styles.normal}>({_('estimated')})</span></h3></div>

            {bsvToToken ? this.renderToken() : this.renderBsv()}

            <div className={styles.key_value}>
                <div className={styles.key}>{_('price')}</div>
                <div className={styles.value}>1 BSV = 255 vUSD </div>
            </div>
            <div className={styles.key_value}>
                <div className={styles.key}>{_('slippage_tolerance')}</div>
                <div className={styles.value}>0.5%</div>
            </div>
            <Button className={styles.btn} onClick={this.submit}>{_('enter_amount')}</Button>
            <div className={styles.key_value}>
                <div className={styles.key}>{_('minimum_received')}</div>
                <div className={styles.value}>1989 vUSD</div>
            </div>
            <div className={styles.key_value}>
                <div className={styles.key}>{_('price_impact')}</div>
                <div className={styles.value}>0.28%</div>
            </div>
            <div className={styles.key_value}>
                <div className={styles.key}>{_('fee')}</div>
                <div className={styles.value}> 6 vUSD</div>
            </div>
        </div>
    }

    submit = async () => {
        const { wid } = this.props;
        // const res = await Volt.createBsvTx({
        //     amount,
        //     toAddress,
        //     wid

        // });
        // console.log(res);
        // this.setState({
        //     formFinish: true
        // })
    }

    viewDetail = () => {
        this.setState({
            showDetail: true
        })
    }
    closeDetail = () => {
        this.setState({
            showDetail: false
        })
    }

    renderResult() {
        const { showDetail } = this.state;
        return <div className={styles.content}>
            <div className={styles.finish_logo}>
            </div>
            <div className={styles.finish_title}>{_('swapping_for').replace('%1', 'BSV').replace('%2', 'vUSD')}</div>
            <div className={styles.finish_desc}>{_('time_left', '1:33')}</div>

            {showDetail ? <div className={styles.detail}>
                <div className={styles.detail_title}>{_('tx_details')}
                    <span className={styles.detail_close}><CloseOutlined onClick={this.closeDetail} /></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className={styles.detail_item}>
                        <div className={styles.item_label}>{_('status')}</div>
                        <div className={styles.item_value}>0 {_('confirmation')}</div>
                    </div>
                    <div className={styles.detail_item}>
                        <div className={styles.item_label}>{_('volt_account')}</div>
                        <div className={styles.item_value}>My Swap Tokens</div>
                    </div>

                </div>
                <div className={styles.detail_item}>
                    <div className={styles.item_label}>{_('paid')}</div>
                    <div className={styles.item_value}>5 BSV</div>
                </div>
                <div className={styles.detail_item}>
                    <div className={styles.item_label}>{_('received')}</div>
                    <div className={styles.item_value}>1021.977 VUSD</div>
                </div>
                <div className={styles.detail_item}>
                    <div className={styles.item_label}>{_('swap_fee')}</div>
                    <div className={styles.item_value}>0.1% = $1.023</div>
                </div>
                <div className={styles.detail_item}>
                    <div className={styles.item_label}>{_('date')}</div>
                    <div className={styles.item_value}>08 Aug 2020 at 10:23:15 pm</div>
                </div>
                <div className={styles.detail_item}>
                    <div className={styles.item_label}>{_('onchain_tx')}</div>
                    <div className={styles.item_value}>Block @23923656</div>
                </div>
            </div> : <div className={styles.view_detail} onClick={this.viewDetail}>{_('view_tx_detail')}</div>}
            <Button className={styles.done_btn}>{_('done')}</Button>
        </div>
    }


    renderSwap() {

        const { formFinish } = this.state;

        return <div className={styles.container}>
            <div className={styles.head}>
                <div className={styles.menu}>
                    {menu.map(item => {
                        let cls = jc(styles.menu_item, styles[`menu_item_${item.key}`]);
                        if (item.key === menu[0].key) {
                            cls = jc(styles.menu_item, styles.menu_item_selected, styles[`menu_item_${item.key}`]);
                        }
                        return <span className={cls} onClick={() => this.gotoPage(item.key)} key={item.key}>{item.label}</span>
                    })}
                </div>
                <div className={styles.setting}>
                <SettingOutlined onClick={() => this.showUI('setting')} />
                </div>
            </div>
            {formFinish ? this.renderResult() : this.renderForm()}

        </div>;
    }

    render() {
        const { page } = this.state;
        if (page === 'form') {
            return this.renderSwap()
        } else if (page === 'selectToken') {
            return <SelectToken close={() => this.showUI('form')} />
        } else if (page === 'setting') {
            return <Setting close={() => this.showUI('form')} />
        }
    }
}