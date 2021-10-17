import React, {FC, useRef, useEffect, Fragment, MutableRefObject} from 'react';
import {
  useThree,
  useFrame,
  PerspectiveCameraProps,
  addAfterEffect,
  addEffect
} from '@react-three/fiber';
import {PerspectiveCamera, Mesh, Vector3, Object3D, Group} from 'three';
import SceneStore from '../../../stores/sceneStore';
import {mainLoop} from '../../../threeFuncs/loops';
import useControllers from '../../../hooks/three/useControllers';

interface MainCameraProps {
  sceneStore: SceneStore;
  initialPos?: [x: number, y: number, z: number];
  initialRot?: [x: number, y: number, z: number];
}

const INITIAL_Y_ROTATION = Math.PI;
const INITIAL_Y_POSITION = 1;

const MainCamera: FC<MainCameraProps & PerspectiveCameraProps> = ({
  sceneStore,
  initialPos = [0, INITIAL_Y_POSITION, 0],
  initialRot = [0, INITIAL_Y_ROTATION, 0],
  ...props
}) => {
  const cameraRef = useRef<PerspectiveCamera>();
  const parentRef = useRef<Mesh>();
  const lookAtTargetRef = useRef<Mesh>();
  const {set, scene, invalidate, clock, gl, camera, raycaster} = useThree();

  useControllers(sceneStore);

  useEffect(() => {
    if (cameraRef.current && parentRef.current && lookAtTargetRef.current) {
      set({camera: cameraRef.current});

      sceneStore.setCameras(
        cameraRef.current,
        parentRef.current,
        lookAtTargetRef.current
      );
    }
  }, [cameraRef, parentRef]);

  // const onUpdateCamera = (newCamera: any) => {
  //   if (cameraRef.current && parentRef.current && lookAtTargetRef.current) {
  //     const currentCamerasPos = sceneStore.getCurrentCamerasPos();
  //
  //     if (cameraRef.current.uuid !== newCamera.uuid) {
  //       set({camera: newCamera});
  //       newCamera.position.copy(currentCamerasPos.camera);
  //       newCamera.lookAt(lookAtTargetRef.current.position);
  //
  //       sceneStore.setCameras(
  //         newCamera,
  //         parentRef.current,
  //         lookAtTargetRef.current
  //       );
  //     }
  //   }
  // };

  const nearCamera = 0.7;
  const farCamera = 100;

  return (
    <Fragment>
      <mesh
        name={'MainCameraParent'}
        ref={parentRef}
        position={initialPos}
        rotation={initialRot}
      >
        <boxBufferGeometry args={[0, 0, 0]} />
        <meshStandardMaterial color={'orange'} />
        <perspectiveCamera
          name={'MainCamera'}
          ref={cameraRef}
          position={[0, 0, 0]}
          rotation={[0, INITIAL_Y_ROTATION, 0]}
          args={[
            45,
            window.innerWidth / window.innerHeight,
            nearCamera,
            farCamera
          ]}
          // onUpdate={onUpdateCamera}
          {...props}
        />
        <mesh
          name={'lookAtTarget'}
          ref={lookAtTargetRef}
          position={[0, 0, 0]}
          rotation={[0, INITIAL_Y_ROTATION, 0]}
        >
          <boxBufferGeometry args={[0, 0, 0]} />
          <meshStandardMaterial color={'blue'} />
        </mesh>
      </mesh>
    </Fragment>
  );
};

export default MainCamera;
