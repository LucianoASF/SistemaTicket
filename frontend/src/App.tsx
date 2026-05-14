import { BrowserRouter, Route, Routes } from 'react-router';
import { Login } from './pages/Login';
import { AppLayout } from '#components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Tickets } from './pages/tickets/Tickets';
import { TicketDetails } from './pages/tickets/TicketDetails';
import { Users } from './pages/users/Users';
import { UserDetails } from './pages/users/UserDetails';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
