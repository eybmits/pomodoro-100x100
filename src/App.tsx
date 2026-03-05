import { Navigate, Route, Routes } from "react-router-dom";
import { usePersistentAppState } from "./hooks/usePersistentAppState";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { DashboardPage } from "./pages/DashboardPage";
import { SkillDetailPage } from "./pages/SkillDetailPage";

export default function App() {
  const [state, dispatch] = usePersistentAppState();

  usePomodoroTimer(state.timer, dispatch);

  return (
    <Routes>
      <Route path="/" element={<DashboardPage state={state} dispatch={dispatch} />} />
      <Route path="/skill/:skillId" element={<SkillDetailPage state={state} dispatch={dispatch} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
