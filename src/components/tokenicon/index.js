'use strict';
import React from 'react';
import CustomIcon from 'components/icon';
import styles from './index.less';

const icons = {
    'bsv': 'iconlogo-bitcoin'
}

export default function TokenIcon(props) {
    const { name, icon, url, size = 40, style } = props;
    if (icon) {
        return <CustomIcon type={icon} style={{ fontSize: size, ...style }} />
    }

    if (url) {
        return <img src={url} style={{ width: size, height: size, ...style }} />;
    }


    if (icons[name]) {
        return <CustomIcon type={icons[name]} style={{ fontSize: size, ...style }} />;
    }

    if (!name) {
        return null;
    }
    const letter = name.substr(0, 1).toUpperCase();
    return (<div className={styles.logo} style={{fontSize: size * 0.84, width: size, height: size, lineHeight: `${size}px`, ...style}}>{letter}</div>);
}



