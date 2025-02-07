import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import DetailsPage from './components/DetailsPage';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/details" element={<DetailsPage />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);

