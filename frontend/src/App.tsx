import { BrowserRouter, Route, Routes } from 'react-router';
import { Login } from './pages/Login';
import { AppLayout } from '#components/AppLayout';
import { Dashboard } from './pages/Dashboard';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
