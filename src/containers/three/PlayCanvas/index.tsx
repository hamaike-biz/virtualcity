import React, {useRef, useState, useEffect, FC, MouseEventHandler} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  requestPurchaseLand,
  requestZonePositions
} from '../../../actions/land/action';
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
import {Shape, Vector3, Vector2} from 'three';
import SceneStore from '../../../stores/sceneStore';
import {
  getMouseVector,
  getPlacingPlaneMaterials,
  getPlane,
  getRollOverMesh,
  handleMouseMove
} from '../../../utils/three/threeFuncs';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {SimplifyModifier} from 'three/examples/jsm/modifiers/SimplifyModifier.js';
import styles from '../canvas.module.scss';
import Button from '@mui/material/Button';
import MainCamera from '../../../components/three/MainCamera';
import {
  getCurrentZone,
  setCurrentZone
} from '../../../utils/localStorageManager';
import {getZoneFromPos, makePosFromArea} from '../../../threeFuncs/area';
import {Detail, RootState} from '../../../models';
import AxesHelperComponent from '../../../components/three/AxesHelper';
import {
  getBuildingMeshFromShape,
  getMergedGeometry,
  getShapePathFromEdge
} from '../../../threeFuncs/land';
import {mainLoop} from '../../../threeFuncs/loops';
import {ZONE_SPLIT_STR} from '../../../constants/three';
import {useStore} from '../../../stores/three/play';

interface BuildingGeneratorProps {
  positions: Detail[];
}

const BuildingGenerator: FC<BuildingGeneratorProps> = ({positions}) => {
  // 複数のジオメトリから簡素な家を生成する機能
  const {camera, raycaster, scene, set} = useThree();

  console.log(positions);

  useEffect(() => {
    positions.forEach(item => {
      const mergedGeometry = getMergedGeometry(item);
      const vec2ListForShape = getShapePathFromEdge(mergedGeometry);
      const shapePath = makeShapePath(vec2ListForShape);
      const shape = makeShape(shapePath);
      if (shape) {
        const buildingMesh = getBuildingMeshFromShape(shape);
        scene.add(buildingMesh);
      }
    });
  }, []);

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
  const {positions} = useSelector((state: RootState) => state.land);
  const [spawnPoint, setSpawnPoint] = useState<Vector3 | undefined>();

  useEffect(() => {
    const currentZone = getCurrentZone();
    setSpawnPoint(makePosFromArea({area: currentZone}));
    dispatch(requestZonePositions(currentZone));
  }, []);

  if (!positions || !spawnPoint) return <></>;

  return <PlayCanvas positions={positions} spawnPoint={spawnPoint} />;
};

interface PlayCanvasProps {
  positions: Detail[];
  spawnPoint: Vector3;
}

const PlayCanvas: FC<PlayCanvasProps> = ({positions, spawnPoint}) => {
  const sceneStoreRef = useRef<SceneStore>(new SceneStore());

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

  return (
    <div>
      <Canvas style={{position: 'absolute'}}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <gridHelper args={[100, 100]} />
        <MainCamera
          sceneStore={sceneStoreRef.current}
          initialPos={[spawnPoint.x, 1, spawnPoint.z]}
        />
        <fog attach="fog" args={['white', 20, 50]} />
        <BuildingGenerator positions={positions} />
        <AxesHelperComponent />
        <MainLoop sceneStore={sceneStoreRef.current} />
      </Canvas>
      <Stats showPanel={0} className="stats" />
      <UserInterface sceneStore={sceneStoreRef.current} />
    </div>
  );
};

interface MainLoopProps {
  sceneStore: SceneStore;
}

const MainLoop: FC<MainLoopProps> = ({sceneStore}) => {
  const setCurrentZoneToStore = useStore(state => state.setCurrentZone);
  const currentZone = useStore(state => state.currentZone);

  useEffect(() => {
    if (currentZone) {
      console.log('currentZone', currentZone);
      // dispatch(requestZonePositions(currentZone));
    }
  }, [currentZone]);

  useFrame((state, delta) => {
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

interface UserInterfaceProps {
  sceneStore: SceneStore;
}

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
