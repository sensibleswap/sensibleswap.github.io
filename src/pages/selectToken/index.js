'use strict';
import React, { Component } from 'react';
import { Input } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import CustomIcon from 'components/icon';
import TokenLogo from 'components/tokenicon';
import { connect } from 'umi';
import styles from './index.less';
import _ from 'i18n';

const { Search } = Input;
@connect(({ token, user }) => {
    return {
        ...token,
        ...user
    }

})
export default class SelectToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showList: props.tokens,
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
        return searchArr.filter(v => (keywordsExp.test(v.name) || keywordsExp.test(v.symbol) || keywords == v.tokenId));
    }

    handleChange = (e) => {
        const { value } = e.target;
        const { tokens } = this.props;
        // if(!token) return;
        if (!value) {
            return this.setState({
                showList: tokens
            })
        }
        const res = this.searchByKeywords(value, tokens);
        this.setState({
            showList: res
        })
    }

    render() {
        const { showList } = this.state;
        const { type } = this.props;
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
                        <div className={styles.item} key={item.tokenId} onClick={()=>this.select(item.tokenId)}>
                            <div className={styles.icon}><TokenLogo name={item.name} icon={item.icon} /></div>
                            <div className={styles.title}>
                                <div className={styles.name}>{item.symbol && item.symbol.toUpperCase()}</div>
                                <div className={styles.total}>{item.name}</div>
                            </div>
                            <div className={styles.selected}>
                                {item.tokenid && item.tokenid === this.props[`current_token_${type}`] && <CheckCircleOutlined theme="filled" style={{color: '#2F80ED', fontSize: 30}} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    }
}