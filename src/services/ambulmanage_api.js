import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryAmbulance(params) {
  return request(`/api/v1/ambul_manage?${stringify(params)}`);
}


export async function updateAmbulance(params = {}) {
  return request(`/api/v1/ambul_manage?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function getAmbulanceStations(params) {
  return request(`/api/v1/ambul_manage/stations?${stringify(params)}`);
}

export async function getAmbulanceDetail(params) {
  return request(`/api/v1/ambul_detail?${stringify(params)}`);
}
