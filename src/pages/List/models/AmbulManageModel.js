import {
  queryAmbulance,
  updateAmbulance,
  getAmbulanceStations,
} from '@/services/ambulmanage_api';

export default {
  namespace: 'ambul_manage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    stations:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAmbulance, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateAmbulance, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *stations({ payload, callback }, { call, put }) {
      const response = yield call(getAmbulanceStations, payload);
      yield put({
        type: 'watch',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    watch(state, action) {
      return {
        ...state,
        stations: action.payload,
      }
    }
  },
};
