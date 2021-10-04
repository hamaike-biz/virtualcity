import React from 'react';
import dynamic from 'next/dynamic';
const LandCanvas = dynamic(import('../../containers/three/LandCanvas'));

const LandShopPage = () => {
  return <LandCanvas />;
};

export default LandShopPage;
