import { queryYHGeo } from '@/services/geographic';
import {
  queryAgeData,
  queryOccData,
  queryGenData,
  queryInsData,
  queryTopData,
  queryOrgData,
  queryTimeData,
} from '@/services/healthEyeSvc';

export default {
  namespace: 'map',

  state: {
    geo: [],
    occData: [],
    ageData:[],
    genderData: [],
    insData: [],
    topData:[],
    orgData:[],
    timeData:[],
  },

  effects: {
    *fetchGeoData(_, { call, put }) {
      const response = yield call(queryYHGeo);
      yield put({
        type: 'save',
        payload: {
          geo: response,
        },
      })
    },
    *fetchOrgData(_, { call, put }) {
      const response = yield call(queryOrgData);
      yield put({
        type: 'save',
        payload: {
          orgData: response,
        },
      })
    },
    *fetchTimeData(_, { call, put }) {
      const response = yield call(queryTimeData);
      yield put({
        type: 'save',
        payload: {
          timeData: response,
        },
      })
    },
    *fetchTopData(_, { call, put }) {
      const response = yield call(queryTopData);
      yield put({
        type: 'save',
        payload: {
          topData: response,
        },
      })
    },
    *fetchInsData(_, { call, put }) {
      const response = yield call(queryInsData);
      yield put({
        type: 'save',
        payload: {
          insData: response,
        },
      })
    },

    *fetchAgeData(_, { call, put }) {
      const response = yield call(queryAgeData);
      yield put({
        type: 'save',
        payload: {
          ageData: response,
        },
      });
    },

    *fetchGenData(_, { call, put }) {
      const response = yield call(queryGenData);
      yield put({
        type: 'save',
        payload: {
          genderData: response,
        },
      });
    },
    *fetchOccData(_, { call, put }) {
      const response = yield call(queryOccData);
      yield put({
        type: 'save',
        payload: {
          occData: response,
        },
      });
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
        geo: false,
        occData: [],
        ageData:[],
        genderData:[],
        insData: [],
        topData: [],
        orgData:[],
        timeData:[],
      };
    },
  },
};
