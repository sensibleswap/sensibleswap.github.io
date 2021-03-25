'use strict';
import React, { Component } from 'react';
import styles from './headLeft.less';
import _ from 'i18n';
import Nav from '../nav'

export default class HeadLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {
        
    }

    render() {
        return <header className={styles.header}>
        <Nav />
    </header>;
    }
}