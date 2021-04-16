'use strict';
import React, { Component } from 'react';
import { jc } from 'common/utils';
import CustomIcon from 'components/icon';
import TokenLogo from 'components/tokenicon';
import styles from './index.less';
import _ from 'i18n';
import { Button, Form, InputNumber } from 'antd';
import { DownOutlined, SettingOutlined, CloseOutlined } from '@ant-design/icons';
import SelectToken from '../selectToken';
import Setting from '../setting';
import { connect } from 'umi';
import Volt from 'lib/volt';
import Loading from 'components/loading';
import BigNumber from 'bignumber.js';
import { slippage_data, feeRate } from 'common/config';
import EventBus from 'common/eventBus';
import { formatAmount } from 'common/utils';

const { storage_name, defaultIndex, datas } = slippage_data;

const FormItem = Form.Item;
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


@connect(({ user, loading }) => {
    const { effects } = loading;
    return {
        ...user,
        loading: effects['service/queryTx'] || false
    }

})
export default class Swap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'form',
            formFinish: false,
            showDetail: true,
            origin_amount: 0,
            aim_amount: 0,
            slip: 0,
            fee: 0,
            lastMod: ''
            // bsvToToken: true,

        }
        this.formRef = React.createRef();
    }


    switch = async () => {
        const { dispatch, origin_token_id, aim_token_id } = this.props;
        await dispatch({
            type: 'user/save',
            payload: {
                origin_token_id: aim_token_id,
                aim_token_id: origin_token_id
            }
        });
        const { current } = this.formRef;
        const { origin_amount, aim_amount } = current.getFieldsValue(['origin_amount', 'aim_amount']);
        const { lastMod } = this.state;
        if (lastMod === 'origin') {
            current.setFieldsValue({
                aim_amount: origin_amount
            });
            this.calc(0, origin_amount);
            this.setState({
                lastMod: 'aim',
                aim_amount: origin_amount
            })
        } else if (lastMod === 'aim') {
            current.setFieldsValue({
                origin_amount: aim_amount,
            });
            this.calc(aim_amount, 0)
            this.setState({
                lastMod: 'origin',
                origin_amount: aim_amount,
            })
        }
    }

    showUI = (name) => {

        this.setState({
            page: name
        })
    }
    findToken = (id) => {
        const { tokens } = this.props;
        return tokens.find(v => v.tokenId === id)
    }

    changeOriginAmount = (value) => {

        if (value > 0) {
            const fee = BigNumber(value).multipliedBy(feeRate).toFixed(2).toString();
            this.setState({
                origin_amount: value,
                fee,
                lastMod: 'origin'
            });
            this.calc(value - fee);
        } else {
            this.formRef.current.setFieldsValue({
                aim_amount: 0,
            });
            this.setState({
                fee: 0,
                slip: 0,
                lastMod: '',
                aim_amount: 0,
            })
        }
    }

    changeAimAmount = (value) => {
        if (value > 0) {
            this.setState({
                aim_amount: value,
                lastMod: 'aim',
            });
            this.calc(0, value)
        } else {
            this.formRef.current.setFieldsValue({
                origin_amount: 0,
            });
            this.setState({
                fee: 0,
                slip: 0,
                lastMod: '',
                origin_amount: 0,
            })
        }



    }

    renderOriginToken() {
        const { origin_token_id } = this.props;
        const origin_token = this.findToken(origin_token_id);
        if (!origin_token) return <div>notoken</div>;
        return <div className={styles.box}>
            <div className={styles.coin}>
                <TokenLogo name={origin_token.name} icon={origin_token.icon} />
                <div className={styles.name}>{origin_token.symbol}</div>
                <DownOutlined onClick={() => this.showUI('selectToken_origin')} />
            </div>
            <FormItem
                name={'origin_amount'}>
                <InputNumber 
                    className={styles.input} 
                    onChange={this.changeOriginAmount} 
                    onPressEnter={this.changeOriginAmount} 
                    formatter={value => parseFloat(value || 0)}
                    min='0' 
                />
            </FormItem>
        </div>
    }

    renderAimToken() {
        const { aim_token_id, pair_data } = this.props;
        const aim_token = this.findToken(aim_token_id);
        if (!aim_token) return <div>notoken</div>;
        return <div className={styles.box}>
            <div className={styles.coin}>
            <div style={{ width: 40 }}>{aim_token.name && <TokenLogo name={aim_token.name} icon={aim_token.icon} />}</div>
                <div className={styles.name}>{aim_token.symbol || _('select')}</div>
                <DownOutlined onClick={() => this.showUI('selectToken_aim')} />
            </div>
            <FormItem
                name={'aim_amount'}>
                <InputNumber 
                    className={styles.input} 
                    type='number' 
                    onChange={this.changeAimAmount} 
                    onPressEnter={this.changeAimAmount} 
                    formatter={value => parseFloat(value || 0)}
                    min='0' 
                    max={Math.floor(pair_data.pairLiquidity ? pair_data.pairLiquidity[1].amount : 0)}
                 />
            </FormItem>
        </div>
    }

    setOriginBalance = () => {
        const { origin_token_id } = this.props;
        const origin_token = this.findToken(origin_token_id);

        const origin_amount = origin_token.value || 0;
        this.formRef.current.setFieldsValue({
            origin_amount,
        });
        this.setState({
            origin_amount
        })
        this.calc(origin_amount, 0)
        if (origin_amount > 0) {

            this.setState({
                // origin_amount,
                lastMod: 'origin',
                fee: BigNumber(origin_amount).multipliedBy(feeRate).toFixed(2).toString()
            });
        } else {
            this.setState({
                lastMod: ''
            })
        }
    }
    // setAimBalance = () => {
    //     const { aim_token_id } = this.props;
    //     const aim_token = this.findToken(aim_token_id);
    //     const { pairLiquidity } = this.props.pair_data;

    //     this.formRef.current.setFieldsValue({
    //         aim_amount: aim_token.value || 0,
    //         origin_amount: BigNumber(aim_token.value || 0).multipliedBy(pairLiquidity[0].amount).div(pairLiquidity[1].amount).toFixed(4).toString(),
    //     });
    //     this.setState({
    //         origin_amount,
    //         aim_amount
    //     });
    //     // this.calc()
    // }

    calc = (origin_amount = 0, aim_amount = 0) => {
        //TODO: aim_amount不能大于池里token的数量，但交互要怎么展示
        //TODO: origin_amount不能比手续费小
        const { origin_token_id, aim_token_id, pair_data } = this.props;
        const { pairLiquidity } = pair_data;
        let amount1, amount2;
        pairLiquidity.forEach(item => {
            if (item.tokenid === origin_token_id) {
                amount1 = item.amount;
            }
            if (item.tokenid === aim_token_id) {
                amount2 = item.amount;
            }
        })
        const total = BigNumber(amount1).multipliedBy(amount2);
        const p = BigNumber(amount2).dividedBy(amount1);
        let newAmount1 = amount1, newAmount2 = amount2;
        if (origin_amount > 0) {
            newAmount1 = BigNumber(amount1).plus(origin_amount);
            newAmount2 = total.dividedBy(newAmount1);
        } else if (aim_amount > 0) {
            newAmount2 = BigNumber(amount2).minus(aim_amount);
            newAmount1 = total.dividedBy(newAmount2);
        }
        const p1 = BigNumber(newAmount2).dividedBy(newAmount1);
        const slip = (p1.minus(p)).dividedBy(p);

        this.setState({
            slip: slip.multipliedBy(100).abs().toFixed(2).toString() + '%',
        });
        if (origin_amount > 0) {
            const v_aim = formatAmount(BigNumber(amount2).minus(newAmount2))
            this.formRef.current.setFieldsValue({
                aim_amount: v_aim
            })
            this.setState({
                aim_amount: v_aim
            })
        } else if (aim_amount > 0) {
            let v_origin = BigNumber(newAmount1).minus(amount1).dividedBy(1 - feeRate);
            this.formRef.current.setFieldsValue({
                origin_amount: formatAmount(v_origin)
            });
            this.setState({
                fee: formatAmount(v_origin.multipliedBy(feeRate), 2),
                origin_amount: formatAmount(v_origin)
            })
        } else {
            //两个值都没有大于0
            this.formRef.current.setFieldsValue({
                origin_amount,
                aim_amount
            });
            this.setState({
                origin_amount,
                aim_amount
            })

        }

    }

    renderForm = () => {
        const { origin_token_id, aim_token_id, pair_data } = this.props;
        const origin_token = this.findToken(origin_token_id);
        const aim_token = this.findToken(aim_token_id) || {};
        if (!origin_token) return null;
        const { slip, fee, lastMod } = this.state;
        const { pairLiquidity } = pair_data;
        let price = 0;
        let amount1, amount2;
        if (pairLiquidity) {
            pairLiquidity.forEach(item => {
                if (item.tokenid === origin_token_id) {
                    amount1 = item.amount;
                }
                if (item.tokenid === aim_token_id) {
                    amount2 = item.amount;
                }
            })
            price = BigNumber(amount1).dividedBy(amount2).toFixed(4).toString();

        }
        const tol = datas[window.localStorage.getItem(storage_name)] || datas[defaultIndex];
        const beyond = parseFloat(slip) > parseFloat(tol);

        return <div className={styles.content}>
            <Form onSubmit={this.handleSubmit} ref={this.formRef}>
                <div className={styles.title}>
                    <h3>{_('you_pay')}</h3>
                    <div className={styles.balance} onClick={this.setOriginBalance}>{_('your_balance')}: <span>{origin_token.value || 0} {origin_token.symbol}</span></div>
                </div>
                {this.renderOriginToken()}

                <div className={styles.switch_icon}>
                    <div className={styles.icon} onClick={this.switch}>
                        <CustomIcon type='iconswitch' style={{ fontSize: 20 }} />
                    </div>
                    <div className={styles.line}></div>
                </div>

                <div className={styles.title}>
                    <h3>{_('you_receive')} <span className={styles.normal}>({_('estimated')})</span></h3></div>

                {this.renderAimToken()}

                <div className={styles.key_value}>
                    <div className={styles.key}>{_('price')}</div>
                    <div className={styles.value}>1 {origin_token.symbol} = {price} {aim_token.symbol}</div>
                </div>
                <div className={styles.key_value}>
                    <div className={styles.key}>{_('slippage_tolerance')}</div>
                    <div className={styles.value}>{tol}</div>
                </div>
                {this.renderButton()}
                <div className={styles.key_value}>
                    <div className={styles.key}>{_('price_impact')}</div>
                    <div className={styles.value} style={beyond ? { color: 'red' } : {}}>{slip}</div>
                </div>
                <div className={styles.key_value}>
                    <div className={styles.key}>{_('fee')}</div>
                    <div className={styles.value}>{fee} {origin_token.symbol}</div>
                </div>
            </Form>
        </div>
    }

    login() {
        EventBus.emit('login')
    }

    renderButton() {
        const { isLogin, origin_token_id, pair_data } = this.props;
        const { slip, lastMod, origin_amount, aim_amount  } = this.state;
        const origin_token = this.findToken(origin_token_id);

        const tol = datas[window.localStorage.getItem(storage_name)] || datas[defaultIndex];
        const beyond = parseFloat(slip) > parseFloat(tol);
        if (!isLogin) {
            // 未登录
            return <Button className={styles.btn_wait} onClick={this.login}>{_('login')}</Button>
        } else if (!pair_data.pairLiquidity) {
            // 不存在的交易对
            return <Button className={styles.btn_wait}>{_('no_pair')}</Button>
        } else if (!lastMod) {
            // 未输入数量
            return <Button className={styles.btn_wait}>{_('enter_amount')}</Button>
        } else if (parseFloat(origin_amount) > parseFloat(origin_token.value || 0)) {
            // 余额不足
            return <Button className={styles.btn_wait}>{_('lac_balance')}</Button>
        } else if (parseFloat(aim_amount) > pair_data.pairLiquidity[1].amount) {
            // 池中币不足
            return <Button className={styles.btn_wait}>{_('not_enough')}</Button>
        } else if (beyond) {
            // 超出容忍度
            return <Button className={styles.btn_warn} onClick={this.submit}>{_('swap_anyway')}</Button>
        } else {
            return <Button className={styles.btn} type='primary' onClick={this.submit}>{_('swap')}</Button>
        }

    }

    submit = async () => {
        const { current } = this.formRef;
        const { origin_amount, aim_amount } = current.getFieldsValue(['origin_amount', 'aim_amount']);
        this.setState({
            formFinish: true,
            origin_amount,
            aim_amount
        })
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
        const { showDetail, origin_amount, aim_amount, fee } = this.state;
        const { origin_token_id, aim_token_id, accountName } = this.props;
        const origin_token = this.findToken(origin_token_id);
        const aim_token = this.findToken(aim_token_id);

        return <div className={styles.content}>
            <div className={styles.finish_logo}>
            </div>
            <div className={styles.finish_title}>{_('swapping_for').replace('%1', origin_token.symbol).replace('%2', aim_token.symbol)}</div>

            {showDetail ? <div className={styles.detail}>
                <div className={styles.detail_title}>{_('tx_details')}
                    {/*<span className={styles.detail_close}><CloseOutlined onClick={this.closeDetail} /></span>*/}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className={styles.detail_item}>
                        <div className={styles.item_label}>{_('status')}</div>
                        <div className={styles.item_value}>0 {_('confirmation')}</div>
                    </div>
                    <div className={styles.detail_item}>
                        <div className={styles.item_label}>{_('volt_account')}</div>
                        <div className={styles.item_value}>{accountName}</div>
                    </div>

                </div>
                <div className={styles.detail_item}>
                    <div className={styles.item_label}>{_('paid')}</div>
                    <div className={styles.item_value}>{origin_amount} {origin_token.symbol}</div>
                </div>
                <div className={styles.detail_item}>
                    <div className={styles.item_label}>{_('received')}</div>
                    <div className={styles.item_value}>{aim_amount} {aim_token.symbol}</div>
                </div>
                <div className={styles.detail_item}>
                    <div className={styles.item_label}>{_('swap_fee')}</div>
                    <div className={styles.item_value}>{fee} {origin_token.symbol}</div>
                </div>
                <div className={styles.detail_item}>
                    <div className={styles.item_label}>{_('date')}</div>
                    <div className={styles.item_value}>{ }</div>
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

    selectedToken = (tokenId) => {
        if (tokenId) {
            const { page } = this.state;
            const { origin_token_id, aim_token_id, dispatch } = this.props;
            // const _token = tokens.find(v => v.tokenId === tokenId);
            if (page === 'selectToken_origin') {

                dispatch({
                    type: 'user/save',
                    payload: {
                        origin_token_id: tokenId
                    }

                })
                dispatch({
                    type: 'service/queryTx',
                    payload: {
                        tokenids: [tokenId, aim_token_id]
                    }
                })
            }
            if (page === 'selectToken_aim') {

                dispatch({
                    type: 'user/save',
                    payload: {
                        aim_token_id: tokenId
                    }

                })
                dispatch({
                    type: 'service/queryTx',
                    payload: {
                        tokenids: [origin_token_id, tokenId]
                    }
                })
            }
        }
        this.showUI('form');
    }

    render() {
        const { page } = this.state;
        if (this.props.loading) return <Loading />
        return <div style={{ position: 'relative' }}>
            {this.renderSwap()}
            <div style={{ position: 'absolute', top: 0, left: 0, display: (page === 'selectToken_origin' || page === 'selectToken_aim') ? 'block' : 'none' }}><SelectToken close={(id) => this.selectedToken(id, page)} /></div>
            <div style={{ position: 'absolute', top: 0, left: 0, display: page === 'setting' ? 'block' : 'none' }}><Setting close={() => this.showUI('form')} /></div>
        </div>
    }
}