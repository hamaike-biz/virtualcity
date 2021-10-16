import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {requestMe} from '../../actions/user/action';
import Authenticator from '../../components/Authenticator';
import MyPageContainer from '../../containers/MyPageContainer';

const MyPage = () => {
  return (
    <Authenticator>
      <MyPageContainer />
    </Authenticator>
  );
};

export default MyPage;
