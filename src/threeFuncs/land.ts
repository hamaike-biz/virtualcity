import {
  EdgesGeometry,
  PlaneGeometry,
  Vector2,
  BufferGeometry,
  ExtrudeGeometry,
  Mesh,
  MeshPhongMaterial,
  Color,
  DoubleSide,
  Shape
} from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils';
import {Detail} from '../models';

export const getMergedGeometry = (detail: Detail) => {
  // セルをマージして１つの土地ジオメトリを作成する
  const planeGeos: PlaneGeometry[] = [];
  detail.positions.forEach(position => {
    const geometry = new PlaneGeometry(1, 1);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(position.x - 0.5, 0, -position.z - 0.5);
    planeGeos.push(geometry);
  });
  return BufferGeometryUtils.mergeBufferGeometries(planeGeos);
};

export const getShapePathFromEdge = (mergedGeometry: BufferGeometry) => {
  // 外側の頂点達を抽出
  const edges = new EdgesGeometry(mergedGeometry);
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
  // 外側の頂点達の中で重複している頂点を削除
  const removedStrVec2List = Array.from(new Set(strVec2List));
  return removedStrVec2List.map(item => {
    const [x, y] = item.split('?');
    return new Vector2(Number(x), Number(y));
  });
};

export const getBuildingMeshFromShape = (shape: Shape) => {
  const extrudeSettings = {depth: 3, bevelEnabled: false};
  const geometry = new ExtrudeGeometry(shape, extrudeSettings);
  const shapeMesh = new Mesh(
    geometry,
    new MeshPhongMaterial({color: new Color('#4c4c4c'), side: DoubleSide})
  );
  shapeMesh.rotateX(-Math.PI / 2);
  return shapeMesh;
};
