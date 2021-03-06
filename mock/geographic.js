import city from './geographic/city.json';
import province from './geographic/province.json';
import yuhuan from './geographic/331083_gaode.json';

function getProvince(req, res) {
  return res.json(province);
}

function getCity(req, res) {
  return res.json(city[req.params.province]);
}

function getYH(req, res) {
  return res.json(yuhuan);
}

export default {
  'GET /api/geographic/province': getProvince,
  'GET /api/geographic/city/:province': getCity,
  'GET /api/geographic/yuhuan': getYH,
};
