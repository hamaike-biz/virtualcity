import {
  Mesh,
  Vector2,
  Color,
  Material,
  MeshBasicMaterial,
  Line,
  PerspectiveCamera,
  Scene,
  Group
} from 'three';
// @ts-ignore
import {OutlinePass} from 'postprocessing';
import {ActiveKeyStateValues, BuildingsGLTF} from './models';
import {RootState} from '@react-three/fiber';

class SceneStore {
  mainPlane: Mesh | undefined;
  mainPlanes: Mesh[];
  rollOverMesh: Mesh | undefined;
  frameCount: number;
  mouse: Vector2;
  mainCamera: PerspectiveCamera;
  isMouseOverUi: boolean;
  currentZone: string | undefined;
  rootState: RootState | undefined;

  // cameras
  private camera: PerspectiveCamera | undefined;
  private cameraParent: Mesh | undefined;
  private lookAtTarget: Mesh | undefined;
  event: ActiveKeyStateValues;

  // zone
  loadedZoneNames: string[];

  // models
  buildingsGLTF: BuildingsGLTF;

  // composer
  composer: any;
  outlinePass: OutlinePass | undefined;
  selectedObjects: any[];

  // pointers
  pointerDownPos: any;

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
    this.buildingsGLTF = {};
    this.composer = undefined;
    this.outlinePass = undefined;
    this.selectedObjects = [];
    this.pointerDownPos = undefined;
  }

  setPointerDownFixedPoint = (pos: any) => {
    this.pointerDownPos = pos;
  };

  getPointerDownFixedPoint = () => {
    return this.pointerDownPos;
  };

  setBuildingGLTF = (keyName: string, model: Group) => {
    this.buildingsGLTF[keyName] = model;
  };

  getBuildingGLTF = (keyName: string) => {
    return this.buildingsGLTF[keyName];
  };

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

  addSelectedObject(object: any) {
    this.selectedObjects = [];
    this.selectedObjects.push(object);
  }

  onPointerMove = () => {
    if (this.rootState) {
      const {raycaster, mouse, camera, scene} = this.rootState;
      console.log('onPointerMove', this.rootState);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(scene, true);
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        this.addSelectedObject(selectedObject);
        this.outlinePass.selectedObjects = this.selectedObjects;
        console.log(this.selectedObjects);
      } else {
        this.outlinePass.selectedObjects = [];
      }
    }
  };

  copyState = (rootState: RootState) => {
    this.rootState = rootState;
  };
}

export default SceneStore;
