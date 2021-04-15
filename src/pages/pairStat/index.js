'use strict';
import React from 'react';
import TokenLogo from 'components/tokenicon';
import styles from './index.less';
import _ from 'i18n';

export default function PairStat(props) {

    const {totalLiquidity = {}, volume = {}, fees = {}, pooledTokens = []} = props.data || {};
    return <div className={styles.container}>
        <div className={styles.item}>
            <div className={styles.label}>{_('total_liq')}</div>
            <div className={styles.value_wrap}>
                <div className={styles.value}>${totalLiquidity.totalAmount}</div>
                <div className={styles.percent} style={{ color: '#EB5757' }}>{totalLiquidity.changeRate}</div>
            </div>
        </div>
        <div className={styles.item}>
            <div className={styles.label}>{_('volume')}(24{_('hrs')})</div>
            <div className={styles.value_wrap}>
                <div className={styles.value}>${volume.amount}</div>
                <div className={styles.percent}>{volume.changeRate}</div>
            </div>
        </div>
        <div className={styles.item}>
            <div className={styles.label}>{_('fees')}(24{_('hrs')})</div>
            <div className={styles.value_wrap}>
                <div className={styles.value}>${fees.amount}</div>
                <div className={styles.percent} style={{ color: '#229278' }}>+{fees.changeRate}</div>
            </div>
        </div>
        <div className={styles.item}>
            <div className={styles.label}>{_('pooled_tokens')}</div>
            {pooledTokens.map(item => (
                <div className={styles.value2} key={item.tokenid}><TokenLogo name={item.name} icon={item.icon} /> {item.amount} {item.symbol}</div>
            ))}
        
        </div>
    </div>;
}