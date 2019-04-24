import fetch from 'dva/fetch';
import { notification } from 'antd';
import router from 'umi/router';
import { isAntdPro } from './utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function parseJSON(response){
  return response.json()
}

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

let isRefreshing = true;
let subscribers = [];

function addSubscriber(callback) {
  subscribers.push(callback)
}
function onAccessTokenFetched() {
  subscribers.forEach((callback)=>{
    callback();
  });
  subscribers = [];
}

function refreshTokenRequst(){
  const Authorization = `Ambulance ${sessionStorage.getItem('refresh_token')}`;
  const defaultOptions = {
    credentials: 'include',
    headers: {Authorization},
    method:'POST',
  };
  const newOptions = { ...defaultOptions };
  newOptions.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    ...newOptions.headers,
  };

  fetch('/api/v1/user/token', newOptions)
    .then(checkStatus)
    .then(response => parseJSON(response))
    .then((data) => {
      return data.result; })
    .then((data) => {
      sessionStorage.setItem('access_token', data.access_token || '');
      sessionStorage.setItem('refresh_token', data.refresh_token || '');
      onAccessTokenFetched();
      isRefreshing = true;
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      // if (status <= 504 && status >= 500) {
      //   router.push('/exception/500');
      //   return;
      // }
      // if (status >= 404 && status < 422) {
      //   router.push('/exception/404');
      // }
    });
}



// request for login and refresh token
export function loginRequest(url, option) {
  const options = {
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const Authorization = `Ambulance ${sessionStorage.getItem('refresh_token')}`;
  const defaultOptions = {
    credentials: 'include',
    headers: {Authorization},
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  // fetch only for login
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => parseJSON(response))
    .then((data) => {
      return data.result; })
    .then((data) => {
      sessionStorage.setItem('access_token', data.access_token || '');
      sessionStorage.setItem('refresh_token', data.refresh_token || '');
      sessionStorage.setItem('access_token:timestamp', Date.now());
      return data;
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      // if (status <= 504 && status >= 500) {
      //   router.push('/exception/500');
      //   return;
      // }
      // if (status >= 404 && status < 422) {
      //   router.push('/exception/404');
      // }
    });
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    expirys: isAntdPro(),
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */

  const tokenExpirys = 50 * 60;
  const reToken = sessionStorage.getItem('refresh_token');
  const acTokenAge = sessionStorage.getItem('access_token:timestamp');
  let accessToken = '';
  if (acTokenAge !== null && reToken !== null) {
    const age = (Date.now() - acTokenAge) / 1000;
    if (age < tokenExpirys) {
      // @HACK
      /* eslint-disable no-underscore-dangle */
      // window.g_app._store.dispatch({
      //   type: 'login/reToken',
      // });

    }
  }

  const Authorization = `Ambulance ${accessToken||sessionStorage.getItem('access_token')}`;
  const defaultOptions = {
    credentials: 'include',
    headers: {Authorization},
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }


  return fetch(url, newOptions)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      if (response.status === 401) {
        if(isRefreshing){
          refreshTokenRequst()
        }
        isRefreshing = false;
        const retryOriginalRequest = new Promise((resolve) => {
          addSubscriber(()=> {
            newOptions.headers.Authorization = `Ambulance ${sessionStorage.getItem('access_token')}`;
            resolve(request(url, newOptions))
          })
        });
        return retryOriginalRequest;
      }

      const errortext = codeMessage[response.status] || response.statusText;
      notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: errortext,
      });
      const error = new Error(errortext);
      error.name = response.status;
      error.response = response;
      throw error;
    })
    .then(response => parseJSON(response))
    .then((data) => {
      return data.result; })
    .catch(e => {
      const status = e.name;
      if (status > 400) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
    });
}


