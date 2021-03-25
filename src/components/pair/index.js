
import React from 'react';
import CustomIcon from 'components/icon';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import _ from 'i18n';

export default function Pair(props) {
    return <div className={styles.container}>
        <div className={styles.item}>
            <div className={styles.title}>{_('your_total_liq')} <span>({_('include_fees')})</span></div>
            <div className={styles.value}>$23,838.06</div>
        </div>
        <div className={styles.item}>
            <div className={styles.title}>{_('fees_earned')} <span>({_('cumulative')})</span></div>
            <div className={styles.value} style={{ color: '#229278' }}>$2,232.89</div>
        </div>
        <div className={styles.item}>
            <div className={styles.title}>{_('pooled_tokens')}</div>
            <div className={styles.coin}>
                <div className={styles.icon}><CustomIcon type='iconlogo-bitcoin' /></div>
                    11.00 BSV
                </div>
            <div className={styles.coin}>
                <div className={styles.icon}><CustomIcon type='iconlogo-vusd' /></div>
                    1,000.00 vUSD
                </div>
        </div>
        <div className={styles.item}>
            <div className={styles.title} style={{ display: 'flex' }}>
                <div className={styles.name}>{_('pool_share')}</div>
                <div className={styles.help}><QuestionCircleOutlined /></div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>LP {_('tokens')}</div>
                <div className={styles.info_value}>0.0</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('pooled')} BSV</div>
                <div className={styles.info_value}>0.0</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('pooled')} vUSD</div>
                <div className={styles.info_value}>0.0</div>
            </div>
            <div className={styles.info_item}>
                <div className={styles.info_label}>{_('your_share')}</div>
                <div className={styles.info_value}>0.0%</div>
            </div>
        </div>
    </div>
}