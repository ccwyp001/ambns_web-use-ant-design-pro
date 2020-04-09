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
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/new-dashboard',
            name: 'new-dashboard',
            component: './Dashboard/NewDashboard',
          },
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/map-view',
            name: 'map-view',
            component: './Dashboard/MapView123',
          },
        ],
      },
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
          {
            path: '/list/ambul-detail/:lsh/:clid',
            name: 'amb_outd_detail',
            hideInMenu: true,
            component: './Profile/NewAmbulDetail',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
