import { parse } from 'url';

// 左补0
function padding(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}

let HealthDataSource = [];
for (let i=0; i <30000;i+=1){
  HealthDataSource.push({
    key: `201902270${padding(i, 5)}`,
    cardID: `33102119910222${padding(i, 4)}`,
    age: Math.floor(Math.random() * 100) % 100,
    gender: Math.floor(Math.random() * 10) % 2 === 0 ? '0': '1',
    occupation: Math.floor(Math.random() * 10) % 6,
    town: Math.floor(Math.random() * 100) % 12,
    community: Math.floor(Math.random() * 100) % 12,
    icd10: `A${Math.floor(Math.random() * 100) % 99}.${padding(Math.floor(Math.random() * 10) % 2, 3)}`,
    sickenTime: new Date(`2019-03-${Math.floor(i / 2) + 1}`),
    clinicTime: new Date(`2019-03-${Math.floor(i / 2) + 1}`),
    clinicOrg: Math.floor(Math.random() * 100) % 12,
    clinicOutCity: Math.floor(Math.random() * 10) % 2 === 0 ? '0': '1',
    payType: Math.floor(Math.random() * 10) % 4,
    cost: Math.floor(Math.random() * 1000) + Math.ceil(Math.random() * 100) / 100,
  })
}


function getAll(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = HealthDataSource;

  const result = {
    code: 10000,
    result: dataSource,

  };

  return res.json(result);
}


function getAgeDis(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = HealthDataSource;

  // let ageDis = [0, 2, 4, 6, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80];
  let ageDis = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];

  if (params.age_group) {
    ageDis = params.age_group;
  }

  let ageGroup = [];
  for (let i=0; i<ageDis.length;i += 1) {
    if (i===0) {
      if (ageDis[i+1] - ageDis[i] === 1){
        ageGroup.push(['0', '0']);
        ageGroup.push([ageDis[i+1], ageDis[i+1]])
      }
      else {
        ageGroup.push([ageDis[i], ageDis[i+1]])
      }
    }
    else {
      ageGroup.push([ageDis[i] + 1, ageDis[i+1] || ''])
    }
  }
  let ageCount = [];
  let filterDataSource = [];
  ageGroup.forEach(s =>{
    filterDataSource = dataSource.filter(
      d => parseInt(s[0], 10) <= parseInt(d.age, 10)
        && parseInt(d.age, 10) <= parseInt(s[1] || 200, 10));
    ageCount.push({x: s[0]===s[1]?`${s[0]}`:`${s[0]}-${s[1]}`, y: filterDataSource.length})
  });

  const result = {
    code:10000,
    result: ageCount,
  };

  return res.json(result);
}

function getOccDis(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = HealthDataSource;

  let OccCount = {};
  let OccDis = [];
  dataSource.map(item => {
    OccCount[item.occupation] = OccCount[item.occupation] ? OccCount[item.occupation] + 1 : 1;
    return item;
    }
  );
  Object.keys(OccCount).map(key => OccDis.push({x: key, y: OccCount[key]}));

  const result = {
    code: 10000,
    result: OccDis,
  };

  return res.json(result);
}

function getGenDis(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = HealthDataSource;
  let filterDataSource = [];
  let GenCount = [];

  [0, 1].forEach(s =>{
    filterDataSource = dataSource.filter(
      data => parseInt(data.gender, 10) === parseInt(s, 10));
    GenCount.push((filterDataSource.length / dataSource.length * 100).toFixed(1))
  });

  const result = {
    code: 10000,
    result: GenCount,
  };

  return res.json(result);
}

function getInsDis(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = HealthDataSource;
  let filterDataSource = [];
  let InsCount = [];
  const insList = {
    0: '职工',
    1: '城乡',
    2: '少儿',
    3: '其他',
  };

  [0, 1, 2, 3].forEach(s =>{
    filterDataSource = dataSource.filter(
      data => parseInt(data.payType, 10) === parseInt(s, 10));
    InsCount.push({x: insList[s], y: filterDataSource.length})
  });

  const result = {
    code: 10000,
    result: InsCount,
  };

  return res.json(result);
}

function getTop(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = HealthDataSource;
  let TopCount = {};
  let TopDis = [];

  dataSource.map(item => {
    TopCount[item.icd10] = TopCount[item.icd10] ? TopCount[item.icd10] + 1 : 1;
      return item;
    }
  );
  Object.keys(TopCount).map(key => TopDis.push({x: key, y: TopCount[key]}));
  TopDis = TopDis.sort((prev, next) => {
    return next.y - prev.y;
  });

  const result = {
    code: 10000,
    result: TopDis.slice(0,6),
  };

  return res.json(result);
}

export default {
  'GET /api/v1/health_eye/data/all': getAll,
  'GET /api/v1/health_eye/data/top': getTop,
  'GET /api/v1/health_eye/data/age_dis': getAgeDis,
  'GET /api/v1/health_eye/data/occ_dis': getOccDis,
  'GET /api/v1/health_eye/data/gender_dis': getGenDis,
  'GET /api/v1/health_eye/data/ins_dis': getInsDis,

}
