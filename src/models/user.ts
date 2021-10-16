import user from '../reducer/user';
import firebase from 'firebase/compat';
import User = firebase.User;

export interface UserState {
  me: undefined;
  user: undefined | User;
}
