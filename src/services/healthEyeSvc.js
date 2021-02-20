import request from '@/utils/request';
import { stringify } from 'qs';

export async function createAnalysisRecord(params = {}) {
  return request(`/api/v1/health_eye/data?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
    },
  });
}

export async function queryAnalysisRecord(params = {}) {
  return request(`/api/v1/health_eye/data?${stringify(params)}`);
}

export async function queryAgeData(params) {
  return request(`/api/v1/health_eye/data/age_dis?${stringify(params)}`);
}

export async function queryOccData(params) {
  return request(`/api/v1/health_eye/data/occ_dis?${stringify(params)}`);
}

export async function queryGenData(params) {
  return request(`/api/v1/health_eye/data/gender_dis?${stringify(params)}`);
}

export async function queryInsData(params) {
  return request(`/api/v1/health_eye/data/ins_dis?${stringify(params)}`);
}

export async function queryTopData(params) {
  return request(`/api/v1/health_eye/data/top?${stringify(params)}`);
}

export async function queryOrgData(params) {
  return request(`/api/v1/health_eye/data/org_dis?${stringify(params)}`);
}

export async function queryTimeData(params) {
  return request(`/api/v1/health_eye/data/time_dis?${stringify(params)}`);
}

export async function queryTownData(params) {
  return request(`/api/v1/health_eye/data/town_dis?${stringify(params)}`);
}

export async function queryIcdData(params) {
  return request(`/api/v1/health_eye/icd10_list/_search?${stringify(params)}`);
}

export async function queryGeoData(params) {
  return request(`/api/v1/health_eye/geo?${stringify(params)}`);
}

export async function queryAgeGroup(params) {
  return request(`/api/v1/health_eye/config/age_groups?${stringify(params)}`);
}

export async function updateAgeGroup(params = {}) {
  const { id, ...otherParams } = params.query;
  return request(`/api/v1/health_eye/config/age_group/${id}?${stringify(otherParams)}`, {
    method: 'PUT',
    body: {
      ...params.body,
    },
  });
}

export async function deleteAgeGroup(params) {
  return request(`/api/v1/health_eye/config/age_group/${params}`, {
    method: 'DELETE',
  });
}

export async function createAgeGroup(params = {}) {
  return request(`/api/v1/health_eye/config/age_groups?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
    },
  });
}

export async function queryDataSource(params) {
  return request(`/api/v1/health_eye/config/sources?${stringify(params)}`);
}

export async function createDataSource(params) {
  return request(`/api/v1/health_eye/config/sources?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
    },
  });
}

export async function updateDataSource(params) {
  return request(`/api/v1/health_eye/config/sources?${stringify(params.query)}`, {
    method: 'PUT',
    body: {
      ...params.body,
    },
  });
}

export async function deleteDataSource(params) {
  return request(`/api/v1/health_eye/config/sources?${stringify(params.query)}`, {
    method: 'DELETE',
    body: {
      ...params.body,
    },
  });
}
