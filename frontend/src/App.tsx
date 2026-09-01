import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { ClickBurst } from "./components/ClickBurst";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import OverviewPage from "./pages/OverviewPage";
import BusinessAssessmentPage from "./pages/BusinessAssessmentPage";
import ProcessAnalysisPage from "./pages/ProcessAnalysisPage";
import AIOpportunitiesPage from "./pages/AIOpportunitiesPage";
import RecommendationPage from "./pages/RecommendationPage";
import SolutionArchitecturePage from "./pages/SolutionArchitecturePage";
import BusinessCasePage from "./pages/BusinessCasePage";
import ImplementationRoadmapPage from "./pages/ImplementationRoadmapPage";
import RiskGovernancePage from "./pages/RiskGovernancePage";
import ExecutiveSummaryPage from "./pages/ExecutiveSummaryPage";
import PresentationModePage from "./pages/PresentationModePage";

export default function App() {
  return (
    <>
      <ClickBurst />
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/app/presentation" element={<PresentationModePage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="assessment" element={<BusinessAssessmentPage />} />
        <Route path="process" element={<ProcessAnalysisPage />} />
        <Route path="opportunities" element={<AIOpportunitiesPage />} />
        <Route path="recommendation" element={<RecommendationPage />} />
        <Route path="architecture" element={<SolutionArchitecturePage />} />
        <Route path="business-case" element={<BusinessCasePage />} />
        <Route path="roadmap" element={<ImplementationRoadmapPage />} />
        <Route path="risk-governance" element={<RiskGovernancePage />} />
        <Route path="executive-summary" element={<ExecutiveSummaryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
