import { parse } from 'url';

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

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: `201902270${padding(i, 5)}`,
    registered: Math.floor(Math.random() * 10) % 4 === 0 ? '': '1',
    // href: 'https://ant.design',
    fileList: [{
      uid: '-1',
      name: 'xxx.png',
      // status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
    lsh: `20190227331021${padding(i, 5)}`,
    clid: `60${padding(i, 2)}`,
    clmc: `浙J ${padding(i, 5)}`,
    desc: '这是一段描述',
    call_number: '0123456789012',
    call_reason: '常规急救-非创伤-恶心/呕吐/吞咽困难',
    accept_hospital: '一家市级医院',
    yymc: '我也不知道这是哪我也不知道这是哪不知道这是哪不知道这是哪不知道这是哪不知道这是哪',
    on_duty: getRandomArrayElements(['1', '2'], Math.floor(Math.random() * 10) % 3),
    real_out: new Date(`2019-03-${Math.floor(i / 2) + 1}`),
    cancel_reason: Math.floor(Math.random() * 10) % 4 === 0 ? '来电退车': 'None',
    tsqk: Math.floor(Math.random() * 10) % 4 === 0 ? '车到人走': 'None',
    status: Math.floor(Math.random() * 10) % 3,
    callAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    dispatchAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    departureAt: new Date(`2019-03-${Math.floor(i / 2) + 1}`),
    arrivedAt: new Date(`2019-03-${Math.floor(i / 2) + 1}`),
    boardedAt: new Date(`2019-03-${Math.floor(i / 2) + 1}`),
    finishAt: new Date(`2019-03-${Math.floor(i / 2) + 1}`),
    returnAt: new Date(`2019-03-${Math.floor(i / 2) + 1}`),
    nurse: 'nXXX',
    doctor: 'dXXX',
    driver: 'drXXX',
    dispatcher: '一二三四',
    station_id: Math.floor(Math.random() * 10) % 10,
    workwear: getRandomArrayElements(['1', '2', '4'], Math.floor(Math.random() * 10) % 3),
    work_cards: getRandomArrayElements(['1', '2'], Math.floor(Math.random() * 10) % 3),
    medical_warehouse: getRandomArrayElements(['1', '2'], Math.floor(Math.random() * 10) % 3),
    // createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    // progress: Math.ceil(Math.random() * 100),
  });
}

function getRule(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.station) {
    const s = params.station;
    dataSource = dataSource.filter(data => parseInt(data.station_id, 10) === parseInt(s, 10));
  }

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10)),
      );
    });
    dataSource = filterDataSource;
  }

  if (params.lsh) {
    dataSource = dataSource.filter(data => data.lsh.indexOf(params.lsh) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    code: 10000,
    result: {
      list: dataSource,
      pagination:
        {
          total: dataSource.length,
          pageSize,
          current:
            parseInt(params.currentPage, 10) || 1,
        }
      ,
    },
  };

  return res.json(result);
}

function postRule(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, clid, lsh, fileList } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.lsh === lsh && item.clid === clid) {
          Object.assign(item, { ...body });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  return getRule(req, res, u);
}

function postPicture(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const body = (b && b.body) || req.body;
  const result = {code:10000, result:{ id: Math.ceil(Math.random() * 100) }};
  return res.json(result);
}

function getRPstations(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const stations = [];
  for (let i = 0; i < 10; i += 1) {
    stations.push(
      {
        'key': i,
        'rp_name': `分站 ${padding(i, 2)}`,
      },
    );
  }
  const result = {code: 10000,result:stations};
  return res.json(result);

}


const advancedOperation1 = [
  {
    key: 'op1',
    type: '订购关系生效',
    name: '曲丽丽',
    status: 'agree',
    updatedAt: '2017-10-03  19:23:12',
    memo: '-',
  },
  {
    key: 'op2',
    type: '财务复审',
    name: '付小小',
    status: 'reject',
    updatedAt: '2017-10-03  19:23:12',
    memo: '不通过原因',
  },
  {
    key: 'op3',
    type: '部门初审',
    name: '周毛毛',
    status: 'agree',
    updatedAt: '2017-10-03  19:23:12',
    memo: '-',
  },
  {
    key: 'op4',
    type: '提交订单',
    name: '林东东',
    status: 'agree',
    updatedAt: '2017-10-03  19:23:12',
    memo: '很棒',
  },
  {
    key: 'op5',
    type: '创建订单',
    name: '汗牙牙',
    status: 'agree',
    updatedAt: '2017-10-03  19:23:12',
    memo: '-',
  },
];


function getDetail(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  let dataSource = tableListDataSource;
  dataSource = dataSource.filter(data => data.lsh.indexOf(params.lsh) > -1);
  dataSource = dataSource.filter(data => data.clid.indexOf(params.clid) > -1);

  const result = {code: 10000, result:{
      dispatchInfo: dataSource[0],
      advancedOperation1,
    }};
  return res.json(result)
}

export default {
  'GET /api/v1/ambul_manage': getRule,
  'POST /api/v1/ambul_manage': postRule,
  'POST /api/v1/ambul_manage/pic': postPicture,
  'GET /api/v1/ambul_manage/stations': getRPstations,
  'GET /api/v1/ambul_detail': getDetail,
};
