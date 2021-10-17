import {Raycaster, Mesh} from 'three';
import SceneStore from '../stores/sceneStore';
import {ActiveKeyStateValues} from '../stores/models';

const MOVE_SPEED = 6;
const ROTATE_SPEED = 2;

interface BlockedInfoState {
  isForwardBlocked: boolean;
  isBackBlocked: boolean;
}

export const mainLoop = (
  sceneStore: SceneStore,
  delta: number,
  raycaster: Raycaster
) => {
  const {camera, cameraParent, lookAtTarget} = sceneStore.getCameras();
  if (!camera || !cameraParent || !lookAtTarget) return;

  const dummyBlockedInfo = {
    isForwardBlocked: false,
    isBackBlocked: false
  };

  moveCamera(sceneStore, cameraParent, delta, dummyBlockedInfo);
};

const moveCamera = (
  sceneStore: SceneStore,
  cameraParent: Mesh,
  delta: number,
  blockedInfo: BlockedInfoState
) => {
  usingKeyboard(sceneStore.event, cameraParent, delta, blockedInfo);
};

const usingKeyboard = (
  event: ActiveKeyStateValues,
  cameraParent: Mesh,
  delta: number,
  blockedInfo: BlockedInfoState
) => {
  if (event.ArrowUp && !blockedInfo.isForwardBlocked) {
    cameraParent.translateZ(MOVE_SPEED * delta);
  }
  if (event.ArrowDown && !blockedInfo.isBackBlocked) {
    cameraParent.translateZ(-MOVE_SPEED * delta);
  }
  if (event.ArrowLeft) {
    cameraParent.rotateY(ROTATE_SPEED * delta);
  }
  if (event.ArrowRight) {
    cameraParent.rotateY(-ROTATE_SPEED * delta);
  }
};
