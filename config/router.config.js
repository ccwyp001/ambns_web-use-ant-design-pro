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
      { path: '/', redirect: '/health_eye/map' },
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
            component: './HealthEye/EyeConfig/Info',
            routes: [
              {
                path: '/health_eye/config',
                redirect: '/health_eye/config/sources',
              },
              // {
              //   path: '/health_eye/config/base',
              //   component: './HealthEye/EyeConfig/BaseView',
              // },
              {
                path: '/health_eye/config/sources',
                component: './HealthEye/EyeConfig/DataSource',
              },
              {
                path: '/health_eye/config/agesplit',
                component: './HealthEye/EyeConfig/AgeSplit',
              },
              {
                path: '/health_eye/config/translation',
                component: './HealthEye/EyeConfig/TranslationSame',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
