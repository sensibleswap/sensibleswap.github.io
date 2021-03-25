'use strict';
import React, { Component } from 'react';
import { jc } from 'common/utils';
import styles from './index.less';
import _ from 'i18n';

const types = [
    _('all'),
    _('swaps'),
    _('liq'),
];

const datas = [
    {
        type: 2,
        text: 'Add BSV and vUSD',
        time: '1 minute ago'
    },
    {
        type: 2,
        text: 'Remove BSV and vUSD',
        time: '5 minutes ago'
    },
    {
        type: 1,
        text: 'Swap BSV for vUSD',
        time: '25 minutes ago'
    },
    {
        type: 1,
        text: 'Swap vBTC for BSV',
        time: '1 hour ago'
    },
    {
        type: 2,
        text: 'Add BSV and vUSD',
        time: '23 hours ago'
    },
    {
        type: 1,
        text: 'Swap BSV for vETH',
        time: '1 day ago'
    },
    {
        type: 2,
        text: 'Add BSV and vETH',
        time: '3 weeks ago'
    },
    {
        type: 2,
        text: 'Add BSV and vUSD',
        time: '3 weeks ago'
    },
    {
        type: 1,
        text: 'Swap BSV for vETH',
        time: '1 month ago'
    },
    {
        type: 2,
        text: 'Add BSV and vETH',
        time: '2 month ago'
    },
]

export default class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTabIndex: 0,
            data: datas
        }
    }

    componentDidMount() {

    }
    switchTab = (index) => {

        this.setState({
            currentTabIndex: index,
            data: index === 0 ? datas : datas.filter(v => v.type === index)
        })
    }

    render() {
        const { currentTabIndex, data } = this.state;
        return <div className={styles.container}>
            <div className={styles.hd}>
                {types.map((item, index) => (
                    <div className={currentTabIndex === index ? jc(styles.tab_current_item, styles.tab_item) : styles.tab_item} key={index} onClick={() => this.switchTab(index)}>{item}</div>
                ))}
            </div>
            <div className={styles.bd}>
                {data.map((item, index) => (
                    <div className={styles.item} key={index}>
                        <div className={styles.title}>{item.text}</div>
                        <div className={styles.time}>{item.time}</div>
                    </div>
                ))}
            </div>
        </div>;
    }
}