import Volt from 'lib/volt';
import { formatSat } from 'common/utils';

export default {

  namespace: 'user',

  state: {
    isLogin: false,
    accountName: '',
    balance: 0,
    wid: 0,
  },

  subscriptions: {
    async setup({ dispatch, history }) {  // eslint-disable-line
      const res = await Volt.isOnline();
      if(res) {
        const res2 = await Volt.getUserInfo();
        console.log(res2)
        if(!res2.wallet) return;
        const wallet = res2.wallet[0];
        dispatch({
          type: 'save',
          payload: {
            isLogin: true,
            accountName: wallet.paymail || wallet.name,
            balance: formatSat(wallet.value),
            wid: wallet.id
          },
        });
      }
      
    }
  },

  effects: {

    },

    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },

    },

  };
