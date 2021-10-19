interface PositionState {
  x: number;
  z: number;
}

export interface Detail {
  id: string;
  positions: PositionState[];
  zone: string;
}

export interface ZonesState {
  [key: string]: Detail[];
}

export interface LandState {
  zones: undefined | ZonesState;
}
