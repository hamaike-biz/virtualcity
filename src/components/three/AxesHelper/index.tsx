import React, {useEffect} from 'react';
import {AxesHelper} from 'three';
import {useThree} from '@react-three/fiber';

const AxesHelperComponent = () => {
  const {scene} = useThree();

  useEffect(() => {
    const axesHelper = new AxesHelper(5);
    scene.add(axesHelper);
  }, []);

  return <></>;
};

export default AxesHelperComponent;
