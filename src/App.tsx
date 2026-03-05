import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { usePersistentAppState } from "./hooks/usePersistentAppState";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { SkillDetailPage } from "./pages/SkillDetailPage";

function LegacySkillRedirect() {
  const { skillId } = useParams<{ skillId: string }>();

  if (!skillId) {
    return <Navigate to="/app" replace />;
  }

  return <Navigate to={`/app/skill/${skillId}`} replace />;
}

export default function App() {
  const [state, dispatch] = usePersistentAppState();

  usePomodoroTimer(state.timer, dispatch);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<DashboardPage state={state} dispatch={dispatch} />} />
      <Route path="/app/skill/:skillId" element={<SkillDetailPage state={state} dispatch={dispatch} />} />
      <Route path="/skill/:skillId" element={<LegacySkillRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
