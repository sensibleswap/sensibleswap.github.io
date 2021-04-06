import Volt from 'lib/volt';
import { formatSat } from 'common/utils';

export default {

  namespace: 'user',

  state: {
    isLogin: false,
    accountName: '',
    balance: 0,
    wid: 0,
    wallet: {}
  },

  subscriptions: {
    // async setup({ dispatch, history }) {  // eslint-disable-line
    //   const res = await Volt.isOnline();
    //   console.log(res);
    //   if (res) {
    //     const wallet = await Volt.getWalletById();
    //     console.log(wallet)
    //     dispatch({
    //       type: 'save',
    //       payload: {
    //         isLogin: true,
    //         accountName: wallet.paymail || wallet.name,
    //         balance: formatSat(wallet.value),
    //         wallet: wallet,
    //         wid: wallet.id
    //       },
    //     });
    //   }

    // }
  },

  effects: {

    *init({ payload }, { call, put }) {
      const res = yield Volt.isOnline();
      debugger
      if (res) {
        const res = yield Volt.getWalletById();
        // console.log(res);
        if (res.code !== 200) return;
        const wallet = res.data;
        yield put({
          type: 'save',
          payload: {
            isLogin: true,
            accountName: wallet.paymail || wallet.name,
            balance: formatSat(wallet.value),
            wallet: wallet,
            wid: wallet.id
          },
        });
      }
    },

    //扫码登录后的获取数据
    // *login({ payload }, { call, put }) {
    //   const { wid } = payload;
    //   const wallet = yield Volt.getWalletById(wid);
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       wid,
    //       isLogin: true,
    //       accountName: wallet.paymail || wallet.name,
    //       balance: formatSat(wallet.value),
    //       wallet
    //     }
    //   });

    // },

    // *logout({ payload }, { call, put }) {

    // },

    *getWalletList({ payload }, { call, put }) {

      const res = yield Volt.getWalletList();
      // console.log(res);
      if (res.code !== 200) return;
      const wallets = res.data;
      yield put({
        type: 'save',
        payload: {
          wallets
        }
      });
      return wallets;
    },

    *getWalletById({ payload }, { call, put }) {
      const res = yield Volt.getWalletById(payload.wid);
      // console.log(res);
      if (res.code !== 200) return;
      const wallet = res.data;
      yield put({
        type: 'save',
        payload: {
          isLogin: true,
          accountName: wallet.paymail || wallet.name,
          balance: formatSat(wallet.value),
          wallet: wallet,
          wid: wallet.id
        },
      });
    },

    *switchWallet({ payload }, { call, put }) {
      const { wid } = payload;
      const res = yield Volt.switchWallet(wid);
      // console.log(res);
      if (res.code !== 200) return;
      const wallet = res.data;
      yield put({
        type: 'save',
        payload: {
          wallet,
          accountName: wallet.paymail || wallet.name,
          balance: formatSat(wallet.value),
          wid: wallet.id

        }
      })
    }

  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },

    logout(state, action) {
      return {
        ...state,
        isLogin: false,
        accountName: '',
        wid: 0,
        balance: 0,
        wallet: {},
        wallets: []
      }
    }

  },

};
