import * as React from 'react';
import {useRouter} from 'next/router';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {Form, Field} from 'react-final-form';
import SignUpForm from '../../components/forms/SignUpForm';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const SignIn = () => {
  const router = useRouter();

  return (
    <div>
      <SignUpForm
        onSubmit={(values: any) => {
          const auth = getAuth();
          createUserWithEmailAndPassword(auth, values.email, values.password)
            .then(userCredential => {
              const user = userCredential.user;
              console.log(user);
              router.push(`/user/mypage`);
            })
            .catch(error => {
              const errorCode = error.code;
              const errorMessage = error.message;
            });
        }}
      />
    </div>
  );
};

export default SignIn;
