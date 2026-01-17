import { create } from 'zustand';

export type AlignmentScore = {
  value: string;
  score: number;
}[];

export type TranscriptSegment = {
  id: string;
  speaker: string;
  text: string;
  scores: AlignmentScore; // e.g. [{ value: "Move Fast", score: 5 }]
};

export type AnalysisResult = {
  summary: string;
  segments: TranscriptSegment[];
};

interface AppState {
  coreValues: string[];
  transcript: string;
  analysisResult: AnalysisResult | null;
  status: 'idle' | 'analyzing' | 'done' | 'error';
  isCeoMode: boolean;

  // Actions
  setCoreValues: (values: string[]) => void;
  setTranscript: (text: string) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setStatus: (status: AppState['status']) => void;
  toggleCeoMode: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  coreValues: [],
  transcript: '',
  analysisResult: null,
  status: 'idle',
  isCeoMode: false,

  setCoreValues: (values) => set({ coreValues: values }),
  setTranscript: (transcript) => set({ transcript }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setStatus: (status) => set({ status }),
  toggleCeoMode: () => set((state) => ({ isCeoMode: !state.isCeoMode })),
  reset: () => set({
    coreValues: [],
    transcript: '',
    analysisResult: null,
    status: 'idle',
    isCeoMode: false
  }),
}));
