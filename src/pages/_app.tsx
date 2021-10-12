import React, {useEffect} from 'react';
import type {AppProps} from 'next/app';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '../configs/firebaseConfig';
import '../../styles/globals.css';
import {store} from '../app/store';
import {Provider} from 'react-redux';

function MyApp({Component, pageProps}: AppProps) {
  useEffect(() => {
    initializeApp(firebaseConfig);
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
export default MyApp;
