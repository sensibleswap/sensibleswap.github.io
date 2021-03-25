'use strict';
import React, { Component } from 'react';
import { Table, Button } from 'antd';
import styles from './index.less';
import _ from 'i18n';

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

    render() {
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [
            {
                title: _('name'),
                dataIndex: 'name',
                key: 'name',
                filters: [{ text: 'Swap vUSD for BSV', value: 'Swap vUSD for BSV' }, { text: 'Swap BSV for vUSD', value: 'Swap BSV for vUSD' }],
                filteredValue: filteredInfo.name || null,
                onFilter: (value, record) => record.name.includes(value),
                ellipsis: true,
            },
            {
                title: _('total_value'),
                dataIndex: 'total',
                key: 'total',
                ellipsis: true,
            },
            {
                title: _('time'),
                dataIndex: 'time',
                key: 'time',
                sorter: (a, b) => a.time - b.time,
                sortOrder: sortedInfo.columnKey === 'time' && sortedInfo.order,
                ellipsis: true,
            },
        ];
        return <div className={styles.container}>
            <Table columns={columns} dataSource={data} onChange={this.handleChange} />
        </div>;
    }
}