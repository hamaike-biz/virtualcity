import React from 'react';
import dynamic from 'next/dynamic';
import Authenticator from '../../components/Authenticator';
const LandCanvas = dynamic(import('../../containers/three/LandCanvas'), {
  ssr: false
});

const LandShopPage = () => {
  return (
    <Authenticator>
      <LandCanvas />
    </Authenticator>
  );
};

export default LandShopPage;
