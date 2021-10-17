import store from 'store';
import {ZONE_SPLIT_STR} from '../constants/three';

const CURRENT_ZONE = 'currentZone';

export const getCurrentZone = () => {
  const currentZone = store.get(CURRENT_ZONE);
  if (currentZone) {
    return currentZone;
  } else {
    const initialZone = `1${ZONE_SPLIT_STR}1`;
    setCurrentZone(initialZone);
    return initialZone;
  }
};

export const setCurrentZone = (area: string) => {
  store.set(CURRENT_ZONE, area);
};
