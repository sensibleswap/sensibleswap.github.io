'use strict';
import React, { Component } from 'react';
import styles from './headRight.less';
import _ from 'i18n';
import UserInfo from '../userInfo';
import Lang from '../lang';

export default class Home extends Component {

    render() {
        return <div className={styles.user_info}>
        <UserInfo />
        <Lang />
    </div>;
    }
}