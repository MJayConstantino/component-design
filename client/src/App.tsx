import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Act1Page from "@/pages/Act1Page";
import PrelimsPage from "@/pages/PrelimsPage";
import Act3Page from "@/pages/Act3Page";
import MidtermsPage from "@/pages/MidtermsPage";

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/act1" element={<Act1Page />} />
        <Route path="/prelims" element={<PrelimsPage />} />
        <Route path="/act3" element={<Act3Page />} />
        <Route path="/midterms" element={<MidtermsPage />} />
      </Routes>
    </Router>
  );
};

export default Main;
