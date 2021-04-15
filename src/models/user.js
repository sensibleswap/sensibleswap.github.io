import Volt from 'lib/volt';
import { formatSat } from 'common/utils';
import tokenApi from 'api/token';

// const initTokens = [
//   {
//     name: 'bsv',
//     tokenid: 1,
//     value: 0.1,
//     symbol: 'BSV',
//     icon: 'iconlogo-bitcoin'
//   },
//   // {
//   //     icon: 'iconlogo-vusd',
//   //     name: 'vUSD',
//   //     symbol: 'VUSD',
//   //     value: 1000,
//   //     tokenid: 123
//   // },
//   {
//     icon: 'iconlogo-vbtc',
//     name: 'vBTC',
//     symbol: 'VBTC',
//     value: 0,
//     tokenid: 124
//   },
//   {
//     icon: 'iconlogo-veth',
//     name: 'vETH',
//     symbol: 'VETH',
//     value: 100,
//     tokenid: 125
//   },
//   {
//     name: 'vUSD',
//     symbol: 'VUSD',
//     value: 100,
//     tokenid: '8188eefde21026e50814f75990df017fdaf8f1c5',
//     icon: 'iconlogo-vusd',
//   },
//   {
//     name: 'Tang Dynasty',
//     symbol: 'Tang',
//     value: 1,
//     tokenid: '42d478002d33cc4ce381e9fe8d83a57d0ea55f96',
//     icon: 'iconlogo-bitcoin'
//   }
// ]
export default {

  namespace: 'user',

  state: {
    isLogin: false,
    accountName: '',
    wid: 0,
    wallet: {},
    tokens: [],
    origin_token_id: 'BSV',
    aim_token_id: '',
    // reverse: false,

    // origin_token_id: '8188eefde21026e50814f75990df017fdaf8f1c5',
    // aim_token_id: '42d478002d33cc4ce381e9fe8d83a57d0ea55f96',
    pair_data: {}
  },

  subscriptions: {
    async setup({ dispatch, history }) {  // eslint-disable-line
      // const res = await Volt.isOnline();
      // console.log(res);
      // if (res) {
      //   const wallet = await Volt.getWalletById();
      //   console.log(wallet)
      //   dispatch({
      //     type: 'save',
      //     payload: {
      //       isLogin: true,
      //       accountName: wallet.paymail || wallet.name,
      //       balance: formatSat(wallet.value),
      //       wallet: wallet,
      //       wid: wallet.id
      //     },
      //   });
      // }
      const res = await tokenApi.queryList();
      // console.log(res);
      dispatch({
        type: 'save',
        payload: {
          tokens: [
            {
              name: 'bsv',
              tokenId: 'BSV',
              value: 0,
              symbol: 'BSV',
              icon: 'iconlogo-bitcoin'
            },
            ...res
          ]
        }
      })


    }
  },

  effects: {

    // *init({ payload }, { call, put }) {
    //   const res = yield Volt.isOnline();
    //   debugger
    //   if (res) {
    //     const res = yield Volt.getWalletById();
    //     // console.log(res);
    //     if (res.code !== 200) return;
    //     const wallet = res.data;
    //     yield put({
    //       type: 'saveWalletData',
    //       payload: {
    //         isLogin: true,
    //         accountName: wallet.paymail || wallet.name,
    //         wallet: wallet,
    //       },
    //     });
    //   }
    // },

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
        type: 'saveWalletData',
        payload: {
          isLogin: true,
          accountName: wallet.paymail || wallet.name,
          wallet: wallet,
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
        type: 'saveWalletData',
        payload: {
          wallet,
          accountName: wallet.paymail || wallet.name,

        }
      })
    },
    *logout({ payload }, { call, put }) {
      const res = yield tokenApi.queryList();
      yield put({
        type: 'save',
        payload: {

          isLogin: false,
          accountName: '',
          wid: 0,
          wallet: {},
          wallets: [],
          tokens: [
            {
              name: 'bsv',
              tokenId: 'BSV',
              value: 0,
              symbol: 'BSV',
              icon: 'iconlogo-bitcoin'
            },
            ...res
          ]
        }
      })
    }

  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },

    saveWalletData(state, action) {
      const { wallet } = action.payload;
      const old_tokens = state.tokens;
      let new_tokens = [
        {
          tokenid: 'BSV',
          value: formatSat(wallet.value)
        },
        ...wallet.token];
        new_tokens.forEach(item => {
          if(!item.tokenId) item.tokenId = item.tokenid;
        })
      old_tokens.forEach((item, index) => {
        const i = new_tokens.findIndex(v => v.tokenid === item.tokenId);
        if (i > -1) {
          new_tokens[i] = Object.assign(item, new_tokens[i]);
        } else {
          new_tokens.push(item)
        }
      })
      return {
        ...state,
        ...action.payload,
        tokens: new_tokens,
        wid: wallet.id

      }
    },

  },

};
