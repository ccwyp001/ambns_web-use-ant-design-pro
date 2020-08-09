import { parse } from 'url';
import icdList from './GetIcdList.json';

// 左补0
function padding(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}

// 从数组中随机取几个元素
function getRandomArrayElements(arr, count) {
  let i = arr.length;
  const shuffled = arr.slice(0);
  const min = i - count;
  while (i > min) {
    i -= 1;
    const index = Math.floor((i + 1) * Math.random());
    const temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

const HealthDataSource = [];
let st = new Date('2012-01-01');
let ed = new Date('2012-12-08');
for (let i=0; i <30000;i+=1){
  HealthDataSource.push({
    key: `201902270${padding(i, 5)}`,
    cardID: `33102119910222${padding(i, 4)}`,
    age: Math.floor(Math.random() * 100) % 90,
    gender: Math.floor(Math.random() * 10) % 2 === 0 ? '0': '1',
    occupation: Math.floor(Math.random() * 10) % 6,
    town: `331083${padding(Math.floor(Math.random() * 100) % 12 + 1, 2)}`,
    community: Math.floor(Math.random() * 100) % 12,
    icd10: `A${Math.floor(Math.random() * 100) % 99}.${padding(Math.floor(Math.random() * 10) % 2, 3)}`,
    sickenTime: new Date(
      `201${Math.floor(Math.random() * 10) % 4}-${Math.floor(Math.random() * 10) % 12 + 1}-${Math.floor(Math.random() * 10) % 30 + 1}`),
    clinicTime: new Date(
      `201${Math.floor(Math.random() * 10) % 4}-${Math.floor(Math.random() * 10) % 12 + 1}-${Math.floor(Math.random() * 25) % 25 + 1}`),
    clinicOrg: Math.floor(Math.random() * 100) % 12,
    clinicOutCity: Math.floor(Math.random() * 10) % 2 === 0 ? '0': '1',
    payType: Math.floor(Math.random() * 10) % 4,
    cost: Math.floor(Math.random() * 1000) + Math.ceil(Math.random() * 100) / 100,
  })
}
const Ages = [];
for (let i=0; i<100; i+=1){
  Ages.push(i)
}
const AgeGroupDataSource = [];
for (let i=0; i < 20; i+=1){
  AgeGroupDataSource.push({
    id: i,
    name: `age group ${i}`,
    group: getRandomArrayElements(Ages, Math.floor(Math.random() * 100) % 15 + 10).sort(
      (prev, next) => {return prev - next}
    ),
    updateAt: new Date(
      `201${Math.floor(Math.random() * 10) % 4}-${Math.floor(Math.random() * 10) % 12 + 1}-${Math.floor(Math.random() * 10) % 30 + 1}`),
    disabled: Math.floor(Math.random() * 10) % 2 === 0 ? '0': '1',
  })
}

function getAgeGroup(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let AgeSource = AgeGroupDataSource;

  const result = {
    code: 10000,
    result: AgeSource
  };
  return res.json(result)
}

function postAgeGroup(req, res) {
  const { /* url = '', */ body } = req;
  // const params = getUrlParams(url);
  const { method, id } = body;
  // const count = (params.count * 1) || 20;
  let result = AgeGroupDataSource;

  switch (method) {
    case 'delete':
      result = result.filter(item => item.id !== id);
      break;
    case 'update':
      result.forEach((item, i) => {
        if (item.id === id) {
          result[i] = Object.assign(item, body);
        }
      });
      break;
    case 'post':
      result.unshift({
        body,
        id: `fake-list-${result.length}`,
        createdAt: new Date().getTime(),
      });
      break;
    default:
      break;
  }

  return res.json(result);
}


function getAll(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = HealthDataSource;

  if (params.clinicTime) {
    [st, ed] = params.clinicTime;
  }
  dataSource = dataSource.filter(data => st <= data.clinicTime && data.clinicTime <= ed);

  return dataSource;
}


function getAgeDis(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = getAll(req, res, u);

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

  let dataSource = getAll(req, res, u);

  const OccCount = {};
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

  let dataSource = getAll(req, res, u);
  let filterDataSource = [];
  const GenCount = [];

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

  const dataSource = getAll(req, res, u);
  let filterDataSource = [];
  const InsCount = [];
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

  const dataSource = getAll(req, res, u);
  const TopCount = {};
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

  return TopDis.slice(0,8)
}

function getOrgDis(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = getAll(req, res, u);
  let filterDataSource = [];
  let filterTopSource = [];
  const OrgCount = [];
  const OrgList = {};
  const TopList = getTop(req, res, u);
  for (let i = 0; i < 12; i += 1){
    OrgList[i] = `hospital ${i}`
  }

  Object.keys(OrgList).forEach(s =>{
    filterDataSource = dataSource.filter(
      data => parseInt(data.clinicOrg, 10) === parseInt(s, 10)
    );
    const tmpList = {};
    TopList.forEach(ss =>{
      filterTopSource = filterDataSource.filter(
        data => data.icd10 === ss.x
      );
      tmpList[ss.x] = filterTopSource.length
    });
    OrgCount.push({x: OrgList[s], y: filterDataSource.length, icds: tmpList})
  });

  const result = {
    code: 10000,
    result: OrgCount,
  };
  return res.json(result);
}

function getTownDis(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  let dataSource = getAll(req, res, u);
  let filterDataSource = [];
  let filterTopSource = [];
  const TownCount = [];
  const TownList = {};
  const TopList = getTop(req, res, u);
  for (let i = 0; i < 12; i += 1){
    TownList[i] = `331083${padding(i + 1, 2)}`
  }

  Object.keys(TownList).forEach(s =>{
    filterDataSource = dataSource.filter(
      data => parseInt(data.town, 10) === parseInt(TownList[s], 10)
    );
    const tmpList = {};
    TopList.forEach(ss =>{
      filterTopSource = filterDataSource.filter(
        data => data.icd10 === ss.x
      );
      tmpList[ss.x] = filterTopSource.length
    });
    TownCount.push({x: TownList[s], y: filterDataSource.length, icds: tmpList})
  });

  const result = {
    code: 10000,
    result: TownCount,
  };
  return res.json(result);
}

function getTimeDis(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  let dataSource = getAll(req, res, u);
  let filterDataSource = [];
  const TopList = getTop(req, res, u);
  let filterTopSource = [];

  const timeDis = [];

  let dateList = [];
  for (let i = new Date(st); i <= ed; i.setDate(i.getDate()+1)) {
    dateList.push(new Date(i))
  }

  let tmpT;
  let j;
  dateList.forEach(time =>{
    const tmpList = {};
    tmpT = new Date(time);
    j = new Date(tmpT);
    j = new Date(j.setDate(tmpT.getDate()+1));
    // console.log(time);
    filterDataSource = dataSource.filter(
      data => new Date(tmpT) <= data.clinicTime
        && data.clinicTime < new Date(j));
    TopList.forEach(sd =>{
      filterTopSource = filterDataSource.filter(
        data => data.icd10 === sd.x
      );
      tmpList[sd.x] = filterTopSource.length
    });
    timeDis.push({x: time, y: filterDataSource.length, icds: tmpList})
  });

  const result = {
    code: 10000,
    result: timeDis,
  };
  return res.json(result);
}

function returnTop(req, res, u) {
  const result = {
    code: 10000,
    result: getTop(req, res, u)
  };
  return res.json(result)
}

function returnAll(req, res, u) {
  const result = {
    code: 10000,
    result: getAll(req, res, u)
  };
  return res.json(result)
}


function getIcdList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  let icdListSource = icdList;

  if (params.q) {
    const q = params.q;
    icdListSource = icdListSource.filter(
      data => data.id.indexOf(q) > -1 || data.text.indexOf(q) > -1 ||
        data.inputcode1.indexOf(q) > -1 || data.inputcode2.indexOf(q) > -1 )
  }

  const result = {
    code: 10000,
    result: icdListSource,
  };
  return res.json(result);

}


export default {
  'GET /api/v1/health_eye/data/all': returnAll,
  'GET /api/v1/health_eye/data/top': returnTop,
  'GET /api/v1/health_eye/data/age_dis': getAgeDis,
  'GET /api/v1/health_eye/data/occ_dis': getOccDis,
  'GET /api/v1/health_eye/data/gender_dis': getGenDis,
  'GET /api/v1/health_eye/data/ins_dis': getInsDis,
  'GET /api/v1/health_eye/data/org_dis': getOrgDis,
  'GET /api/v1/health_eye/data/time_dis': getTimeDis,
  'GET /api/v1/health_eye/data/town_dis': getTownDis,
  'GET /api/v1/health_eye/data/icd_list': getIcdList,
  'GET /api/v1/health_eye/config/age_group': getAgeGroup,
  'POST /api/v1/health_eye/config/age_group': postAgeGroup,
}
