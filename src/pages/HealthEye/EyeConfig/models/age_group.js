import {
  queryAgeGroup
} from '@/services/healthEyeSvc';

export default {
  namespace: 'ageGroup',

  state: {
    ageGroup:[],
  },

  effects: {
    * fetchAgeGroup({ payload }, { call, put }) {
      const response = yield call(queryAgeGroup, payload);
      yield put({
        type: 'save',
        payload: {
          ageGroup: response,
        },
      })
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        ageGroup:[],
      };
    },
  },
};
