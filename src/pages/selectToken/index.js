'use strict';
import React, { Component } from 'react';
import { Input } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import CustomIcon from 'components/icon';
import styles from './index.less';
import _ from 'i18n';

const data = [
    {
        id: 1,
        icon: 'iconlogo-vusd',
        name: 'vUSD',
        symbol: 'VUSD',
        total: 1000
    },
    {
        id: 2,
        icon: 'iconlogo-vbtc',
        name: 'vBTC',
        symbol: 'VBTC',
        total: 0
    },
    {
        id: 3,
        icon: 'iconlogo-veth',
        name: 'vETH',
        symbol: 'VETH',
        total: 100
    }
]

const { Search } = Input;
export default class SelectToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0
        }
    }

    componentDidMount() {
        
    }

    select = (index) => {
        this.setState({
            currentIndex: index
        })
        this.props.close()
    }

    render() {
        const { currentIndex } = this.state;
        return <div className={styles.container}>
            <div className={styles.head}>
                <div className={styles.back}><ArrowLeftOutlined onClick={this.props.close} style={{fontSize: 16, color: '#2F80ED', fontWeight: 700}} /></div>
                <div className={styles.title}>{_('select_token')}</div>
                <div className={styles.done}></div>
            </div>
            <div className={styles.content}>
                <div className={styles.search}>
                    <Search
                        size="large"
                        className={styles.search_input}
                        placeholder={_('search_token_holder')}
                        onChange={this.handleChange}
                    />
                </div>
                <div className={styles.token_list}>
                    {data.map((item, index) => (
                        <div className={styles.item} key={item.id} onClick={()=>this.select(index)}>
                            <div className={styles.icon}><CustomIcon type={item.icon} style={{fontSize: 40}} /></div>
                            <div className={styles.title}>
                                <div className={styles.name}>{item.name}</div>
                                <div className={styles.total}>{item.total} {item.symbol}</div>
                            </div>
                            <div className={styles.selected}>
                                {index === currentIndex && <CheckCircleOutlined theme="filled" style={{color: '#2F80ED', fontSize: 30}} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    }
}