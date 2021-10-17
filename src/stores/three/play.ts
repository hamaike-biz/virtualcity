import create from 'zustand';

interface State {
  currentZone: string;
  setCurrentZone: (zoneStr: string) => void;
}

export const useStore = create<State>(set => ({
  currentZone: '',
  setCurrentZone: zoneStr => set(state => ({currentZone: zoneStr}))
}));
