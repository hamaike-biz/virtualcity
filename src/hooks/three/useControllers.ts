import React, {useEffect} from 'react';
import SceneStore from '../../stores/sceneStore';
import {handleKeyDown, handleKeyUp} from '../../threeFuncs/eventCallBacks';

const useControllers = (sceneStore: SceneStore) => {
  useEffect(() => {
    window.addEventListener('keydown', e => handleKeyDown(e, sceneStore));
    window.addEventListener('keyup', e => handleKeyUp(e, sceneStore));
  }, []);
};

export default useControllers;
