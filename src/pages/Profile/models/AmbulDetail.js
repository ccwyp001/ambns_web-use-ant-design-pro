import { getAmbulanceDetail } from '@/services/ambulmanage_api';

export default {
  namespace: 'ambulDetail',

  state: {
    dispatchInfo: [],
    advancedOperation1: [],
    advancedOperation2: [],
  },

  effects: {
    *fetchAdvanced({ payload }, { call, put }) {
      const response = yield call(getAmbulanceDetail, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
