import store from 'store';
import {API_ORIGIN} from '../../configs/endpoints';
import {getAuth} from 'firebase/auth';

const fetchPostJson = (apiName: string, payload: any, useToken = true) => {
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
          return postMain(apiName, headers, payload);
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
    return postMain(apiName, headers, payload);
  }
};

const postMain = (apiName: string, headers: HeadersInit, payload: any) => {
  return fetch(`${API_ORIGIN}${apiName}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: headers
  })
    .then(response => {
      if (response.status === 204) {
        return {status: response.status, json: 'json'};
      } else {
        return response
          .json()
          .catch(error => {
            return {status: response.status, json: 'no content'};
          })
          .then(json => ({
            status: response.status,
            json: json
          }));
      }
    })
    .then(({status, json}) => {
      return responseHandler(status, json);
    })
    .catch(err => {
      return responseHandler(400, err);
    });
};

const responseHandler = (status: number, data: object) => {
  console.log(data, status);
  return {data, status};
};

export default fetchPostJson;
