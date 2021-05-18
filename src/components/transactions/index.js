'use strict';
import React, { Component } from 'react';
import { Table, Button } from 'antd';
import styles from './index.less';
import _ from 'i18n';
import BigNumber from 'bignumber.js';
import { formatDate } from 'common/utils';
import { connect } from 'umi';

const data = [
    {
        key: '1',
        name: 'Swap BSV for vUSD',
        total: 'US$2,400',
        time: '5 minutes ago',
    },
    {
        key: '2',
        name: 'Swap vUSD for BSV',
        total: 'US$2,400',
        time: '5 minutes ago',
    },
    {
        key: '3',
        name: 'Swap BSV for vUSD',
        total: 'US$2,400',
        time: '5 minutes ago',
    },
    {
        key: '4',
        name: 'Swap vUSD for BSV',
        total: 'US$2,400',
        time: '5 minutes ago',
    },
    {
        key: '5',
        name: 'Swap BSV for vUSD',
        total: 'US$2,400',
        time: '5 minutes ago',
    },
    {
        key: '6',
        name: 'Swap vUSD for BSV',
        total: 'US$2,400',
        time: '5 minutes ago',
    },
    {
        key: '7',
        name: 'Swap BSV for vUSD',
        total: 'US$2,400',
        time: '5 minutes ago',
    },
    {
        key: '8',
        name: 'Swap vUSD for BSV',
        total: 'US$2,400',
        time: '5 minutes ago',
    },
    {
        key: '9',
        name: 'Swap BSV for vUSD',
        total: 'US$2,400',
        time: '5 minutes ago',
    },
    {
        key: '10',
        name: 'Swap BSV for vUSD',
        total: 'US$2,400',
        time: '5 minutes ago',
    },
];

@connect(({ service, user, loading }) => {
    const { effects } = loading;
    return {
        ...service,
        ...user,
        loading: effects['service/queryTx'] || false
    }
})
export default class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredInfo: null,
            sortedInfo: null,
        };
    }

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    beautifyDate = (createTime) => {
        const now = Date.parse(new Date('2021-03-31 15:14:35'));
        const limit = (now - createTime) / 1000;
        let content = "";
        if (limit < 60) {
            content = _('just');
        } else if (limit >= 60 && limit < 60 * 60) {
            const n = Math.floor(limit / 60);
            content = n + _( n > 1 ? 'minutes_ago' : 'minute_ago');
        } else if (limit >= 60*60 && limit < 24*60*60) {
            const n = Math.floor(limit / 3600);
            content = n + _( n > 1 ? 'hours_ago' : 'hour_ago');
        } else if (limit >= 24*60*60 && limit < 7*24*60*60) {
            const n = Math.floor(limit / 86400);
            content = n + _( n > 1 ? 'days_ago' : 'day_ago');
        } else if (limit >= 7*24*60*60 && limit < 30*24*60*60) {
            const n = Math.floor(limit / (7*24*60*60));
            content = n + _( n > 1 ? 'weeks_ago' : 'week_ago');
        } else if (limit >= 30*24*60*60 && limit < 365*24*60*60) {
            const n = Math.floor(limit / (30*24*60*60));
            content = n + _( n > 1 ? 'months_ago' : 'month_ago');
        } else if (limit >= 365*24*60*60) {
            const n = Math.floor(limit / (365*24*60*60));
            content = n + _( n > 1 ? 'years_ago' : 'year_ago');
        } 
        return content;
        // return formatDate(createTime)
    }

    render() {
        let { sortedInfo, filteredInfo } = this.state;
        const { history } = this.props.pair_data;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [
            {
                title: _('name'),
                dataIndex: 'inputSymbolName',
                key: 'inputSymbolName',
                // filters: [{ text: 'Swap vUSD for BSV', value: 'Swap vUSD for BSV' }, { text: 'Swap BSV for vUSD', value: 'Swap BSV for vUSD' }],
                // filteredValue: filteredInfo.name || null,
                // onFilter: (value, record) => record.name.includes(value),
                ellipsis: true,
                render: (text, record, index) => {
                    return `Swap ${record.inputSymbolName} for ${record.outputSymbolName}`;
                }
            },
            {
                title: _('total_value'),
                dataIndex: 'inputAmount',
                key: 'inputAmount',
                ellipsis: true,
                width: 150,
                render: (text, record, index) => {
                    return BigNumber(record.inputAmount || 0).multipliedBy(record.inputPrice || 0).toFixed(6).toString();
                }
            },
            {
                title: _('time'),
                dataIndex: 'createtime',
                key: 'createtime',
                sorter: (a, b) => a.time - b.time,
                sortOrder: sortedInfo.columnKey === 'createtime' && sortedInfo.order,
                ellipsis: true,
                width: 130,
                render: (text, record, index) => {
                    return this.beautifyDate(text);
                    return formatDate(text);
                }
            },
        ];
        return <div className={styles.container}>
            <Table className={styles.tx_table} columns={columns} dataSource={history ? history.list : []} onChange={this.handleChange} rowKey="id" />
        </div>;
    }
}