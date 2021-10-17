import {
  Color,
  DoubleSide,
  ExtrudeGeometry,
  Mesh,
  MeshPhongMaterial,
  Shape,
  Vector2,
  Vector3,
  Box3Helper,
  Scene,
  Box3
} from 'three';
import {BASE_AREA_SIZE, ZONE_SPLIT_STR} from '../constants/three';

interface MakePosFromArea {
  area: string;
  scene?: Scene;
}

export const makePosFromArea = ({area, scene}: MakePosFromArea) => {
  const [x, z] = area.split(ZONE_SPLIT_STR);
  console.log(x, z);
  let a = Number(x) * BASE_AREA_SIZE;
  let b = Number(z) * BASE_AREA_SIZE;
  let pos1 = new Vector2(a - BASE_AREA_SIZE, b - BASE_AREA_SIZE);
  let pos2 = new Vector2(a - BASE_AREA_SIZE, b);
  let pos3 = new Vector2(a, b);
  let pos4 = new Vector2(a, b - BASE_AREA_SIZE);
  const squareShape = new Shape();
  squareShape.moveTo(pos1.x, pos1.y);
  squareShape.lineTo(pos2.x, pos2.y);
  squareShape.lineTo(pos3.x, pos3.y);
  squareShape.lineTo(pos4.x, pos4.y);
  squareShape.lineTo(pos1.x, pos1.y);
  const extrudeSettings = {depth: 8, bevelEnabled: false};
  const geometry = new ExtrudeGeometry(squareShape, extrudeSettings);
  const shapeMesh = new Mesh(
    geometry,
    new MeshPhongMaterial({color: new Color('#79009c'), side: DoubleSide})
  );
  shapeMesh.rotateX(-Math.PI / 2);
  shapeMesh.geometry.computeBoundingBox();
  const boundingBox = shapeMesh.geometry.boundingBox;
  if (boundingBox) {
    if (scene) {
      const box = new Box3();
      box.setFromObject(shapeMesh);
      const helper = new Box3Helper(box, new Color('#ff0000'));
      scene.add(helper);
    }
    const centerPos = new Vector3();
    boundingBox.getCenter(centerPos);
    const spawnPoint = new Vector3(centerPos.x, 0, centerPos.y);
    console.log(spawnPoint);
    return spawnPoint;
  } else {
    console.error('boundingBox の生成に失敗しました');
  }
};

export const getZoneFromPos = (x: number, z: number) => {
  let zoneX = 0;
  let zoneZ = 0;

  if (x >= 0) {
    zoneX = Math.ceil(x / BASE_AREA_SIZE);
  } else {
    zoneX = Math.floor(x / BASE_AREA_SIZE);
  }
  if (z >= 0) {
    zoneZ = Math.ceil(z / BASE_AREA_SIZE);
  } else {
    zoneZ = Math.floor(z / BASE_AREA_SIZE);
  }

  return [zoneX, zoneZ];
};
