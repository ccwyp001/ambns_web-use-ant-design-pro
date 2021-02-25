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
  queryDataSource,
  queryAgeGroup,
  queryAnalysisRecord,
  createAnalysisRecord,
} from '@/services/healthEyeSvc';

export default {
  namespace: 'map',

  state: {
    geo: [],
    occData: [],
    ageData: [],
    genderData: [],
    insData: [],
    topData: [],
    orgData: [],
    timeData: [],
    townData: [],
    icdList: [],
    sourceList: [],
    ageGroups: [],
    analysisSign: '',
    analysisState: {},
    dataPoint: [],
    topList: [],
  },

  effects: {
    *createAnalysis({ payload, callback }, { call, put }) {
      const response = yield call(createAnalysisRecord, payload);
      yield put({
        type: 'save',
        payload: {
          analysisSign: response,
          analysisState: {
            current: 0,
            done: 0,
            total: 8,},
        },
      });
      if (callback) callback();
    },

    * fetchAnalysis({ payload, callback }, { call, put }) {
      const response = yield call(queryAnalysisRecord, payload);
      yield put({
        type: 'save',
        payload: {
          analysisState: response,
        },
      });
      if (callback) callback();
    },

    *fetchIcdList({ payload }, { call, put }) {
      const response = yield call(queryIcdData, payload);
      yield put({
        type: 'save',
        payload: {
          icdList: response,
        },
      });
    },
    *fetchSourceList({ payload }, { call, put }) {
      const response = yield call(queryDataSource, payload);
      yield put({
        type: 'save',
        payload: {
          sourceList: response,
        },
      });
    },
    *fetchAgeGroup({ payload }, { call, put }) {
      const response = yield call(queryAgeGroup, payload);
      yield put({
        type: 'save',
        payload: {
          ageGroups: response,
        },
      });
    },
    *fetchGeoData({ payload }, { call, put }) {
      const response = yield call(queryGeoData, payload);
      yield put({
        type: 'save',
        payload: {
          geo: response,
        },
      });
      const data = response.features.map(fe=>{
        return {
          name:fe.properties.name,
          x: fe.properties.center[0],
          y: fe.properties.center[1]
        }
      });
      yield put({
        type: 'save',
        payload: {
          dataPoint: data,
        },
      });
    },
    *fetchOrgData({ payload }, { call, put }) {
      const response = yield call(queryOrgData, payload);
      yield put({
        type: 'save',
        payload: {
          orgData: response,
        },
      });
    },
    *fetchTownData({ payload }, { call, put }) {
      const response = yield call(queryTownData, payload);
      yield put({
        type: 'save',
        payload: {
          townData: response,
        },
      });
    },
    *fetchTimeData({ payload }, { call, put }) {
      const response = yield call(queryTimeData, payload);
      yield put({
        type: 'save',
        payload: {
          timeData: response,
        },
      });
    },
    *fetchTopData({ payload }, { call, put }) {
      const response = yield call(queryTopData, payload);
      yield put({
        type: 'save',
        payload: {
          topData: response,
        },
      });
      const data = [];
      response.map(re => {
        data.push(re.x)
      })
      yield put({
        type: 'save',
        payload: {
          topList: data,
        },
      });
    },
    *fetchInsData({ payload }, { call, put }) {
      const response = yield call(queryInsData, payload);
      yield put({
        type: 'save',
        payload: {
          insData: response,
        },
      });
    },

    *fetchAgeData({ payload }, { call, put }) {
      const response = yield call(queryAgeData, payload);
      yield put({
        type: 'save',
        payload: {
          ageData: response,
        },
      });
    },

    *fetchGenData({ payload }, { call, put }) {
      const response = yield call(queryGenData, payload);
      yield put({
        type: 'save',
        payload: {
          genderData: response,
        },
      });
    },
    *fetchOccData({ payload }, { call, put }) {
      const response = yield call(queryOccData, payload);
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
        dataPoint: [],
        occData: [],
        ageData: [],
        genderData: [],
        insData: [],
        topData: [],
        topList: [],
        orgData: [],
        timeData: [],
        townData: [],
        icdList: [],
        sourceList: [],
        ageGroups: [],
        analysisSign: '',
        analysisState: {},
      };
    },
  },
};
