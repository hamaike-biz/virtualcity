const getEndpoints = () => {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case 'local':
      return ['http://127.0.0.1:8000/', 'http://127.0.0.1'];
    case 'prd':
      return [
        'https://v-expo-backend-dot-v-expo-pj.an.r.appspot.com/',
        'https://user-sync-go2cjf6jua-an.a.run.app'
      ];
    case 'stg':
      return [
        'https://v-expo-backend-dot-v-expo-stg.an.r.appspot.com/',
        'https://user-sync-hrqpvmnz3q-an.a.run.app'
      ];
    default:
      return ['http://127.0.0.1:8000/', 'http://127.0.0.1'];
  }
};

const [apiOrigin, userSyncHost] = getEndpoints();
export let API_ORIGIN = apiOrigin;
export let USER_SYNC_HOST = userSyncHost;
