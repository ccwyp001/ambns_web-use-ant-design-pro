import {
  queryAgeData,
  queryOccData,
  queryGenData,
  queryInsData,
  queryTopData,
  queryOrgData,
  queryTimeData,
  queryTownData,
  queryIcdData,
  queryGeoData,
  queryAgeGroup,
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
    townData:[],
    icdList:[],
  },

  effects: {
    *fetchIcdList({ payload }, { call, put }) {
      const response = yield call(queryIcdData, payload);
      yield put({
        type: 'save',
        payload: {
          icdList: response,
        },
      })
    },

    *fetchGeoData({ payload }, { call, put }) {
      const response = yield call(queryGeoData, payload);
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
    *fetchTownData(_, { call, put }) {
      const response = yield call(queryTownData);
      yield put({
        type: 'save',
        payload: {
          townData: response,
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
    *fetchInsData({ payload }, { call, put }) {
      const response = yield call(queryInsData, payload);
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
        townData:[],
        icdList:[],
      };
    },
  },
};
