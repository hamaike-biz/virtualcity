import React, {useEffect, SetStateAction, Dispatch} from 'react';
import path from 'path';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';

import SceneStore from '../../stores/sceneStore';
import {BUILDINGS} from '../../constants/urls';

const useBuildings = (
  sceneStore: SceneStore,
  setLoadedBuildings: Dispatch<SetStateAction<boolean>>
) => {
  useEffect(() => {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    BUILDINGS.forEach((pathName, index) => {
      gltfLoader.load(
        pathName,
        gltf => {
          const name = path.basename(pathName);
          const extension = path.extname(pathName);
          const fileName = path.basename(name, extension);
          // const fileName = path.basename(pathName);
          console.log(fileName);
          console.log(gltf);
          sceneStore.setBuildingGLTF(fileName, gltf.scene);
          // sceneStore.setVisitorAvatarGltf(gltf.scene);
          // setLoadedVisitorAvatar(true);
          setLoadedBuildings(true);
        },
        progress => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`${percent} %`);
        },
        e => {
          console.log(e.message);
          console.error('Draco Loader でもロードできませんでした');
        }
      );
    });
  }, []);
};

export default useBuildings;
