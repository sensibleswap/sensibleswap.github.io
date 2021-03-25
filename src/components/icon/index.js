'use strict';
import React, { Component } from 'react';
import './iconfont.js'
import styles from './index.less';

export default class Icon extends Component {
  render() {
    return (<svg className="iconfont" aria-hidden="true" style={this.props.style}>
    <use xlinkHref={`#${this.props.type}`}></use>
</svg>);
  }
}



