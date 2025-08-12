import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CheckAuth from './components/CheckAuth.jsx'
import TicketDetailsPage from './pages/Ticket.jsx'
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Admin from './pages/Admin.jsx';
import Tickets from './pages/Tickets.jsx';
import Profile from './pages/Profile.jsx';
import { Toaster } from 'react-hot-toast';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/'
        element={<CheckAuth protectedRoute={true}>
          <Tickets/>
        </CheckAuth>}/>

        <Route 
        path="/ticket/:id"
        element={
          <CheckAuth protectedRoute={true}>
            <TicketDetailsPage/>
          </CheckAuth>
        }/>

        <Route 
        path="/login"
        element={
          <CheckAuth protectedRoute={false}>
            <Login/>
          </CheckAuth>
        }/>

        <Route
        path="/signup"
        element={
          <CheckAuth protectedRoute={false}>
            <Signup/>
          </CheckAuth>
        }
        />

        <Route 
        path="/admin"
        element={
          <CheckAuth protectedRoute={true}>
            <Admin/>
          </CheckAuth>
        }/>

        <Route 
        path="/profile"
        element={
          <CheckAuth protectedRoute={true}>
            <Profile/>
          </CheckAuth>
        }/>

      </Routes>
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '1rem',
            padding: '0.5rem',
            fontWeight: "600"
          },
          success: {
            style: { background: '#e0f8ec', color: '#05603a' },
          },
          error: {
            style: { background: '#fdecea', color: '#7a271a' },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
