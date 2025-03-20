import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import ChoresPage from './pages/ChoresPage';
import ChildrenPage from './pages/ChildrenPage';
import RecordsPage from './pages/RecordsPage';
import AllowancesPage from './pages/AllowancesPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chores" element={<ChoresPage />} />
            <Route path="/children" element={<ChildrenPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/allowances" element={<AllowancesPage />} />
          </Routes>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
