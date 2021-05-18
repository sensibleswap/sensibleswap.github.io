'use strict';
import React, { Component } from 'react';
import styles from './index.less';
import _ from 'i18n';
import { Button, Popover, Modal, Select } from 'antd';
import { UpOutlined, SwapOutlined, UserOutlined, DownOutlined, CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import CustomIcon from 'components/icon';
import { withRouter, connect } from 'umi';
import Login from '../login';
import Volt from 'lib/volt';
// import EventBus from 'common/eventBus';



let _loginTimer;
const { Option } = Select;
@withRouter
@connect(({ user, loading }) => {
    const effects = loading.effects;
    return {
        ...user,
        connecting: effects['user/getWalletById'] || effects['user/switchWallet'],
    }

})
export default class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pop_visible: false,
            dialog_visible: false,
            login_visible: false,
            select_account_index: '',
            wallet_list: [],
        }
    }

    componentDidMount() {
        // setTimeout(()=>{
        //     this.init();
        // }, 1000)
        // EventBus.on('login', this.login)

    }

    init = async () => {

        const res = await Volt.isOnline();
        debugger
        //   if (res) {
        //     const res = await Volt.getWalletById();
        //     // console.log(res);
        //     if (res.code !== 200) return;
        //     const wallet = res.data;
        //     await this.props.dispatch({
        //       type: 'user/saveWalletData',
        //       payload: {
        //         isLogin: true,
        //         accountName: wallet.paymail || wallet.name,
        //         wallet: wallet,
        //       },
        //     });
        //   }
    }

    closePop = () => {
        this.setState({
            pop_visible: false
        })
    }

    // 打开切换钱包的对话框
    showDialog = async () => {
        this.setState({
            pop_visible: false,
            dialog_visible: true,
            walletList_loading: true
        })
        const res = await this.props.dispatch({
            type: 'user/getWalletList',
        })
        const { wid } = this.props;
        // const res = await Volt.getWalletList();
        // console.log(res)
        if (!Array.isArray(res)) return;
        const list = res.filter(v => v.tokenid === 1);
        let current_index = list.findIndex(v => parseInt(v.id) === parseInt(wid));
        if (current_index < 0) current_index = 0;
        this.setState({
            walletList_loading: false,
            wallet_list: list,
            select_account_index: current_index
        })
    }
    // 关闭切换钱包的对话框
    closeDialog = () => {
        this.setState({
            dialog_visible: false
        });

    }

    handleVisibleChange = visible => {
        this.setState({ pop_visible: visible });
    };
    login = async () => {
        const res = await Volt.login();
        if (res) {
            const res = await Volt.getWalletDetail();
            // console.log(res);
            if (res.code !== 200) return;
            const wallet = res.data;
            await this.props.dispatch({
                type: 'user/saveWalletData',
                payload: {
                    isLogin: true,
                    accountName: wallet.paymail || wallet.name,
                    wallet: wallet,
                },
            });
        }
    }

    // 打开登录对话框
    // login1 = () => {
    //     this.setState({
    //         login_visible: true,
    //         pop_visible: false,
    //         dialog_visible: false
    //     });
    //     const { isLogin } = this.props;

    //     _loginTimer = setInterval(async () => {

    //         const res = await Volt.isOnline();
    //         console.log(res);

    //         if (isLogin || !this.state.login_visible) {
    //             clearInterval(_loginTimer);
    //         }
    //         // 登录成功后
    //         if (res.data.wid) {

    //             this.setState({
    //                 login_visible: false,
    //             })
    //             await this.props.dispatch({
    //                 type: 'user/getWalletById',
    //                 payload: {
    //                     wid: res.wid
    //                 }
    //             })

    //             clearInterval(_loginTimer);
    //         }
    //         // }
    //     }, 500);
    // }

    // closeLogin = () => {


    //     this.setState({
    //         login_visible: false,
    //     });
    //     clearInterval(_loginTimer);
    // }

    disConnect = async () => {
        const res = await Volt.logout();
        console.log(res)
        if (res) {
            this.setState({
                login_visible: false,
                pop_visible: false
            })
            this.props.dispatch({
                type: 'user/logout',
            })
        }

    }

    confirmSwitchWallet = () => {

        const { select_account_index, wallet_list } = this.state;
        const wallet = wallet_list[select_account_index];

        this.props.dispatch({
            type: 'user/switchWallet',
            payload: {
                wid: wallet.id
            }
        })
        this.setState({
            dialog_visible: false,
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
                    <div className={styles.account_name}><CustomIcon type='iconVolt_logo' style={{ fontSize: 14 }} /> {accountName}</div>
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
        const { pop_visible, dialog_visible, login_visible, wallet_list, select_account_index, walletList_loading } = this.state;
        const { isLogin, accountName, connecting } = this.props;
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
                        <CustomIcon type='iconVolt_logo' style={{ fontSize: 14, marginRight: 5 }} />{accountName}
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
                            {walletList_loading ? <LoadingOutlined /> : <Select className={styles.acc_list} style={{ width: 297 }} onChange={this.switchAccountName} defaultValue={select_account_index}>
                                {wallet_list.map((item, index) => (<Option value={index} key={item.id}>{item.name}</Option>))}
                            </Select>}
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
                        <Button className={styles.btn} type='primary' onClick={this.confirmSwitchWallet} disabled={walletList_loading}>{_('agree_switch')}</Button>
                        <div className={styles.cancel} onClick={this.closeDialog}>{_('cancel')}</div>
                    </div>
                </Modal>
            </>
            : <>

                {connecting ? <div className={styles.connect}><LoadingOutlined /></div> : <div className={styles.connect} onClick={this.login}>{_('connect_wallet')}</div>}

                {connecting ? <div className={styles.connect_app}><LoadingOutlined /></div> : <div className={styles.connect_app} onClick={this.login}><UserOutlined /></div>}

            </>;
    }
}