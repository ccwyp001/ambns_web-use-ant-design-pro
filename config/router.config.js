export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      // { path: '/user/register', name: 'register', component: './User/Register' },
      // {
      //   path: '/user/register-result',
      //   name: 'register.result',
      //   component: './User/RegisterResult',
      // },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/list/ambul-manage' },

      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/ambul-manage',
            name: 'ambulmanage',
            component: './List/NewAmbulManage',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
