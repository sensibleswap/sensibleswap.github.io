'use strict';
import React from 'react';
import CustomIcon from 'components/icon';
import styles from './index.less';

export default function TokenIcon(props) {
    const { name, icon, url, style } = props;
    if (icon) {
        return <CustomIcon type={icon} style={{ fontSize: 40, ...style }} />
    }

    if (url) {
        return <img src={url} style={{ width: 40, height: 40, ...style }} />;
    }

    if (!name) {
        return null;
    }
    const letter = name.substr(0, 1).toUpperCase();
    return (<div className={styles.logo} style={style}>{letter}</div>);
}



