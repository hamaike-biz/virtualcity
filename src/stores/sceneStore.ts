import {
  Mesh,
  Vector2,
  Color,
  Material,
  MeshBasicMaterial,
  Line,
  PerspectiveCamera
} from 'three';
import {ActiveKeyStateValues} from './models';

class SceneStore {
  mainPlane: Mesh | undefined;
  mainPlanes: Mesh[];
  rollOverMesh: Mesh | undefined;
  frameCount: number;
  mouse: Vector2;
  mainCamera: PerspectiveCamera;
  isMouseOverUi: boolean;
  currentZone: string | undefined;

  // cameras
  private camera: PerspectiveCamera | undefined;
  private cameraParent: Mesh | undefined;
  private lookAtTarget: Mesh | undefined;
  event: ActiveKeyStateValues;

  // zone
  loadedZoneNames: string[];

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
    this.isMouseOverUi = false;
    this.event = {
      ArrowUp: false,
      ArrowRight: false,
      ArrowLeft: false,
      ArrowDown: false
    };
    this.loadedZoneNames = [];
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

  setCameras = (
    defaultCamera: PerspectiveCamera,
    cameraParent: Mesh,
    lookAtTarget: Mesh
  ) => {
    this.camera = defaultCamera;
    this.cameraParent = cameraParent;
    this.lookAtTarget = lookAtTarget;
  };

  getCameras = () => {
    return {
      camera: this.camera,
      cameraParent: this.cameraParent,
      lookAtTarget: this.lookAtTarget
    };
  };
}

export default SceneStore;
