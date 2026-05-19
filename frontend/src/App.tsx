import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { Login } from './pages/Login';
import { AppLayout } from '#components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Tickets } from './pages/tickets/Tickets';
import { TicketDetails } from './pages/tickets/TicketDetails';
import { Users } from './pages/users/Users';
import { UserDetails } from './pages/users/UserDetails';
import { AuthProvider } from './contexts/AuthProvider';
import { PrivateRoute } from './routes/PrivateRoute';
import { PublicRoute } from './routes/PublicRoute';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/tickets/:id" element={<TicketDetails />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserDetails />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
