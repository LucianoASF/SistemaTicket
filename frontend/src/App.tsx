import { BrowserRouter, Route, Routes } from 'react-router';
import { Login } from './pages/Login';
import { AppLayout } from '#components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Tickets } from './pages/tickets/Tickets';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
