import { queryDataSource, createDataSource } from '@/services/healthEyeSvc';

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
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateAgeGroup, payload);
      yield put({
        type: 'save',
        payload: {
          updateState: 1,
        },
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteAgeGroup, payload);
      yield put({
        type: 'save',
        payload: {
          updateState: 1,
        },
      });
      if (callback) callback();
    },
    *create({ payload, callback }, { call, put }) {
      const response = yield call(createDataSource, payload);
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
