import React, {useEffect, useState} from 'react';
import {Provider, useDispatch} from 'react-redux';
import type {AppProps} from 'next/app';
import {FirebaseApp, initializeApp} from 'firebase/app';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {firebaseConfig} from '../configs/firebaseConfig';
import '../../styles/globals.css';
import {store} from '../app/store';
import {setUser} from '../actions/user/action';

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
