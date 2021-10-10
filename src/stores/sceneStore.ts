import {
  Mesh,
  Vector2,
  Color,
  Material,
  MeshBasicMaterial,
  Line,
  PerspectiveCamera
} from 'three';

class SceneStore {
  mainPlane: Mesh | undefined;
  mainPlanes: Mesh[];
  rollOverMesh: Mesh | undefined;
  frameCount: number;
  mouse: Vector2;
  mainCamera: PerspectiveCamera;

  constructor() {
    this.mainPlanes = [];
    this.frameCount = 0;
    this.mouse = new Vector2();
    this.mainCamera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.3,
      1000
    );
  }

  addMainPlane = (plane: Mesh) => {
    this.mainPlanes.push(plane);
  };
  getMainPlanes = () => {
    return this.mainPlanes;
  };

  incrementFrameCount = () => {
    this.frameCount++;
  };
  getFrameCount = () => {
    return this.frameCount;
  };

  getMouse = () => {
    return this.mouse;
  };
}

export default SceneStore;
