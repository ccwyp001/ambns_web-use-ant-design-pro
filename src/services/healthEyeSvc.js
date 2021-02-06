import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryAgeData() {
  return request('/api/v1/health_eye/data/age_dis');
}

export async function queryOccData() {
  return request('/api/v1/health_eye/data/occ_dis');
}

export async function queryGenData() {
  return request('/api/v1/health_eye/data/gender_dis');
}

export async function queryInsData(params) {
  return request(`/api/v1/health_eye/data/ins_dis?${stringify(params)}`);
}

export async function queryTopData() {
  return request('/api/v1/health_eye/data/top');
}

export async function queryOrgData() {
  return request('/api/v1/health_eye/data/org_dis');
}

export async function queryTimeData() {
  return request('/api/v1/health_eye/data/time_dis');
}

export async function queryTownData() {
  return request('/api/v1/health_eye/data/town_dis');
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
  return request(`/api/v1/health_eye/config/source?${stringify(params)}`);
}

export async function createDataSource(params) {
  return request(`/api/v1/health_eye/config/source?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
    },
  });
}
