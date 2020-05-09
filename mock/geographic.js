import city from './geographic/city.json';
import province from './geographic/province.json';
import yuhuan from './geographic/331083_full.json';
import yhxzq from './geographic/yhxzq.json';

function getProvince(req, res) {
  return res.json(province);
}

function getCity(req, res) {
  return res.json(city[req.params.province]);
}

function getYH(req, res) {
  return res.json({
    code: 10000,
    result: yuhuan,
  });
}

export default {
  'GET /api/geographic/province': getProvince,
  'GET /api/geographic/city/:province': getCity,
  'GET /api/geographic/yuhuan': getYH,
};
