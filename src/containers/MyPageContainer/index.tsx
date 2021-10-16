import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {requestMe} from '../../actions/user/action';

const MyPageContainer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestMe());
  }, []);

  return (
    <div>
      <div>test</div>
    </div>
  );
};

export default MyPageContainer;
