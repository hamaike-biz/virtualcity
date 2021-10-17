import React from 'react';
import dynamic from 'next/dynamic';
import Authenticator from '../../components/Authenticator';
const PlayCanvas = dynamic(import('../../containers/three/PlayCanvas'), {
  ssr: false
});

const PlayPage = () => {
  return (
    <Authenticator>
      <PlayCanvas />
    </Authenticator>
  );
};

export default PlayPage;
