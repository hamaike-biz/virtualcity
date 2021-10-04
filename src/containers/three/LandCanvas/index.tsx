import React, {useRef, useState} from 'react';
import * as THREE from 'three';
import {
  PerspectiveCamera,
  PositionalAudio,
  OrbitControls
} from '@react-three/drei';

import {Canvas, useThree, extend, useFrame} from '@react-three/fiber';

function Box(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (ref.current.rotation.x += 0.01));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={event => setActive(!active)}
      onPointerOver={event => setHover(true)}
      onPointerOut={event => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

const LandCanvas = () => {
  return (
    <div>
      <Canvas style={{position: 'absolute', width: '100%'}}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <gridHelper />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default LandCanvas;
