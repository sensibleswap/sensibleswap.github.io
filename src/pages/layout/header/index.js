'use strict';
import React from 'react';
import styles from './index.less';
import _ from 'i18n';
import Nav from '../nav';
import UserInfo from '../userInfo';
import Lang from '../lang';

export default function Header() {

    return <header className={styles.header}>
        <Nav />
        <div className={styles.user_info}>
            <UserInfo />
            <Lang />
        </div>
    </header>;
}