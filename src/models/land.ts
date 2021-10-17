interface PositionState {
  x: number;
  z: number;
}

export interface Detail {
  id: string;
  positions: PositionState[];
  zone: string;
}

export interface LandState {
  positions: undefined | Detail[];
}
