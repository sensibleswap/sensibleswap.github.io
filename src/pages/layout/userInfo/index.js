'use strict';
import React, { Component } from 'react';
import styles from './index.less';
import _ from 'i18n';
import { Button, Popover, Modal, Select } from 'antd';
import { UpOutlined, SwapOutlined, UserOutlined, DownOutlined, CheckOutlined } from '@ant-design/icons';
import CustomIcon from 'components/icon';
import { withRouter, connect } from 'umi';
import Login from '../login';
import Volt from 'lib/volt';
import { formatSat } from 'common/utils';



let _loginTimer;
const { Option } = Select;
@withRouter
@connect(({ user }) => {
    return {
        ...user
    }

})
export default class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pop_visible: false,
            dialog_visible: false,
            login_visible: false,
            select_account_index: 0,
            wallet_list: [],
        }
    }

    closePop = () => {
        this.setState({
            pop_visible: false
        })
    }

    showDialog = async () => {
        const { wid } = this.props;
        const res = await Volt.getWalletList();
        console.log(res)
        if(!Array.isArray(res)) return;
        let current_index = res.findIndex(v => v.id = wid);
        if (current_index < 0) current_index = 0;
        this.setState({
            pop_visible: false,
            dialog_visible: true,
            wallet_list: res,
            select_account_index: current_index
        })
    }

    handleVisibleChange = visible => {
        this.setState({ pop_visible: visible });
    };

    closeDialog = () => {
        this.setState({
            dialog_visible: false
        });

    }

    login = () => {
        this.setState({
            login_visible: true,
            pop_visible: false,
            dialog_visible: false
        });

        _loginTimer = setInterval(async () => {

            const res = await Volt.login();
            console.log(res);
            if (res.appid) {
                console.log(res);
                this.props.dispatch({
                    type: 'user/save',
                    payload: {
                        isLogin: true,
                        accountName: res.paymail || res.name,
                        balance: formatSat(res.wallet[0].value),
                        wid: res.wid
                    }
                })

                clearInterval(_loginTimer);
            }
            // }
        }, 500);
    }

    closeLogin = () => {


        this.setState({
            login_visible: false,
        });
        clearInterval(_loginTimer);
    }

    disConnect = async () => {
        const res = await Volt.logout();
        if (res) {
            this.setState({
                login_visible: false,
                pop_visible: false
            })
            this.props.dispatch({
                type: 'user/save',
                payload: {
                    isLogin: false,
                    accountName: '',
                    wid: 0,
                    balance: 0
                }
            })
        }

    }

    confirmSwitchWallet = () => {

        const { select_account_index, wallet_list } = this.state;
        const wallet = wallet_list[select_account_index];
        this.props.dispatch({
            type: 'user/save',
            payload: {
                isLogin: true,
                accountName: wallet.name,
                balance: formatSat(wallet.value),
                wid: wallet.id
            }
        });
        this.setState({
            dialog_visible: false
        })

    }

    switchAccountName = (index) => {

        this.setState({
            select_account_index: index
        })
    }

    renderPop() {
        const { accountName } = this.props;
        return <div className={styles.user_pop}>
            <div className={styles.hd}>
                <div className={styles.left}>
                    <div>{_('connected_account')}</div>
                    <div className={styles.account_name}>{accountName}</div>
                </div>
                <div className={styles.account_icon} onClick={this.closePop}>
                    <UpOutlined />
                </div>
            </div>
            <div className={styles.bd}>
                <div className={styles.line} onClick={this.showDialog}>
                    <SwapOutlined style={{ fontSize: 18, color: '#2F80ED', marginRight: 15 }} />
                    <span className={styles.name}>{_('switch_wallet')}</span>
                </div>
                <div className={styles.line} onClick={() => {
                    this.props.history.push('my');
                    this.closePop()
                }}>
                    <UserOutlined style={{ fontSize: 18, color: '#2F80ED', marginRight: 15 }} />
                    <span className={styles.name}>{_('go_to_infopage')}</span>
                </div>
            </div>
            <div className={styles.ft}>
                <Button className={styles.btn} style={{ width: '100%' }} onClick={this.disConnect}>{_('disconnect_account')}</Button>
            </div>
        </div>
    }

    render() {
        const { pop_visible, dialog_visible, login_visible, wallet_list, select_account_index } = this.state;
        const { isLogin, accountName, wid } = this.props;
        return isLogin ?
            <>
                <Popover
                    content={this.renderPop()}
                    trigger="click"
                    visible={pop_visible}
                    onVisibleChange={this.handleVisibleChange}
                    placement='bottomRight'
                >
                    <div className={styles.account_trigger}>
                        {accountName}
                        <div className={styles.account_icon}>
                            <DownOutlined />
                        </div>
                    </div>
                </Popover>
                <Modal
                    title=""
                    visible={dialog_visible}
                    footer={null}
                    className={styles.dialog}
                    width='435px'
                    closable={false}
                    onCancel={this.closeDialog}
                >
                    <div className={styles.account}>
                        <div className={styles.dia_title}>{_('select_wallet_title')}</div>
                        <div className={styles.acc_list_box}>
                            <CustomIcon type='iconlogo-bitcoin' style={{ fontSize: 40, marginRight: 13 }} />
                            <Select className={styles.acc_list} style={{ width: 297 }} onChange={this.switchAccountName} defaultValue={select_account_index}>
                                {wallet_list.map((item, index) => (<Option value={index} key={item.id}>{item.name}</Option>))}
                            </Select>
                        </div>
                    </div>
                    <div className={styles.persission_title}>{_('permission_request')}</div>
                    <div className={styles.website}>{window.location.origin}</div>
                    <ul className={styles.tips}>
                        <li><CheckOutlined /> {_('permis_tips_1')}</li>
                        <li><CheckOutlined /> {_('permis_tips_2')}</li>
                        <li><CheckOutlined /> {_('permis_tips_3')}</li>
                        <li><CheckOutlined /> {_('permis_tips_4')}</li>
                    </ul>
                    <div className={styles.btns}>
                        <Button className={styles.btn} type='primary' onClick={this.confirmSwitchWallet}>{_('agree_switch')}</Button>
                        <div className={styles.cancel} onClick={this.closeDialog}>{_('cancel')}</div>
                    </div>
                </Modal>
            </>
            : <>

                <div className={styles.connect} onClick={this.login}>{_('connect_wallet')}</div>
                <Modal
                    title=""
                    visible={login_visible}
                    footer={null}
                    className={styles.login_dialog}
                    width="820px"
                    maskClosable={true}
                    closeable={false}
                    onCancel={this.closeLogin}>
                    <Login />
                </Modal>
            </>;
    }
}