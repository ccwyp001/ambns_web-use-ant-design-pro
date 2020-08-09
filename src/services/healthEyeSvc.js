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

export async function queryAgeGroup(params) {
  return request(`/api/v1/health_eye/config/age_group?${stringify(params)}`);
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
  return request(`/api/v1/health_eye/data/icd_list?${stringify(params)}`);
}
