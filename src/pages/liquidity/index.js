'use strict';
import React, { Component } from 'react';
import { jc } from 'common/utils';
import TokenLogo from 'components/tokenicon';
import styles from './index.less';
import _ from 'i18n';
import { Steps, Button, Form, InputNumber, Spin, Modal } from 'antd';
import { QuestionCircleOutlined, DownOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import SelectToken from '../selectToken';
import { withRouter, connect } from 'umi';
import BigNumber from 'bignumber.js';
import { formatAmount } from 'common/utils';
// import EventBus from 'common/eventBus';
import Pay from 'components/pay';
import Volt from '../../lib/volt';

const { Step } = Steps;
const FormItem = Form.Item;

const menu = [
    {
        key: 'add',
        label: _('add_liq')
    },
    // {
    //     key: 'create',
    //     label: _('create_pair'),
    // }
];
@withRouter
@connect(({ pair, loading }) => {
    const { effects } = loading;
    return {
        ...pair,
        loading: effects['pair/getAllPairs'] || effects['pair/getPairData']
    }

})
export default class Liquidity extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 'form',
            formFinish: false,
            showDetail: false,
            currentMenuItem: menu[0].key,
            currentStep: 1,
            origin_amount: 0,
            aim_amount: 0,
            payVisible: false
        }
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.fetch()
    }

    async fetch() {

        const { dispatch, } = this.props;
        await dispatch({
            type: 'pair/getAllPairs',
        });

        let { currentPair } = this.props;
        await dispatch({
            type: 'pair/getPairData',
            payload: {
                currentPair
            }
        })
    }

    changeOriginAmount = (value) => {

        const { pairData } = this.props;

        this.setState({
            origin_amount: value,
        });
        const origin_amount = pairData.swapToken1Amount;
        const aim_amount = pairData.swapToken2Amount;
        const user_aim_amount = formatAmount(BigNumber(value).multipliedBy(aim_amount).div(origin_amount).toNumber());

        this.formRef.current.setFieldsValue({
            aim_amount: user_aim_amount,
        });
        this.setState({
            aim_amount: user_aim_amount,
        });
    }

    changeAimAmount = (value) => {

        const { pairData } = this.props;

        this.setState({
            aim_amount: value,
        });
        const origin_amount = pairData.swapToken1Amount;
        const aim_amount = pairData.swapToken2Amount;
        const user_origin_amount = formatAmount(BigNumber(value).multipliedBy(origin_amount).div(aim_amount).toNumber());

        this.formRef.current.setFieldsValue({
            origin_amount: user_origin_amount,
        });
        this.setState({
            origin_amount: user_origin_amount
        });



    }


    showUI = (name) => {

        this.setState({
            page: name
        })
    }

    renderStep() {
        const { currentStep } = this.state;
        return <Steps progressDot current={currentStep} className={styles.steps}>
            <Step title={_('select_pair')} />
            <Step title={_('add_liq')} />
            <Step title={_('promote')} />
        </Steps>
    }

    renderInfo() {
        const { token1, token2, pairData } = this.props;
        const { origin_amount = 0, aim_amount = 0 } = this.state;
        let total_origin_amount = origin_amount, total_aim_amount = aim_amount;
       
        total_origin_amount = formatAmount(BigNumber(origin_amount).plus(pairData.swapToken1Amount)).toString();
        total_aim_amount = formatAmount(BigNumber(aim_amount).plus(pairData.swapToken2Amount)).toString();
        const share = origin_amount > 0 ? formatAmount(BigNumber(origin_amount).div(total_origin_amount).multipliedBy(100), 2).toString() : 0
        return <div className={styles.my_pair_info}>
            <div className={styles.info_title_swap}>
                <div className={styles.info_title}>{_('pool_share')}</div>
                <div className={styles.help}><QuestionCircleOutlined /></div>
            </div>

            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('pooled')} {token1.symbol}</div>
                <div className={styles.info_value}>{total_origin_amount}</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('pooled')} {token2.symbol}</div>
                <div className={styles.info_value}>{total_aim_amount}</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('your_share')}</div>
                <div className={styles.info_value}>{share}%</div>
            </div>
        </div>
    }

    renderForm() {
        const { token1, token2, loading } = this.props;
        return <div className={styles.content}>
            <Spin spinning={loading}>
                <Form onSubmit={this.handleSubmit} ref={this.formRef}>
                    {this.renderStep()}
                    <div className={styles.title}>
                        <h3>{_('input')}</h3>
                        <div className={styles.balance}>{_('your_balance')}: <span>{token1.value || 0} {token1.symbol}</span></div>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.coin}>
                            <TokenLogo name={token1.symbol} />
                            <div className={styles.name}>{token1.symbol}</div>
                            <DownOutlined onClick={() => this.showUI('selectToken_origin')} />
                        </div>
                        <FormItem
                            name={'origin_amount'}>
                            <InputNumber className={styles.input} onChange={this.changeOriginAmount} min='0'
                                formatter={value => parseFloat(value || 0)} />
                        </FormItem>
                    </div>

                    <div className={styles.switch_icon}>
                        <PlusOutlined />
                    </div>


                    <div className={styles.title}>
                        <h3>{_('input')}</h3>
                        <div className={styles.balance}>{_('balance')}: <span>{token2.value || 0} {token2.symbol || ''}</span></div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.coin}>
                            <div style={{ width: 40 }}>{token2.symbol && <TokenLogo name={token2.symbol} />}</div>
                            <div className={styles.name}>{token2.symbol || _('select')}</div>
                            <DownOutlined onClick={() => this.showUI('selectToken_aim')} />
                        </div>
                        <FormItem
                            name={'aim_amount'}>
                            <InputNumber className={styles.input} onChange={this.changeAimAmount} min='0'
                                formatter={value => parseFloat(value || 0)} />
                        </FormItem>
                    </div>
                    {this.renderButton()}
                </Form>
            </Spin>
        </div>
    }

    login() {
        Volt.login()
    }


    renderButton = () => {
        const { isLogin, token1, token2 } = this.props;
        const { origin_amount, aim_amount } = this.state;
        if (!isLogin) {
            // 未登录
            return <Button className={styles.btn_wait} onClick={this.login}>{_('login')}</Button>
        } 
        // else if (!origin_token_id || !aim_token_id) {
        //     //未选择Token
        //     return <Button className={styles.btn_wait}>{_('select_a_token_pair')}</Button>
        // } 
        else if (parseFloat(origin_amount) <= 0 || parseFloat(aim_amount) <= 0) {
            // 未输入数量
            return <Button className={styles.btn_wait}>{_('enter_amount')}</Button>;
        } else if (parseFloat(origin_amount) > parseFloat(token1.value || 0)) {
            // 余额不足
            return <Button className={styles.btn_wait}>{_('lac_token_balance', token1.symbol)}</Button>
        } else if (parseFloat(aim_amount) > parseFloat(token2.value || 0)) {
            // 余额不足
            return <Button className={styles.btn_wait}>{_('lac_token_balance', token2.symbol)}</Button>
        } else {
            return <>
                {this.renderInfo()}
                <Button className={styles.btn} type='primary' onClick={this.handleSubmit}>{_('supply_liq')}</Button>
            </>;
        }
    }

    handleSubmit = () => {
        this.setState({
            payVisible: true
        })
    }

    renderResult() {
        return <div className={styles.content}>
            {this.renderStep()}

            <div className={styles.finish_logo}><CheckCircleOutlined style={{ fontSize: 80, color: '#2BB696' }} />
            </div>
            <div className={styles.finish_title}>{token1.symbol}/{token2.symbol}</div>
            <div className={styles.finish_desc}>{_('pair_created')}</div>

            <div className={styles.view_detail}>{_('share_pair', `${token1.symbol}/${token2.symbol}`)}</div>
            {this.renderInfo()}
            <Button className={styles.done_btn} onClick={() => {
                this.props.history.push('swap');
            }}>{_('done')}</Button>
        </div>
    }



    renderSwap() {

        const { formFinish, currentMenuItem, page } = this.state;

        return <div className={styles.container} style={{ display: page === 'form' ? 'block' : 'none' }}>
            <div className={styles.head}>
                <div className={styles.menu}>
                    {menu.map(item => {
                        let cls = jc(styles.menu_item);
                        if (item.key === currentMenuItem) {
                            cls = jc(styles.menu_item, styles.menu_item_selected);
                        }
                        return <span className={cls} key={item.key}>{item.label}</span>
                    })}
                </div>
                <div className={styles.help}>
                    <QuestionCircleOutlined />
                </div>
            </div>
            {formFinish ? this.renderResult() : this.renderForm()}

        </div>;
    }

    selectedToken = async (currentPair) => {

        this.showUI('form');
        if (currentPair && currentPair !== this.props.currentPair) {
            if (this.state.page === 'selectToken') {

                this.props.dispatch({
                    type: 'pair/getPairData',
                    payload: {
                        currentPair
                    }
                })
            }

            this.setState({
                currentStep: 1,
                origin_amount: 0,
                aim_amount: 0
            });

            this.formRef.current.setFieldsValue({ origin_amount: 0, aim_amount: 0 });
        }
    }


    closePayPop = () => {
        this.setState({
            payVisible: false
        })
    }

    payCallback = (value) => {
        if (value) {


            this.setState({
                currentStep: 2,
                formFinish: true
            })
        }
        this.closePayPop();

    }

    render() {
        const { page, payVisible, origin_amount, aim_amount } = this.state;
        const { accountName, token1, token2 } = this.props;
        return <div style={{ position: 'relative' }}>
            {this.renderSwap()}
            {(page === 'selectToken_origin' || page === 'selectToken_aim') && <div className={styles.selectToken_wrap}><SelectToken close={(id) => this.selectedToken(id, page)} /></div>}
            {payVisible && <Modal
                title=""
                visible={payVisible}
                footer={null}
                className={styles.pay_dialog}
                width="475px"
                maskClosable={true}
                closeable={false}
                onCancel={this.closePayPop}>
                <Pay payCallback={this.payCallback} data={{
                    accountName,
                    toAddress: '1ATnFVHXuzpvoyECjuZ1QPLbtkAkKvoSJn',
                    tokens: [
                        {
                            amount: origin_amount,
                            symbol: token1.symbol,
                            name: token1.name,
                            icon: token1.icon
                        },
                        {
                            amount: aim_amount,
                            symbol: token2.symbol,
                            name: token2.name,
                            icon: token2.icon
                        },
                    ]
                }} />
            </Modal>}
        </div>
    }
}