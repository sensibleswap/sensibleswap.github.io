'use strict';
import React, { Component } from 'react';
import { jc } from 'common/utils';
import TokenLogo from 'components/tokenicon';
import styles from './index.less';
import _ from 'i18n';
import { Steps, Button, Form, InputNumber, Spin } from 'antd';
import { QuestionCircleOutlined, DownOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import SelectToken from '../selectToken';
import { withRouter, connect } from 'umi';

const { Step } = Steps;
const FormItem = Form.Item;

const menu = [
    {
        key: 'add',
        label: _('add_liq')
    },
    {
        key: 'create',
        label: _('create_pair'),
    }
];
@withRouter
@connect(({ user, loading }) => {
    const { effects } = loading;
    return {
        ...user,
        loading: effects['service/queryTx'] || false
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
            currentStep: 0,
            origin_amount: 0,
            aim_amount: 0
        }
        this.formRef = React.createRef();
    }

    componentDidMount() {
        const {origin_token_id, aim_token_id} = this.props;
        if (origin_token_id && aim_token_id) {
            this.setState({
                currentStep: 1
            })
        }

    }


    changeOriginAmount = (value) => {
        this.setState({
            origin_amount: value
        });
    }

    changeAimAmount = (value) => {

        this.setState({
            aim_amount: value
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
        const { origin_token_id, aim_token_id, pair_data } = this.props;
        const origin_token = this.findToken(origin_token_id) || {};
        const aim_token = this.findToken(aim_token_id) || {};
        let { origin_amount, aim_amount  } = this.state;
        pair_data.pairLiquidity && pair_data.pairLiquidity.forEach(item => {
            if (item.tokenid === origin_token_id) {
                origin_amount = origin_amount + item.amount;
            } else if (item.tokenid === aim_token_id) {
                aim_amount = aim_amount + item.amount;
            }
        })
        return <div className={styles.my_pair_info}>
            <div className={styles.info_title_swap}>
                <div className={styles.info_title}>{_('pool_share')}</div>
                <div className={styles.help}><QuestionCircleOutlined /></div>
            </div>

            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('pooled')} {origin_token.symbol}</div>
                <div className={styles.info_value}>{origin_amount}</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('pooled')} {aim_token.symbol}</div>
                <div className={styles.info_value}>{aim_amount}</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('your_share')}</div>
                <div className={styles.info_value}>0.0%</div>
            </div>
        </div>
    }

    findToken = (id) => {
        const { tokens } = this.props;
        return tokens.find(v => v.tokenId === id)
    }

    handleSubmit = () => {

    }
    renderForm() {
        const { origin_token_id, aim_token_id, loading } = this.props;
        const origin_token = this.findToken(origin_token_id);
        const aim_token = this.findToken(aim_token_id) || {};
        if (!origin_token || !aim_token) return null;
        return <div className={styles.content}>
            <Spin spinning={loading}>
                <Form onSubmit={this.handleSubmit} ref={this.formRef}>
                    {this.renderStep()}
                    <div className={styles.title}>
                        <h3>{_('input')}</h3>
                        <div className={styles.balance}>{_('your_balance')}: <span>{origin_token.value || 0} {origin_token.symbol}</span></div>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.coin}>
                            <TokenLogo name={origin_token.name} icon={origin_token.icon} />
                            <div className={styles.name}>{origin_token.symbol}</div>
                            <DownOutlined onClick={() => this.showUI('selectToken_origin')} />
                        </div>
                        <FormItem
                            name={'origin_amount'}>
                            <InputNumber className={styles.input} onChange={this.changeOriginAmount} min='0' />
                        </FormItem>
                    </div>

                    <div className={styles.switch_icon}>
                        <PlusOutlined />
                    </div>


                    <div className={styles.title}>
                        <h3>{_('input')}</h3>
                        <div className={styles.balance}>{_('balance')}: <span>{aim_token.value || 0} {aim_token.symbol || ''}</span></div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.coin}>
                            <div style={{ width: 40 }}>{aim_token.name && <TokenLogo name={aim_token.name} icon={aim_token.icon} />}</div>
                            <div className={styles.name}>{aim_token.symbol || _('select')}</div>
                            <DownOutlined onClick={() => this.showUI('selectToken_aim')} />
                        </div>
                        <FormItem
                            name={'aim_amount'}>
                            <InputNumber className={styles.input} onChange={this.changeAimAmount} min='0' />
                        </FormItem>
                    </div>
                    {this.renderButton()}
                </Form>
            </Spin>
        </div>
    }

    renderButton = () => {
        const { origin_token_id, aim_token_id } = this.props;
        const { origin_amount, aim_amount  } = this.state;
        if (origin_token_id && aim_token_id) {

            return <>
                {this.renderInfo()}
                {(origin_amount > 0 || aim_amount > 0) ? <Button className={styles.btn} type='primary' onClick={this.submit}>{_('supply_liq')}</Button> :
                    <Button className={styles.btn_wait}>{_('enter_amount')}</Button>}
            </>;
        }
        else {
            return <Button className={styles.btn_wait}>{_('select_a_token_pair')}</Button>
        }
    }

    submit = () => {
        this.setState({
            currentStep: 2,
            formFinish: true
        })
    }

    renderResult() {
        const { origin_token_id, aim_token_id, loading } = this.props;
        const origin_token = this.findToken(origin_token_id);
        const aim_token = this.findToken(aim_token_id) || {};
        return <div className={styles.content}>
            {this.renderStep()}

            <div className={styles.finish_logo}><CheckCircleOutlined style={{ fontSize: 80, color: '#2BB696' }} />
            </div>
            <div className={styles.finish_title}>{origin_token.symbol}/{aim_token.symbol}</div>
            <div className={styles.finish_desc}>{_('pair_created')}</div>

            <div className={styles.view_detail}>{_('share_pair', `${origin_token.symbol}/${aim_token.symbol}`)}</div>
            {this.renderInfo()}
            <Button className={styles.done_btn} onClick={() => {
                this.props.history.push('swap');
            }}>{_('done')}</Button>
        </div>
    }

    gotoPage = (index) => {
        this.setState({
            currentMenuItem: index
        })
    }


    renderSwap() {

        const { formFinish, currentMenuItem, page } = this.state;

        return <div className={styles.container} style={{display: page === 'form' ? 'block' : 'none'}}>
            <div className={styles.head}>
                <div className={styles.menu}>
                    {menu.map(item => {
                        let cls = jc(styles.menu_item);
                        if (item.key === currentMenuItem) {
                            cls = jc(styles.menu_item, styles.menu_item_selected);
                        }
                        return <span className={cls} onClick={() => this.gotoPage(item.key)} key={item.key}>{item.label}</span>
                    })}
                </div>
                <div className={styles.help}>
                    <QuestionCircleOutlined />
                </div>
            </div>
            {formFinish ? this.renderResult() : this.renderForm()}

        </div>;
    }

    selectedToken = async (tokenId) => {

        if (tokenId) {
            const { page } = this.state;
            const { origin_token_id, aim_token_id, dispatch } = this.props;
            // const _token = tokens.find(v => v.tokenId === tokenId);
            let res;
            if (page === 'selectToken_origin') {

                dispatch({
                    type: 'user/save',
                    payload: {
                        origin_token_id: tokenId
                    }

                })
                res = await dispatch({
                    type: 'service/queryTx',
                    payload: {
                        tokenids: [tokenId, aim_token_id]
                    }
                })
            }
            else if (page === 'selectToken_aim') {

                dispatch({
                    type: 'user/save',
                    payload: {
                        aim_token_id: tokenId
                    }

                })
                res = await dispatch({
                    type: 'service/queryTx',
                    payload: {
                        tokenids: [origin_token_id, tokenId]
                    }
                })
            }

            this.setState({
                currentMenuItem: menu[res.data.pairLiquidity ? 0 : 1].key,
                currentStep: 1
            })
        }
        this.showUI('form');
    }

    render() {
        const { page } = this.state;
        return <div style={{ position: 'relative' }}>
            {this.renderSwap()}
            {(page === 'selectToken_origin' || page === 'selectToken_aim') && <div style={{ position: 'absolute', top: 0, left: 0 }}><SelectToken close={(id) => this.selectedToken(id, page)} /></div>}
        </div>
    }
}