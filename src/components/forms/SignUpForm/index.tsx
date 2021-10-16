import React from 'react';
import {useRouter} from 'next/router';
import {Form, Field} from 'react-final-form';
import TextFieldAdapter from '../fields/TextFieldAdapter';
import Button from '@mui/material/Button';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';

const required = (value: any) => (value ? undefined : 'Required');

interface SignUpFormProps {
  onSubmit: (values: any) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({onSubmit}) => {
  const router = useRouter();

  return (
    <Form initialValues={{}} onSubmit={onSubmit}>
      {({handleSubmit, pristine, form, values, submitting}) => (
        <form onSubmit={handleSubmit}>
          <div>
            <Field
              name="email"
              variant="outlined"
              component={TextFieldAdapter}
              validate={required}
              label={'Eメール'}
            />
          </div>
          <div>
            <Field
              name="password"
              variant="outlined"
              component={TextFieldAdapter}
              validate={required}
              label={'パスワード'}
            />
          </div>
          <div>
            <Button variant="contained" type={'submit'} disabled={submitting}>
              Hello World
            </Button>
            <Button
              variant="contained"
              type={'submit'}
              disabled={pristine || submitting}
              onClick={form.reset}
            >
              Clear Values
            </Button>
          </div>
        </form>
      )}
    </Form>
  );
};

export default SignUpForm;
