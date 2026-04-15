import { createContext, useContext, useState, type ReactNode } from 'react';
import { DEFAULT_INPUTS } from './types';
import type { ModelInputs } from './types';

interface ModelCtx {
  inputs: ModelInputs;
  setInputs: (next: ModelInputs) => void;
}

const Context = createContext<ModelCtx | null>(null);

export function ModelProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<ModelInputs>(DEFAULT_INPUTS);
  return (
    <Context.Provider value={{ inputs, setInputs }}>
      {children}
    </Context.Provider>
  );
}

export function useModel(): ModelCtx {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useModel must be used within ModelProvider');
  return ctx;
}
