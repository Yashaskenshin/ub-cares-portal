import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import FileUpload from './pages/FileUpload';
import ManualInputs from './pages/ManualInputs';
import ReportGeneration from './pages/ReportGeneration';
import Settings from './pages/Settings';
import ApiTester from './pages/ApiTester';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<FileUpload />} />
            <Route path="/inputs" element={<ManualInputs />} />
            <Route path="/reports" element={<ReportGeneration />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/api-tester" element={<ApiTester />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;