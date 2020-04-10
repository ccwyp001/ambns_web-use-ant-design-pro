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
      { path: '/', redirect: '/dashboard/map-view' },
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
        component: '404',
      },
    ],
  },
];
