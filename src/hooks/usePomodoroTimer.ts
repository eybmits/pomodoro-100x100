import { useEffect, type Dispatch } from "react";
import type { AppAction } from "../state/reducer";
import type { TimerState } from "../types";

export function usePomodoroTimer(timer: TimerState, dispatch: Dispatch<AppAction>): void {
  useEffect(() => {
    if (!timer.isRunning) {
      return;
    }

    const handle = window.setInterval(() => {
      dispatch({ type: "timerTick" });
    }, 1000);

    return () => {
      window.clearInterval(handle);
    };
  }, [timer.isRunning, dispatch]);

  useEffect(() => {
    if (!timer.isRunning || timer.remainingSec > 0) {
      return;
    }

    if (timer.phase === "focus") {
      dispatch({ type: "timerCompleteFocus" });
      return;
    }

    dispatch({ type: "timerCompleteBreak" });
  }, [timer.remainingSec, timer.phase, timer.isRunning, dispatch]);
}
