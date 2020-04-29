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
      { path: '/', redirect: '/dashboard/monitor' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
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
        ],
      },
      {
        path: '/health_eye',
        name: 'health_eye',
        icon: 'dashboard',
        routes: [
          {
            path: '/health_eye/map',
            name: 'map',
            component: './HealthEye/Map',
          },
          {
            path: '/health_eye/config',
            name: 'config',
            component: './HealthEye/EyeConfig',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
