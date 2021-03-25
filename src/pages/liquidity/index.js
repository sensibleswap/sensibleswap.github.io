'use strict';
import React, { Component } from 'react';
import { jc } from 'common/utils';
import CustomIcon from 'components/icon';
import styles from './index.less';
import _ from 'i18n';
import { Steps, Button } from 'antd';
import { QuestionCircleOutlined, DownOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import SelectToken from '../selectToken';
import Setting from '../setting';
import { withRouter } from 'umi';

const { Step } = Steps;

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
export default class Liquidity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'form',
            formFinish: false,
            showDetail: false,
            currentPair: 0,
            currentMenuItem: menu[0].key,
            currentStep: 0
        }
    }

    componentDidMount() {

    }

    switch = () => {

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
        return <div className={styles.my_pair_info}>
            <div className={styles.info_title_swap}>
                <div className={styles.info_title}>{_('pool_share')}</div>
                <div className={styles.help}><QuestionCircleOutlined /></div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('pooled')} BSV</div>
                <div className={styles.info_value}>0.0</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('pooled')} vUSD</div>
                <div className={styles.info_value}>0.0</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('your_share')}</div>
                <div className={styles.info_value}>0.0%</div>
            </div>
        </div>
    }

    renderForm() {
        const { currentPair } = this.state;
        return <div className={styles.content}>
            {this.renderStep()}
            <div className={styles.title}>
                <h3>{_('input')}</h3>
                <div className={styles.balance}>{_('your_balance')}: <span>11 BSV</span></div>
            </div>
            <div className={styles.box}>
                <div className={styles.coin}>
                    <CustomIcon type='iconlogo-bitcoin' style={{ fontSize: 40, marginRight: 10 }} />
                    <div className={styles.name}>BSV</div>
                    <DownOutlined onClick={() => this.showUI('selectToken')} />
                </div>
                <input className={styles.input} />
            </div>

            <div className={styles.switch_icon}>
            <PlusOutlined />
            </div>


            <div className={styles.title}>
                <h3>{_('input')}</h3>
                <div className={styles.balance}>{_('balance')}: <span>11 BSV</span></div>
            </div>

            <div className={styles.box}>
                <div className={styles.coin}>
                    <CustomIcon type='iconlogo-vusd' style={{ fontSize: 40, marginRight: 10 }} />
                    <div className={styles.name}>vUSD</div>
                    <DownOutlined onClick={() => this.showUI('selectToken')} />
                </div>
                <input className={styles.input} />
            </div>

            {currentPair ?
                <>
                    {this.renderInfo()}
                    <Button className={styles.btn} onClick={this.submit}>{_('supply_liq')}</Button>
                </>
                :
                <Button className={styles.btn}>{_('select_a_token_pair')}</Button>
            }

        </div>
    }

    submit = () => {
        this.setState({
            currentStep: 2,
            formFinish: true
        })
    }

    renderResult() {
        const { showDetail } = this.state;
        return <div className={styles.content}>
            {this.renderStep()}

            <div className={styles.finish_logo}><CheckCircleOutlined style={{fontSize: 80, color: '#2BB696'}} />
            </div>
            <div className={styles.finish_title}>BSV/vUSD</div>
            <div className={styles.finish_desc}>{_('pair_created')}</div>

            <div className={styles.view_detail}>{_('share_pair', 'BSV/vUSD')}</div>
            {this.renderInfo()}
            <Button className={styles.done_btn} onClick={()=>{
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

        const { formFinish, currentMenuItem } = this.state;

        return <div className={styles.container}>
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

    render() {
        const { page } = this.state;
        if (page === 'form') {
            return this.renderSwap()
        } else if (page === 'selectToken') {
            return <SelectToken close={() => {
                this.setState({
                    currentPair: 1,
                    currentStep: 1
                })
                this.showUI('form')
            }} />
        } else if (page === 'setting') {
            return <Setting close={() => this.showUI('form')} />
        }
    }
}