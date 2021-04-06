import {
  queryGeoTrans,
  createGeoTrans,
  deleteGeoTrans,
} from '@/services/healthEyeExtend';

export default {
  namespace: 'geoTrans',

  state: {
    geoTrans:[],
  },

  effects: {
    * fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryGeoTrans, payload);
      yield put({
        type: 'save',
        payload: {
          geoTrans: response,
        },
      })
      if (callback) callback();
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(createGeoTrans, payload);
      yield put({
        type: 'save',
        payload: {
        },
      });
      if (callback) callback();
    },
    * delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteGeoTrans, payload);
      yield put({
        type: 'save',
        payload: {
        },
      });
      if (callback) callback();
    },
    * create({ payload, callback }, { call, put }) {
      const response = yield call(createGeoTrans, payload);
      yield put({
        type: 'save',
        payload: {
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
        geoTrans:[],
      };
    },
  },
};
