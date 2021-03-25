'use strict';
import React, { Component } from 'react';
import { Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Chart from 'components/chart';
import CustomIcon from 'components/icon';
import Pair from 'components/pair';
import styles from './index.less';
import _ from 'i18n';

import HeadLeft from '../layout/head/headLeft';
import HeadRight from '../layout/head/headRight';
import Activity from 'components/activity';
import { Link, withRouter } from 'umi';

@withRouter
export default class PairPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

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
            <div className={styles.btns}>
                <Button type='primary' className={styles.btn} onClick={() => {
                    this.props.history.push('swap')
                }}>{_('add')}</Button>
                <Button type='primary' className={styles.btn} onClick={() => {
                    this.props.history.push('remove')
                }}>{_('remove')}</Button>
            </div>


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
                    <h3 className={styles.title}>{_('your_active')}</h3>
                    <div className={styles.box}>
                        <Activity />
                    </div>
                </div>
            </section>
        </section>)
    }
}