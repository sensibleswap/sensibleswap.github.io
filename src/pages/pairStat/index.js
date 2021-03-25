'use strict';
import React from 'react';
import styles from './index.less';
import _ from 'i18n';

export default function PairStat(props) {

    return <div className={styles.container}>
        <div className={styles.item}>
            <div className={styles.label}>{_('total_liq')}</div>
            <div className={styles.value_wrap}>
                <div className={styles.value}>$136838169</div>
                <div className={styles.percent} style={{ color: '#EB5757' }}>-2.79%</div>
            </div>
        </div>
        <div className={styles.item}>
            <div className={styles.label}>{_('volume')}(24{_('hrs')})</div>
            <div className={styles.value_wrap}>
                <div className={styles.value}>$0.00</div>
                <div className={styles.percent}>0%</div>
            </div>
        </div>
        <div className={styles.item}>
            <div className={styles.label}>{_('fees')}(24{_('hrs')})</div>
            <div className={styles.value_wrap}>
                <div className={styles.value}>$5.21</div>
                <div className={styles.percent} style={{ color: '#229278' }}>+11.46%</div>
            </div>
        </div>
        <div className={styles.item}>
            <div className={styles.label}>{_('pooled_tokens')}</div>
            <div className={styles.value2}>116068 BSV</div>
            <div className={styles.value2}>68551988 vUSD</div>
        </div>
    </div>;
}