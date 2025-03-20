import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Opportunities from './pages/Opportunities'
import Profile from './pages/Profile';
// import UserOpportunities from './page_components/OpportunitiesPage/UserOpportunities';


const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/opportunities" element={<Opportunities />} />
            {/* <Route path="/oopportunities" element={<UserOpportunities />} /> */}
            {/* <Route path="/opportunity/:id" element={<OpportunityDetails />} />
            <Route path="/opportunity/:id/summary" element={<OpportunitySummary />} /> */}
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
