'use strict';
import React, { Component } from 'react';
import { Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './index.less';
import _ from 'i18n';

import Lang from '../layout/lang';
import Nav from '../layout/nav';
import Footer from '../layout/footer';
import CustomIcon from 'components/icon';

export default class Home extends Component {

    renderList() {
        return <div className={styles.list}>
            <div className={styles.list_hd}>
                <div className={styles.col_1}>{_('feature')}</div>
                <div className={styles.col_2}>{_('tokenswap')}</div>
                <div className={styles.col_3}>{_('cex')}</div>
                <div className={styles.col_4}>{_('other_dex')}</div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>{_('lb_1')}</div>
                <div className={styles.col_2}><CheckOutlined className={styles.green} /></div>
                <div className={styles.col_3}><CloseOutlined className={styles.red} /></div>
                <div className={styles.col_4}><CheckOutlined className={styles.green} /></div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>{_('lb_2')}</div>
                <div className={styles.col_2}><CheckOutlined className={styles.green} /></div>
                <div className={styles.col_3}><CloseOutlined className={styles.red} /></div>
                <div className={styles.col_4}><CheckOutlined className={styles.green} /></div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>{_('lb_3')}</div>
                <div className={styles.col_2}><CheckOutlined className={styles.green} /></div>
                <div className={styles.col_3}><CloseOutlined className={styles.red} /></div>
                <div className={styles.col_4}><CloseOutlined className={styles.red} /></div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>{_('lb_4')}</div>
                <div className={styles.col_2}><CheckOutlined className={styles.green} /></div>
                <div className={styles.col_3}><CloseOutlined className={styles.red} /></div>
                <div className={styles.col_4}><CloseOutlined className={styles.red} /></div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>{_('lb_5')}</div>
                <div className={styles.col_2}><CheckOutlined className={styles.green} /></div>
                <div className={styles.col_3}><CloseOutlined className={styles.red} /></div>
                <div className={styles.col_4}><CloseOutlined className={styles.red} /></div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>{_('lb_6')}</div>
                <div className={styles.col_2}><CheckOutlined className={styles.green} /></div>
                <div className={styles.col_3}><CloseOutlined className={styles.red} /></div>
                <div className={styles.col_4}><CloseOutlined className={styles.red} /></div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>{_('lb_7')}</div>
                <div className={styles.col_2}><CheckOutlined className={styles.green} /></div>
                <div className={styles.col_3}><CloseOutlined className={styles.red} /></div>
                <div className={styles.col_4}><CheckOutlined className={styles.green} /></div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>{_('lb_8')}</div>
                <div className={styles.col_2}><CheckOutlined className={styles.green} /></div>
                <div className={styles.col_3}><CloseOutlined className={styles.red} /></div>
                <div className={styles.col_4}><CheckOutlined className={styles.green} /></div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>{_('lb_9')}</div>
                <div className={styles.col_2}><CheckOutlined className={styles.green} /></div>
                <div className={styles.col_3}><CloseOutlined className={styles.red} /></div>
                <div className={styles.col_4}><CloseOutlined className={styles.red} /></div>
            </div>
            <div className={styles.list_item}>
                <div className={styles.col_1}>{_('lb_10')}</div>
                <div className={styles.col_2}><CheckOutlined className={styles.green} /></div>
                <div className={styles.col_3}><CloseOutlined className={styles.red} /></div>
                <div className={styles.col_4}><CloseOutlined className={styles.red} /></div>
            </div>
        </div>;
    }

    render() {
        return (<section className={styles.container}>
            <section className={styles.head}>
                <div className={styles.head_inner}>
                    <Nav />
                    <div className={styles.head_right}>
                        <Button type='primary' onClick={() => {
                            this.props.history.push('swap')
                        }}>{_('use_tokenswap')}</Button>
                        <Lang />
                    </div>

                </div>
            </section>
            <section className={styles.main}>
                <div className={styles.logo}><CustomIcon type="iconTS_Logo" style={{fontSize: 70}} /></div>
                <div className={styles.main_title}>{_('tokenswap')}</div>
                <div className={styles.main_desc}>{_('tokenswap_desc')}</div>
                <div className={styles.btns}>
                    <Button type='primary' className={styles.btn} style={{ marginRight: 30 }} onClick={() => {
                        this.props.history.push('swap')
                    }}>{_('use_tokenswap')}</Button>
                    <Button className={styles.btn} onClick={() => {
                        window.location.href = 'https://app.gitbook.com/@di1/s/tokenswap/'
                    }}>{_('documentation')}</Button>
                </div>
            </section>
            <section className={styles.content}>
                <div className={styles.title_web}>{_('comp_ts')}</div>
                <div className={styles.title_h5}>{_('comp_ts_h5')}</div>
                {this.renderList()}
            </section>
            <Footer />
        </section>)
    }
}