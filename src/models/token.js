import Tokenlist from '../../mock/tokenlist.json';

export default {

  namespace: 'token',

  state: {
      tokenlist: Tokenlist,
      current_token_origin: '',
      current_token_aim: ''
  },

  subscriptions: {
    async setup({ dispatch, history }) {  // eslint-disable-line
      
      
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
