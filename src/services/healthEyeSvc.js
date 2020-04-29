import request from '@/utils/request';

export async function queryAgeData() {
  return request('/api/v1/health_eye/data/age_dis');
}

export async function queryOccData() {
  return request('/api/v1/health_eye/data/occ_dis');
}

export async function queryGenData() {
  return request('/api/v1/health_eye/data/gender_dis');
}

export async function queryInsData() {
  return request('/api/v1/health_eye/data/ins_dis');
}
