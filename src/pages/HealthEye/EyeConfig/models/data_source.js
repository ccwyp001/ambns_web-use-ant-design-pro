import { queryDataSource, updateDataSource, deleteDataSource } from '@/services/healthEyeSvc';

export default {
  namespace: 'dataSource',

  state: {
    source: [],
    State: 0,
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryDataSource, payload);
      yield put({
        type: 'save',
        payload: {
          source: response,
        },
      });
      if (callback) callback();
    },
    *fetchRate({ payload, callback }, { call, put }) {
      const response = yield call(queryDataSource, payload);
      yield put({
        type: 'save',
        payload: {
          source: response,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateDataSource, payload);
      yield put({
        type: 'save',
        payload: {
          updateState: 1,
        },
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteDataSource, payload);
      yield put({
        type: 'save',
        payload: {
          updateState: 1,
        },
      });
      if (callback) callback();
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
        Source: [],
      };
    },
  },
};
