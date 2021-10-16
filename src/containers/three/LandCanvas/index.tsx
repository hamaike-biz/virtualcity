import React, {useRef, useState, useEffect, FC, MouseEventHandler} from 'react';
import {useDispatch} from 'react-redux';
import {requestPurchaseLand} from '../../../actions/land/action';
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
import {
  PerspectiveCamera,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  Mesh,
  Color,
  BufferGeometry,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  Shape,
  ShapeGeometry,
  ExtrudeGeometry,
  Line,
  Vector3,
  Points,
  Float32BufferAttribute,
  BoxGeometry,
  Vector2,
  MeshPhongMaterial,
  WireframeGeometry
} from 'three';
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
import styles from './index.module.scss';
import Button from '@mui/material/Button';

interface PlaneProps {
  sceneStore: SceneStore;
}

const CellSelector: FC<PlaneProps> = ({sceneStore}) => {
  const {camera, raycaster, scene, mouse} = useThree();

  useEffect(() => {
    document.addEventListener('pointerdown', onPointerDown);
  }, []);

  const onPointerDown = (e: PointerEvent) => {
    const mouse = getMouseVector(e);
    const planes = sceneStore.getMainPlanes();
    raycaster.setFromCamera(mouse, sceneStore.mainCamera);
    const intersects = raycaster.intersectObjects(planes, false);
    if (intersects.length > 0 && !sceneStore.isMouseOverUi) {
      const intersect = intersects[0];
      console.log(intersects);

      if (
        intersect.object !== sceneStore.mainPlane &&
        intersect.object instanceof Mesh
      ) {
        scene.remove(intersect.object);
        planes.splice(planes.indexOf(intersect.object), 1);
      } else if (intersect.face) {
        console.log('intersect.point', intersect.point);
        const mats = getPlacingPlaneMaterials();
        const voxel = new Mesh(mats.geometry, mats.material);
        voxel.position.copy(intersect.point).add(intersect.face.normal);
        voxel.position.divideScalar(1).floor().multiplyScalar(1).addScalar(0.5);
        voxel.position.y = 0.001;
        scene.add(voxel);
        sceneStore.addMainPlane(voxel);
      }
    }
  };

  useEffect(() => {
    const rollOverMesh = getRollOverMesh();
    sceneStore.rollOverMesh = rollOverMesh;
    const plane = getPlane();
    sceneStore.mainPlane = plane;
    sceneStore.addMainPlane(plane);
    // scene add
    scene.add(rollOverMesh);
    scene.add(plane);
  }, []);

  useFrame((state, delta) => {
    sceneStore.mouse = state.mouse;
    const planes = sceneStore.getMainPlanes();
    raycaster.setFromCamera(state.mouse, camera);
    const rollOverMesh = sceneStore.rollOverMesh;
    if (planes.length > 0 && rollOverMesh) {
      const intersects = raycaster.intersectObjects(planes, false);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        if (intersect.face) {
          rollOverMesh.position
            .copy(intersect.point)
            .add(intersect.face.normal);

          rollOverMesh.position
            .divideScalar(1)
            .floor()
            .multiplyScalar(1)
            .addScalar(0.5);

          rollOverMesh.position.y = 0;
        }
      }
    }
  });

  return <></>;
};

const Camera = ({sceneStore}: {sceneStore: SceneStore}) => {
  const {camera, raycaster, scene, set} = useThree();

  useEffect(() => {
    const mainCamera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.3,
      1000
    );
    mainCamera.position.set(10, 17.5, 30);
    set({camera: mainCamera});
    sceneStore.mainCamera = mainCamera;
  }, []);

  return <></>;
};

const BuildingGenerator = () => {
  // 複数のジオメトリから簡素な家を生成する機能
  const {camera, raycaster, scene, set} = useThree();

  useEffect(() => {
    const planeGeos = [];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const geometry = new PlaneGeometry(1, 1);
        geometry.rotateX(-Math.PI / 2);
        geometry.translate(i + 0.5, 0, j + 0.5);
        planeGeos.push(geometry);
      }
    }

    const geometry2 = BufferGeometryUtils.mergeBufferGeometries(planeGeos);
    // 外側の頂点達を抽出してくれる
    const edges = new EdgesGeometry(geometry2);

    let countArray: any[] = [];
    const strVec2List: string[] = [];

    const basePositionArray: Float32Array = edges.attributes.position
      .array as Float32Array;

    basePositionArray.forEach((item, index) => {
      countArray.push(item);
      if (countArray.length === 3) {
        strVec2List.push(`${countArray[0]}?${countArray[2]}`);
        countArray = [];
      }
    });

    // 重複頂点を削除
    const removedStrVec2List = Array.from(new Set(strVec2List));
    const removedVec2List = removedStrVec2List.map(item => {
      const [x, y] = item.split('?');
      return new Vector2(Number(x), Number(y));
    });

    console.log(removedVec2List);

    const resultPath = makeShapePath(removedVec2List);
    console.log(resultPath);
    const shapePath = makeShape(resultPath);
    if (shapePath) {
      const extrudeSettings = {depth: 8, bevelEnabled: false};

      const geometry = new ExtrudeGeometry(shapePath, extrudeSettings);

      const shapeMesh = new Mesh(
        geometry,
        new MeshPhongMaterial({color: new Color('#00ffb3'), side: DoubleSide})
      );
      shapeMesh.rotateX(-Math.PI / 2);
      scene.add(shapeMesh);
    }

    const line = new LineSegments(
      edges,
      new LineBasicMaterial({color: new Color('#ff0000')})
    );

    scene.add(line);
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

const LandCanvas = () => {
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
        <OrbitControls />
        <fog attach="fog" args={['white', 20, 50]} />
        <CellSelector sceneStore={sceneStoreRef.current} />
        <Camera sceneStore={sceneStoreRef.current} />
        {/*<BuildingGenerator />*/}
      </Canvas>
      <Stats showPanel={0} className="stats" />
      <UserInterface sceneStore={sceneStoreRef.current} />
    </div>
  );
};

interface UserInterfaceProps {
  sceneStore: SceneStore;
}

const UserInterface: FC<UserInterfaceProps> = ({sceneStore}) => {
  const dispatch = useDispatch();

  const handleOnClick = (e: any) => {
    e.stopPropagation();
    const cells = sceneStore.mainPlanes.filter((mesh, index) => {
      return mesh.name !== 'mainPlane';
    });
    const normalizedCells = cells.map((mesh, index) => {
      return {x: Math.ceil(mesh.position.x), z: Math.ceil(mesh.position.z)};
    });
    console.log(cells);
    console.log(normalizedCells);
    if (normalizedCells.length > 0) {
      const first = normalizedCells[0];
      let zoneX = 0;
      let zoneZ = 0;
      if (first.x >= 0) {
        zoneX = Math.ceil(first.x / 50);
      } else {
        zoneX = Math.floor(first.x / 50);
      }
      if (first.z >= 0) {
        zoneZ = Math.ceil(first.z / 50);
      } else {
        zoneZ = Math.floor(first.z / 50);
      }
      // const zoneX = Math.ceil(first.x / 50);
      // const zoneZ = Math.ceil(first.z / 50);
      console.log(zoneX, zoneZ);
      dispatch(
        requestPurchaseLand({
          positions: normalizedCells,
          zone: `${zoneX},${zoneZ}`
        })
      );
    }
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
        購入
      </Button>
    </div>
  );
};

export default LandCanvas;
