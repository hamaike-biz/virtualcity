import {Scene, Group} from 'three';

export interface ActiveKeyStateValues {
  ArrowUp: boolean;
  ArrowRight: boolean;
  ArrowLeft: boolean;
  ArrowDown: boolean;

  [key: string]: boolean;
}

export interface BuildingsGLTF {
  [key: string]: Group;
}
