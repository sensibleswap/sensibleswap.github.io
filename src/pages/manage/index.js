'use strict';
import React, { Component } from 'react';
import Chart from 'components/chart';
import CustomIcon from 'components/icon';
import styles from './index.less';
import _ from 'i18n';

import Header from '../layout/header';
import Activity from 'components/activity';
import { Link, withRouter } from 'umi';

@withRouter
export default class Manage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



    renderNoData(title, text, url) {
        return <div className={styles.no_data}>
            <div className={styles.no_data_title}>{title}</div>
            <Link to={url} className={styles.no_data_link}>{text}</Link>
        </div>
    }

    gotoPair = () => {
        this.props.history.push('pair')
    }

    renderContent() {

        return <div className={styles.content}>
            <div className={styles.main_title}>
                <div className={styles.subtitle}>{_('your_liq')}</div>
                <h2>$20,437.05</h2>
                <Link to='my'>{_('back_prort')}</Link>
            </div>
            <Chart />
            <div className={styles.item}>
                <div className={styles.title}>{_('your_total_liq')} <span>({_('include_fees')})</span></div>
                <div className={styles.value}>$23,838.06</div>
            </div>
            <div className={styles.item}>
                <div className={styles.title}>{_('fees_earned')} <span>({_('cumulative')})</span></div>
                <div className={styles.value} style={{ color: '#229278' }}>$2,232.89</div>
            </div>

            <h3 className={styles.title}>{_('your_liq')}</h3>
            <div className={styles.liq_item} onClick={this.gotoPair}>
                <div className={styles.title}>
                    <div className={styles.icon}>
                        <CustomIcon type='iconlogo-bitcoin' />
                        <CustomIcon type='iconlogo-vusd' />
                    </div>
                    <div className={styles.name}>BSV-vUSD</div>
                </div>
                <div className={styles.value}>$1,032.05</div>
            </div>
            <div className={styles.liq_item} onClick={this.gotoPair}>
                <div className={styles.title}>
                    <div className={styles.icon}>
                        <CustomIcon type='iconlogo-bitcoin' />
                        <CustomIcon type='iconlogo-veth' />
                    </div>
                    <div className={styles.name}>BSV-vETH</div>
                </div>
                <div className={styles.value}>$10,007.00</div>
            </div>

        </div>;
    }

    render() {
        return (<section className={styles.container}>
            <section className={styles.left}>
                <div className={styles.left_inner}>
                    <Header />
                    {this.renderContent()}
                </div>
            </section>
            <section className={styles.right}>
                <div className={styles.sidebar}>
                    <h3 className={styles.title}>{_('your_active')}</h3>
                    <div className={styles.box}>
                        <Activity />
                        {this.renderNoData(_('no_active'), _('explore_tokens'), 'explore')}
                    </div>
                </div>
            </section>
        </section>)
    }
}