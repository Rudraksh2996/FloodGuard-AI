import { create } from 'zustand';
import { Preset, NodeState, getPresetState, DELHI_NODES } from '@/lib/mock-data';
import { calculateFRI, FRIResult } from '@/lib/fri';

export interface EvaluatedNode extends NodeState {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  drainType: string;
  fri: FRIResult;
}

interface SimulatorState {
  preset: Preset;
  isPlaying: boolean;
  nodes: EvaluatedNode[];
  setPreset: (preset: Preset) => void;
  togglePlay: () => void;
  tick: () => void;
}

const PRESET_ORDER: Preset[] = ["CLEAR", "RAIN", "CHOKE", "STORM"];

const evaluateNodes = (preset: Preset): EvaluatedNode[] => {
  return DELHI_NODES.map(node => {
    const state = getPresetState(preset, node.id);
    const fri = calculateFRI(state.vPooling, state.aImpedance, state.rRate);
    return { ...node, ...state, fri };
  });
};

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  preset: "CLEAR",
  isPlaying: false,
  nodes: evaluateNodes("CLEAR"),
  setPreset: (preset) => {
    set({ preset, nodes: evaluateNodes(preset) });
  },
  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },
  tick: () => {
    const { preset, isPlaying } = get();
    if (!isPlaying) return;
    
    const currentIndex = PRESET_ORDER.indexOf(preset);
    if (currentIndex < PRESET_ORDER.length - 1) {
      const nextPreset = PRESET_ORDER[currentIndex + 1];
      set({ preset: nextPreset, nodes: evaluateNodes(nextPreset) });
    } else {
      set({ isPlaying: false });
    }
  }
}));
