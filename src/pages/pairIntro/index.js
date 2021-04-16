'use strict';
import React from 'react';
import styles from './index.less';
import _ from 'i18n';
import Cookie from 'js-cookie';

const lang = Cookie.get('lang') || navigator.language;
const isZh = lang.toLowerCase() === 'zh-cn';

export default function PairIntro(props) {

    if (props.data) {
        return <div className={styles.pair_intro}>
            {props.data.length > 0 && props.data.map((item, index) => {
                const { name, des_en, des_zh, web_url, id } = item;
                return <div key={id || index}>
                    <h3 className={styles.title}>{_('about')} {name}</h3>
                    <div className={styles.p}>
                        <p className={styles.desc}>{isZh ? des_zh : des_en}</p>
                        {web_url && <div className={styles.link}><a href={web_url} target='_blank'>{_('website')}</a></div>}
                    </div>
                </div>
            })}
        </div>;
    } else {
        return <div className={styles.pair_intro}>
            <h3 className={styles.title}>{_('create_pair_tips')}</h3>
            <div className={styles.p}>
                <p className={styles.desc}>{_('create_pair_desc')}</p>

            </div>
            <h3 className={styles.title}>{_('create_pair_rewards')}</h3>
            <div className={styles.p}>
                <p className={styles.desc}><span style={{fontWeight: '700'}}>{_('create_pair_rewords_desc1')}</span>{_('create_pair_rewords_desc2')}</p>
            </div>
        </div>
    }
}