import * as React from 'react';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {Form, Field} from 'react-final-form';
import SignUpForm from '../../components/forms/SignUpForm';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const SignUp = () => {
  return (
    <div>
      <SignUpForm />
    </div>
  );
};

export default SignUp;
