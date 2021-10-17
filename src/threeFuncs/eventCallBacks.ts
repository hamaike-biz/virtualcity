import SceneStore from '../stores/sceneStore';

const HANDLE_TARGET_KEYS = ['ArrowUp', 'ArrowRight', 'ArrowLeft', 'ArrowDown'];

export const handleKeyDown = (e: KeyboardEvent, sceneStore: SceneStore) => {
  if (HANDLE_TARGET_KEYS.includes(e.key)) {
    if (!sceneStore.event[e.key]) {
      sceneStore.event[e.key] = true;
    }
  }
};

export const handleKeyUp = (e: KeyboardEvent, sceneStore: SceneStore) => {
  if (HANDLE_TARGET_KEYS.includes(e.key)) {
    sceneStore.event[e.key] = false;
  }
};
