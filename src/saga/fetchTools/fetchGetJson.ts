import store from 'store';
import {API_ORIGIN} from '../../configs/endpoints';
import {getAuth} from 'firebase/auth';

const fetchGetJson = (apiName: string, useToken = true) => {
  let headers = {};

  if (useToken) {
    const auth = getAuth();
    if (auth && auth.currentUser) {
      return auth.currentUser
        .getIdToken(/* forceRefresh */ true)
        .then(idToken => {
          headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          };
          return getMain(apiName, headers);
        })
        .catch(error => {
          return responseHandler(400, error);
        });
    } else {
      return responseHandler(400, {detail: 'トークンが取得できませんでした'});
    }
  } else {
    headers = {
      'Content-Type': 'application/json'
    };
    return getMain(apiName, headers);
  }
};

const getMain = (apiName: string, headers: HeadersInit) => {
  return fetch(`${API_ORIGIN}${apiName}`, {
    method: 'GET',
    headers: headers
  })
    .then(response => {
      if (response.status === 204) {
        return {status: response.status, json: 'json'};
      } else {
        return response.json().then(json => ({
          status: response.status,
          json: json
        }));
      }
    })
    .then(({status, json}) => {
      return responseHandler(status, json);
    })
    .catch(e => {
      return responseHandler(400, e);
    });
};

const responseHandler = (status: number, data: any) => {
  console.log(data, status);
  return {data, status};
};

export default fetchGetJson;
