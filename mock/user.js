// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/v1/user/current': {
    code: 10000,
    result: {
      name: 'Small Big',
      // avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      // phone: '0752-268888888',
    }
  },

  'POST /api/v1/user/login': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === 'ant.design' && userName === 'admin') {
      res.send(
        {
          code: 10000,
          result: {
            status: 'ok',
            type,
            currentAuthority: 'admin',
            access_token: 'jhdkajshfajldjlaksjdlkjsaldkj',
            refresh_token: 'dlkajslkjxpcpiqjwdkjaslkfj;xzcoipaisf',
          }
        });
      return;
    }
    res.send({
      code: 44444,
      result: {
      status: 'error',
      type,
      currentAuthority: 'guest',
    }});
  },

  'POST /api/v1/user/token':(req, res) => {
    res.send({
      code: 10000,
      result: {
        access_token: `jhdkajshfajldjl123124124214aksjdlkjsaldkj${Math.floor(Math.random() * 10) % 10}`,
        refresh_token: 'dlkajslkj5325234141xpcpiqjwdkjaslkfj;xzcoipaisf',
      }
    })
  },

  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
