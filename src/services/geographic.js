import request from '@/utils/request';

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province) {
  return request(`/api/geographic/city/${province}`);
}

export async function queryYHGeo() {
  return request(`/api/geographic/yuhuan`);
}
