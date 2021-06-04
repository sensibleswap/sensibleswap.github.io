'use strict';
import React, { Component } from 'react';
import { Input } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import TokenLogo from 'components/tokenicon';
import { connect } from 'umi';
import styles from './index.less';
import _ from 'i18n';

const { Search } = Input;
@connect(({ pair }) => {
    return {
        ...pair
    }

})
export default class SelectToken extends Component {
    constructor(props) {
        super(props);
        const {allPairs} = props;
        let _allPairs = [], _showList = [];
        Object.keys(allPairs).forEach(item => {
            const _obj = {
                ...allPairs[item],
                name: item
            }
            _allPairs.push(_obj);
            _showList.push(_obj);
        })
        this.state = {
            showList: _showList,
            allPairs: _allPairs
        }
    }

    // componentDidMount() {
    //     const {tokens} = this.props;

    //     this.setState({
    //         showList: tokens,
    //     })
    // }

    select = (id) => {
        // const { dispatch, close, type } = this.props
        
        this.props.close(id)
    }


    escapeRegExpWildcards(searchStr) {
        const regExp = /([\(\[\{\\\^\$\}\]\)\?\*\+\.])/img;
        if (searchStr && regExp.test(searchStr)) {
            return searchStr.replace(regExp, '\\$1');
        }
        return searchStr;
    }

    searchByKeywords(keywords, searchArr) {
        const keywordsExp = new RegExp(".*?" + this.escapeRegExpWildcards(keywords) + ".*?", "img");
        
        
        return searchArr.filter(v => {
            return ((keywordsExp.test(v.token1.symbol) || keywordsExp.test(v.token2.symbol) || keywords == v.token1.tokenID || keywords == v.token2.tokenID))
        });
    }

    handleChange = (e) => {
        const { value } = e.target;
        const { allPairs } = this.state;
        // if(!token) return;
        if (!value) {
            return this.setState({
                showList: allPairs
            })
        }
        const res = this.searchByKeywords(value, allPairs);
        this.setState({
            showList: res
        })
    }

    render() {
        const { showList } = this.state;
        const { currentPair } = this.props;
        return <div className={styles.container}>
            <div className={styles.head}>
                <div className={styles.back}><ArrowLeftOutlined onClick={()=>this.props.close()} style={{fontSize: 16, color: '#2F80ED', fontWeight: 700}} /></div>
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
                    {showList && showList.map((item) => (
                        <div className={styles.item} key={item} onClick={()=>this.select(item.name)}>
                            <div className={styles.icon}><TokenLogo name={item.token1.symbol} size={25} /><TokenLogo name={item.token2.symbol} size={25} style={{marginLeft: '-8px'}} /></div>
                            <div className={styles.title}>
                                <div className={styles.name}>{item.name.toUpperCase()}</div>
                            </div>
                            <div className={styles.selected}>
                                {item.name === currentPair && <CheckCircleOutlined theme="filled" style={{color: '#2F80ED', fontSize: 30}} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    }
}