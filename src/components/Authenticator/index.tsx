import React, {FC, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '../../configs/firebaseConfig';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {setUser} from '../../actions/user/action';
import {RootState} from '../../app/store';

const Authenticator: FC = ({children}) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.user);

  useEffect(() => {
    initializeApp(firebaseConfig);
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log('auth!!');
        dispatch(setUser(user));
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
      } else {
        console.log('ないよ！！');
      }
    });
  }, []);

  if (!user) return <></>;

  return <>{children}</>;
};

export default Authenticator;
