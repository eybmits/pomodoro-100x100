import { useEffect, useReducer, type Dispatch } from "react";
import type { AppState } from "../types";
import { appReducer, type AppAction } from "../state/reducer";
import { loadState, saveState } from "../state/storage";

export function usePersistentAppState(): [AppState, Dispatch<AppAction>] {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return [state, dispatch];
}
