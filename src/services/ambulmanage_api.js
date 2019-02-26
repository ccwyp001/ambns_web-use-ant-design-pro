import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryAmbulance(params) {
  return request(`/api/amblumanage?${stringify(params)}`);
}

export async function removeAmbulance(params) {
  return request('/api/amblumanage', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addAmbulance(params) {
  return request('/api/amblumanage', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateAmbulance(params = {}) {
  return request(`/api/amblumanage?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}
