import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryGeoTrans(params) {
  return request(`/api/v1/health_eye/geo_trans?${stringify(params)}`);
}

export async function deleteGeoTrans(params) {
  return request(`/api/v1/health_eye/geo_trans?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function createGeoTrans(params) {
  return request(`/api/v1/health_eye/geo_trans?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
    },
  });
}
