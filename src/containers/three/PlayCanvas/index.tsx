import React, {useRef, useState, useEffect, FC, MouseEventHandler} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {OrbitControls, Stats} from '@react-three/drei';
import {
  Canvas,
  useThree,
  extend,
  useFrame,
  ThreeEvent,
  addEffect,
  addAfterEffect
} from '@react-three/fiber';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
  Shape,
  Vector3,
  Vector2,
  Box3,
  Object3D,
  TextureLoader,
  RepeatWrapping,
  Color
} from 'three';

// material-ui
import Button from '@mui/material/Button';

// components
import {
  requestPurchaseLand,
  requestZonePositions
} from '../../../actions/land/action';
import SceneStore from '../../../stores/sceneStore';
import styles from '../canvas.module.scss';
import MainCamera from '../../../components/three/MainCamera';
import {
  getCurrentZone,
  setCurrentZone
} from '../../../utils/localStorageManager';
import {getZoneFromPos, makePosFromArea} from '../../../threeFuncs/area';
import {Detail, RootState, ZonesState} from '../../../models';
import AxesHelperComponent from '../../../components/three/AxesHelper';
import {
  getBuildingMeshFromShape,
  getMergedGeometry,
  getShapePathFromEdge
} from '../../../threeFuncs/land';
import {mainLoop} from '../../../threeFuncs/loops';
import {ZONE_SPLIT_STR} from '../../../constants/three';
import {useStore} from '../../../stores/three/play';
import useBuildings from '../../../hooks/three/useBuildings';

interface BuildingGeneratorProps {
  zones: ZonesState;
  sceneStore: SceneStore;
}

interface PlayCanvasProps {
  zones: ZonesState;
  spawnPoint: Vector3;
}

interface UserInterfaceProps {
  sceneStore: SceneStore;
}

interface MainLoopProps {
  sceneStore: SceneStore;
  onEnterChangeZone: (currentZone: string) => void;
}

interface PostProcessingProps {
  sceneStore: SceneStore;
}

const BuildingGenerator: FC<BuildingGeneratorProps> = ({zones, sceneStore}) => {
  // 複数のジオメトリから簡素な家を生成する機能
  const {camera, raycaster, scene, set} = useThree();

  useEffect(() => {
    Object.keys(zones).forEach(zoneName => {
      if (sceneStore.loadedZoneNames.includes(zoneName)) {
        // pass
      } else {
        console.log('zones', zones);
        const zone = zones[zoneName];
        zone.forEach(item => {
          const mergedGeometry = getMergedGeometry(item);
          const vec2ListForShape = getShapePathFromEdge(mergedGeometry);
          const shapePath = makeShapePath(vec2ListForShape);
          const shape = makeShape(shapePath);
          if (shape) {
            const buildingMesh = getBuildingMeshFromShape(shape);
            buildingMesh.geometry.computeBoundingBox();
            if (buildingMesh.geometry.boundingBox) {
              const center = new Vector3();
              buildingMesh.geometry.boundingBox.getCenter(center);
              console.log('center', center);
              const baseBuilding = sceneStore.getBuildingGLTF('building__a');
              const clone = baseBuilding.clone();
              let cloneBox = new Box3().setFromObject(clone);
              let cloneSize = cloneBox.getSize(new Vector3());
              let buildingMeshSize = buildingMesh.geometry.boundingBox.getSize(
                new Vector3()
              );
              console.log('SIZE', cloneSize, buildingMeshSize);

              const ratioX = buildingMeshSize.x / cloneSize.x;
              const ratioZ = buildingMeshSize.y / cloneSize.y;

              let scale = 1;

              console.log('RATIO', ratioX, ratioZ);

              if (ratioX > ratioZ) {
                scale = ratioZ;
              } else {
                scale = ratioX;
              }
              console.log('SCALE', scale);
              clone.scale.set(scale, scale, scale);
              clone.position.set(center.x, 0, -center.y);
              scene.add(clone);
              console.log('### clone ###', clone);
            }
          }
        });
        sceneStore.loadedZoneNames.push(zoneName);
      }
    });
  }, [zones]);

  return <></>;
};

const makeShapePath = (vec2List: Vector2[]) => {
  // 外周を１直線になぞるパスを作成
  const first = vec2List[0];
  const resultPath: Vector2[] = [first];

  for (let i = 0; i < vec2List.length; i++) {
    for (let j = 0; j < vec2List.length; j++) {
      const dist = resultPath[i].distanceTo(vec2List[j]);
      if (dist === 1 && !resultPath.includes(vec2List[j])) {
        resultPath.push(vec2List[j]);
        break;
      }
    }
  }

  return resultPath;
};

const makeShape = (vec2List: Vector2[]) => {
  const first = vec2List.shift();
  if (first) {
    const squareShape = new Shape();
    squareShape.moveTo(first.x, first.y);
    vec2List.forEach((vec2, index) => {
      squareShape.lineTo(vec2.x, vec2.y);
    });
    squareShape.lineTo(first.x, first.y);
    return squareShape;
  }
  return undefined;
};

const Loader = () => {
  const dispatch = useDispatch();
  const {zones} = useSelector((state: RootState) => state.land);
  const [spawnPoint, setSpawnPoint] = useState<Vector3 | undefined>();

  useEffect(() => {
    const currentZone = getCurrentZone();
    setSpawnPoint(makePosFromArea({area: currentZone}));
    dispatch(requestZonePositions(currentZone));
  }, []);

  console.log(zones, spawnPoint);

  if (!zones || !spawnPoint) return <></>;

  return <PlayCanvas zones={zones} spawnPoint={spawnPoint} />;
};

const PostProcessing: FC<PostProcessingProps> = ({sceneStore}) => {
  const {gl, scene, camera, mouse, raycaster, events, size} = useThree();

  useEffect(() => {
    if (camera.name === 'MainCamera') {
      const composer = new EffectComposer(gl);
      composer.addPass(new RenderPass(scene, camera));
      const outlinePass = new OutlinePass(
        new Vector2(size.width, size.height),
        scene,
        camera
      );
      outlinePass.visibleEdgeColor = new Color('#4400ff');
      outlinePass.edgeStrength = 6.0;
      composer.addPass(outlinePass);
      const textureLoader = new TextureLoader();
      textureLoader.load('/textures/tri_pattern.jpeg', function (texture) {
        outlinePass.patternTexture = texture;
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
      });
      sceneStore.composer = composer;
      sceneStore.outlinePass = outlinePass;
    }
  }, [camera]);

  useEffect(() => {
    // 毎フレーム、レンダリングが完了した後に実行される。
    addAfterEffect(time => {
      if (sceneStore.composer && sceneStore.outlinePass) {
        sceneStore.composer.render();
      }
      return true;
    });
  }, []);

  return <></>;
};

const PlayCanvas: FC<PlayCanvasProps> = ({zones, spawnPoint}) => {
  const dispatch = useDispatch();
  const sceneStoreRef = useRef<SceneStore>(new SceneStore());
  const [isLoadedBuildings, setLoadedBuildings] = useState<boolean>(false);
  const ref = useRef<undefined | Object3D>();

  useEffect(() => {
    // 毎フレーム、レンダリングが始まる前に実行される。
    addEffect(time => {
      sceneStoreRef.current.incrementFrameCount();
      return true;
    });
    // 毎フレーム、レンダリングが完了した後に実行される。
    addAfterEffect(time => {
      return true;
    });
  }, []);

  useBuildings(sceneStoreRef.current, setLoadedBuildings);

  const onEnterChangeZone = (currentZone: string) => {
    if (sceneStoreRef.current.loadedZoneNames.includes(currentZone)) {
      console.info('このエリアは既に取得済です。');
    } else {
      dispatch(requestZonePositions(currentZone));
    }
  };

  if (!isLoadedBuildings || !ref) return <></>;

  return (
    <div
      onPointerMove={e => {
        sceneStoreRef.current.onPointerMove();
      }}
    >
      <Canvas style={{position: 'absolute'}}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <gridHelper args={[100, 100]} />
        <MainCamera
          sceneStore={sceneStoreRef.current}
          initialPos={[spawnPoint.x, 1, spawnPoint.z]}
        />
        <fog attach="fog" args={['white', 20, 50]} />
        <BuildingGenerator zones={zones} sceneStore={sceneStoreRef.current} />
        <AxesHelperComponent />
        <MainLoop
          sceneStore={sceneStoreRef.current}
          onEnterChangeZone={onEnterChangeZone}
        />
        <PostProcessing sceneStore={sceneStoreRef.current} />
      </Canvas>
      <Stats showPanel={0} className="stats" />
      <UserInterface sceneStore={sceneStoreRef.current} />
    </div>
  );
};

const MainLoop: FC<MainLoopProps> = ({sceneStore, onEnterChangeZone}) => {
  const {gl, scene, camera, mouse, raycaster, events, onPointerMissed, set} =
    useThree();
  console.log(mouse);
  const setCurrentZoneToStore = useStore(state => state.setCurrentZone);
  const currentZone = useStore(state => state.currentZone);

  useEffect(() => {
    if (currentZone) {
      onEnterChangeZone(currentZone);
    }
  }, [currentZone]);

  useFrame((state, delta) => {
    sceneStore.copyState(state);
    mainLoop(sceneStore, delta, state.raycaster);
    if (sceneStore.getFrameCount() % 60 === 0) {
      const {cameraParent} = sceneStore.getCameras();
      if (cameraParent) {
        const [zoneX, zoneZ] = getZoneFromPos(
          cameraParent.position.x,
          cameraParent.position.z
        );
        const zoneStr = `${zoneX}${ZONE_SPLIT_STR}${zoneZ}`;
        if (sceneStore.currentZone !== zoneStr) {
          setCurrentZone(`${zoneX}${ZONE_SPLIT_STR}${zoneZ}`);
          sceneStore.currentZone = zoneStr;
          setCurrentZoneToStore(zoneStr);
        }
      }
    }
  });

  return <></>;
};

const UserInterface: FC<UserInterfaceProps> = ({sceneStore}) => {
  const dispatch = useDispatch();

  const handleOnClick = (e: any) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.userInterfaceContainer}>
      <Button
        variant="contained"
        size="large"
        onClick={handleOnClick}
        onMouseOver={() => (sceneStore.isMouseOverUi = true)}
        onMouseLeave={() => (sceneStore.isMouseOverUi = false)}
      >
        テスト
      </Button>
    </div>
  );
};

export default Loader;
