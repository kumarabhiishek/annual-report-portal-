import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Component/Dashboard'
import AdminLogin from './admin/AdminLogin'
import AdminHome1 from './admin/AdminHome1'
import ComputerScience from './admin-views/academics/ComputerScience';
import Academics from './Component/front-views/Academics';
// import Finance from './admin-views/finance/Finance'
import BudgetAllocation from './admin-views/finance/BudgetAllocation'
import Research from './admin-views/research/Research'
import Publications from './admin-views/research/Publications'
import PlacementHero from './admin-views/placements/PlacementHero'
import Civil from './admin-views/academics/Civil'
import Electricals from './admin-views/academics/Electricals'
import Mechanical from './admin-views/academics/Mechanical'
import Researchmain from './Component/front-views/Researchmain'
import Placement from './Component/front-views/Placement'
import Finance from './Component/front-views/Finance'
import InfraStructure from './Component/front-views/InfraStructure'
import FinalReport from './Component/front-views/FinalReport'

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState("dashboard")

  const handleLogin = (type) => {
    if (type === "admin") {
      setIsAdminLoggedIn(true);
    }
    setCurrentView("home");
  };

  const handleBack = () => {
    setCurrentView("dashboard");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          currentView === "login" ? (
            <AdminLogin onLogin={handleLogin} onBack={handleBack} />
          ) : (
            <Dashboard
              isAdminLoggedIn={isAdminLoggedIn}
              setIsAdminLoggedIn={setIsAdminLoggedIn}
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
          )
        } />
        <Route path="/login" element={<AdminLogin onLogin={handleLogin} onBack={handleBack} />} />

        <Route path="/admin-home1" element={<AdminHome1 />} />
        <Route path="/computer-science" element={<ComputerScience />} />
        <Route path="/civil" element={<Civil />} />
        <Route path="/electrical" element={<Electricals />} />
        <Route path="/mechanical" element={<Mechanical />} />
        <Route path="/finance/budgetallocation" element={<BudgetAllocation />} />
        <Route path="/researchad" element={<Research />} />
        <Route path="/publication" element={<Publications />} />
        <Route path="/placementhero" element={<PlacementHero />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/research" element={<Researchmain />} />
        <Route path="/placement" element={<Placement />} />
        <Route path="/finance" element={<Finance />} />
        <Route path='/infrastructure' element={<InfraStructure />}></Route>
        <Route path='/report' element={<FinalReport/>} ></Route>


      </Routes>
    </BrowserRouter>
  )
}

export default App