
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './views/Home';
import Feedback from './views/Feedback';
import Resources from './views/Resources';
import Profile from './views/Profile';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
