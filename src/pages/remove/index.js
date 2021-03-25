'use strict';
import React, { Component } from 'react';
import { Slider, Button } from 'antd';
import Chart from 'components/chart';
import CustomIcon from 'components/icon';
import Pair from 'components/pair';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import _ from 'i18n';

import HeadLeft from '../layout/head/headLeft';
import HeadRight from '../layout/head/headRight';
import { Link, withRouter } from 'umi';

const datas = [
    {
        label: '25%',
        value: 25,
    },
    {
        label: '50%',
        value: 50,
    },
    {
        label: '75%',
        value: 75,
    },
    {
        label: _('max'),
        value: 100,
    },
]

@withRouter
export default class RemovePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            page: 'form',
        }
    }

    renderContent() {

        return <div className={styles.content}>
            <div className={styles.main_title}>
                <div className={styles.subtitle}>{_('your_liq')}</div>
                <h2>
                    <div className={styles.icon}>
                        <CustomIcon type='iconlogo-bitcoin' />
                        <CustomIcon type='iconlogo-vusd' />
                    </div>
                    <div className={styles.name}>BSV/vUSD</div>
                </h2>
            </div>
            <Chart />
            <Pair />


        </div>;
    }

    changeData = (value) => {
        this.setState({ value })
    }

    slideData = (value) => {
        this.setState({ value })
    }

    renderForm() {
        const { value } = this.state;
        return <div className={styles.bd}>

            <div className={styles.title}>
                <h3>{_('remove_liq')}</h3>
            </div>
            <div className={styles.data}>
                {value}%
        </div>
            <Slider value={value} onChange={this.slideData} />

            <div className={styles.datas}>
                {datas.map(item => (
                    <div className={styles.d} onClick={() => this.changeData(item.value)} key={item.value}>{item.label}</div>
                ))}
            </div>

            <div className={styles.pair_box}>
                <div className={styles.pair_left}>
                    <div className={styles.icon}>
                        <CustomIcon type='iconlogo-bitcoin' />
                        <CustomIcon type='iconlogo-vusd' />
                    </div>
                    <div className={styles.name}>BSV/vUSD</div>
                </div>
                <div className={styles.pair_right}>0.125634</div>
            </div>

            <div className={styles.switch_icon}>
                <div className={styles.icon} onClick={this.switch}>
                    <CustomIcon type='iconswitch' style={{ fontSize: 20 }} />
                </div>
                <div className={styles.line}></div>
            </div>

            <div className={styles.values}>
                <div className={styles.v_item}>
                    <div className={styles.value}>5.00</div>
                    <div className={styles.label}><CustomIcon type='iconlogo-bitcoin' /> BSV</div>
                </div>
                <div className={styles.v_item}>
                    <div className={styles.value}>1000.00</div>
                    <div className={styles.label}><CustomIcon type='iconlogo-vusd' /> vUSD</div>
                </div>
            </div>

            <div className={styles.price}>
                <div className={styles.label}>{_('price')}</div>
                <div className={styles.value}>
                    <div>1 BSV = 200.00 vUSD</div>
                    <div>1 vUSD = 1.00 USDC</div>
                </div>
            </div>

            <Button type="primary" className={styles.btn} onClick={()=> {
                this.setState({page: 'result'})
            }}>{_('remove')}</Button>

        </div>
    }



    renderInfo() {
        return <div className={styles.my_pair_info}>
            <div className={styles.info_title_swap}>
                <div className={styles.info_title}>{_('your_re_liq')}</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>USDC</div>
                <div className={styles.info_value}>831.00</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>VUSD</div>
                <div className={styles.info_value}>832.55</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('earned')}</div>
                <div className={styles.info_value}>0.1BSV + 1.55 VUSD</div>
            </div>
        </div>
    }

    renderResult() {
        return <div className={styles.bd}>

            <div className={styles.finish_logo}><CheckCircleOutlined style={{ fontSize: 80, color: '#2BB696' }} /></div>
            <div className={styles.finish_title}>{_('liq_removed')}</div>
            <div className={styles.small_title}>{_('your_pos')}</div>

            <div className={styles.pair_box}>
                <div className={styles.pair_left}>
                    <div className={styles.icon}>
                        <CustomIcon type='iconlogo-bitcoin' />
                        <CustomIcon type='iconlogo-vusd' />
                    </div>
                    <div className={styles.name}>BSV/vUSD</div>
                </div>
                <div className={styles.pair_right}>0</div>
            </div>

            {this.renderInfo()}
            <Button type='primary' className={styles.done_btn} onClick={() => {
                this.props.history.push('pair');
            }}>{_('done')}</Button>
        </div>
    }

    render() {
        const { page } = this.state;
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
                    <div className={styles.box}>
                        <div className={styles.hd}>
                            <div className={styles.hd_item} onClick={() => {
                                this.props.history.push('pool')
                            }}>Add</div>
                            <div className={styles.hd_item_cur}>Remove</div>
                        </div>
                        {page === 'form' ? this.renderForm() : this.renderResult()}
                    </div>
                </div>
            </section>
        </section>)
    }
}