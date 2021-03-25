'use strict';
import React, { Component } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import Chart from 'components/chart';
import CustomIcon from 'components/icon';
import styles from './index.less';
import _ from 'i18n';

import HeadLeft from '../layout/head/headLeft';
import HeadRight from '../layout/head/headRight';
import Activity from 'components/activity';
import { Link, withRouter } from 'umi';

@withRouter
export default class My extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    renderBalance() {
        return <div className={styles.list}>
            <div className={styles.list_hd}>
                <div className={styles.col_1}>{_('asset')}</div>
                <div className={styles.col_2}>{_('balance')}</div>
                <div className={styles.col_3}>{_('price')}</div>
                <div className={styles.col_4}>{_('total')}</div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>
                    <div className={styles.icon}><CustomIcon type='iconlogo-bitcoin' /></div>
                    <div className={styles.item_title}>BSV</div>
                </div>
                <div className={styles.col_2}>11.00000</div>
                <div className={styles.col_3}>$290.38</div>
                <div className={styles.col_4}>$3,195.94</div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>
                    <div className={styles.icon}><CustomIcon type='iconlogo-vusd' /></div>
                    <div className={styles.item_title}>vUSD</div>
                </div>
                <div className={styles.col_2}>11.00000</div>
                <div className={styles.col_3}>$290.38</div>
                <div className={styles.col_4}>$3,195.94</div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>
                    <div className={styles.icon}><CustomIcon type='iconlogo-veth' /></div>
                    <div className={styles.item_title}>vETH</div>
                </div>
                <div className={styles.col_2}>11.00000</div>
                <div className={styles.col_3}>$290.38</div>
                <div className={styles.col_4}>$3,195.94</div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>
                    <div className={styles.icon}><CustomIcon type='iconlogo-vbtc' /></div>
                    <div className={styles.item_title}>vBTC</div>
                </div>
                <div className={styles.col_2}>11.00000</div>
                <div className={styles.col_3}>$290.38</div>
                <div className={styles.col_4}>$3,195.94</div>
            </div>
        </div>;
    }

    gotoPair = () =>{
        this.props.history.push('pair')
    }

    renderLiq() {
        return <div className={styles.list}>
        <div className={styles.list_hd}>
            <div className={styles.q_col_1}>{_('pair')}</div>
            <div className={styles.q_col_2}>{_('total_value')}</div>
            <div className={styles.q_col_3}>{_('time')}<CaretDownOutlined /></div>
        </div>
        <div className={styles.list_item} onClick={this.gotoPair}>
            <div className={styles.q_col_1}>
                <div className={styles.icon}><CustomIcon type='iconlogo-bitcoin' /><CustomIcon type='iconlogo-vusd' /></div>
                <div className={styles.item_title}>BSV-vUSD</div>
            </div>
            <div className={styles.q_col_2}>$2,400.00</div>
            <div className={styles.q_col_3}>1 minute ago</div>
        </div>
        <div className={styles.list_item} onClick={this.gotoPair}>
            <div className={styles.q_col_1}>
                <div className={styles.icon}><CustomIcon type='iconlogo-bitcoin' /><CustomIcon type='iconlogo-veth' /></div>
                <div className={styles.item_title}>BSV-vETH</div>
            </div>
            <div className={styles.q_col_2}>$2,400.00</div>
            <div className={styles.q_col_3}>1 minute ago</div>
        </div>
    </div>;
    }

    // renderOrder() {
    //     return <div className={styles.list}>
    //     <div className={styles.list_hd}>
    //         <div className={styles.q_col_1}>{_('pair')}</div>
    //         <div className={styles.q_col_2}>{_('order_value')}</div>
    //         <div className={styles.q_col_3}>{_('expires_in')}<Icon type="caret-down" /></div>
    //     </div>
    //     <div className={styles.list_item}>
    //         <div className={styles.q_col_1}>
    //             <div className={styles.icon}><CustomIcon type='iconlogo-bitcoin' /><CustomIcon type='iconlogo-vusd' /></div>
    //             <div className={styles.item_title}>BSV-vUSD</div>
    //         </div>
    //         <div className={styles.q_col_2}>$2,400.00</div>
    //         <div className={styles.q_col_3}>1 minute ago</div>
    //         <div className={styles.delete}><Icon type="close" /></div>
    //     </div>
    //     <div className={styles.list_item}>
    //         <div className={styles.q_col_1}>
    //             <div className={styles.icon}><CustomIcon type='iconlogo-bitcoin' /><CustomIcon type='iconlogo-veth' /></div>
    //             <div className={styles.item_title}>BSV-vETH</div>
    //         </div>
    //         <div className={styles.q_col_2}>$2,400.00</div>
    //         <div className={styles.q_col_3}>1 minute ago</div>
    //         <div className={styles.delete}><Icon type="close" /></div>
    //     </div>
    // </div>;

    // }

    renderNoData(title, text, url) {
        return <div className={styles.no_data}>
            <div className={styles.no_data_title}>{title}</div>
            <Link to={url} className={styles.no_data_link}>{text}</Link>
        </div>
    }

    renderContent() {

        return <div className={styles.content}>
            <div className={styles.main_title}>
                <div className={styles.subtitle}>{_('your_account')}</div>
                <h2>$22,950.76</h2>
                <div className={styles.desc}><span>+$1,380.25</span> / 24h</div>
            </div>
            <Chart />
            <h3 className={styles.title}>{_('your_balances')}</h3>
            {this.renderBalance()}
            <h3 className={styles.title}>
                {_('your_liq')}
                <Link to='manage'>{_('manage')}</Link>
            </h3>
            {this.renderLiq()}
            {this.renderNoData(_('no_liq'), _('add_liq'), 'pool')}
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
                    {this.renderNoData(_('no_active'), _('explore_tokens'), 'explore')}
                    </div>
                </div>
            </section>
        </section>)
    }
}