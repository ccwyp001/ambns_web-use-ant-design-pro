import {
  queryAgeGroup,
  updateAgeGroup,
  createAgeGroup,
  deleteAgeGroup
} from '@/services/healthEyeSvc';

export default {
  namespace: 'ageGroup',

  state: {
    ageGroup:[],
    updateState: 0,
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
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateAgeGroup, payload);
      yield put({
        type: 'save',
        payload: {
          updateState: 1,
        },
      });
      if (callback) callback();
    },
    * delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteAgeGroup, payload);
      yield put({
        type: 'save',
        payload: {
          updateState: 1,
        },
      });
      if (callback) callback();
    },
    * create({ payload, callback }, { call, put }) {
      const response = yield call(createAgeGroup, payload);
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
        ageGroup:[],
      };
    },
  },
};
